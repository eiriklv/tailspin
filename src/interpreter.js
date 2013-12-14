/*
 * Tailspin - Reversible JS implemented in JS.
 * Will Thimbleby <will@thimbleby.net>
 *
 * Execution of parse trees in continuation passing style.
 */

/*
 * Based on the Narcissus JavaScript engine.
 *
 * The Initial Developer of the Original Code is
 * Brendan Eich <brendan@mozilla.org>.
 * Portions created by the Initial Developer are Copyright (C) 2004
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Tom Austin <taustin@ucsc.edu>
 *   Brendan Eich <brendan@mozilla.org>
 *   Shu-Yu Guo <shu@rfrn.org>
 *   Dave Herman <dherman@mozilla.com>
 *   Dimitris Vardoulakis <dimvar@ccs.neu.edu>
 *   Patrick Walton <pcwalton@mozilla.com>
 *
 */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


// Outer non-strict code.
(function () {

// Set constants in the local scope.
eval(Definitions.consts);

function nonStrictGetValue(base, name) {
    return base[name];
}
function nonStrictPutValue(base, name, value) {
    return base[name] = value;
}
function nonStrictDeleteValue(base, name) {
    return delete base[name];
}

Interpreter = function () {
"use strict";

var GLOBAL_CODE = 0, EVAL_CODE = 1, FUNCTION_CODE = 2;

// Create a new sandbox.
var exports = {};
var sandboxExports = new Sandbox(exports);
var sandbox = sandboxExports.sandbox;
var global = sandboxExports.global;
var functionInternals = sandboxExports.functionInternals;
var sandboxError = sandboxExports.sandboxError;
var sandboxArray = sandboxExports.sandboxArray;
var newTypeError = sandboxExports.newTypeError;
var newReferenceError = sandboxExports.newReferenceError;
var ExecutionContext = sandboxExports.ExecutionContext;

// Grab useful functions.
var isPrimitive = sandboxExports.isPrimitive;
var isObject = sandboxExports.isObject;
var checkObjectCoercible = sandboxExports.checkObjectCoercible;
var toObjectCheck = sandboxExports.toObjectCheck;
var toObject = sandboxExports.toObject;
var Activation = sandboxExports.Activation;
var newFunction = sandboxExports.newFunction;
var hasInstance = sandboxExports.hasInstance;
var constructFunction = sandboxExports.constructFunction;
var callFunction = sandboxExports.callFunction;

var hasDirectProperty = Definitions.hasDirectProperty;


function Reference(base, propertyName, node) {
    this.base = base;
    this.propertyName = propertyName;
    this.node = node;
}

Reference.prototype.toString = function () {
    return Decompiler.pp(this.node);
};

// returns true if reference exists
// returns false otherwise and has called thrw continuation
function ensureReferenceExists(v, thrw, prev) {
    if (v instanceof Reference) {
        if (!v.base) {
            thrw(newReferenceError(v.propertyName + " is not defined",
                                    v.node.filename, v.node.lineno), prev);
            return false;
        }
    }
    else {
        thrw(newReferenceError(v.propertyName + " is not a reference",
                                v.node.filename, v.node.lineno), prev);
        return false;
    }
    return true;
}

// returns a new prev continuation that saves the value base[key]
// the new continuation undoes any change to base[key] and then runs the previous prev
function prevSaveValue(base, key, prev) {
    var newPrev = prev;
    if (prev) {
        // create a function to reverse any change to base[ref]
        var hadValue = hasDirectProperty(base, key);
        var oldValue = base[key];
        if (hadValue) {
            newPrev = function() {
                base[key] = oldValue;
                prev();
            };
        }
        else if (key !== "length" && hasDirectProperty(base, "length")) {
            // Special handling of array length.
            var lenPrev = prevSaveValue(base, "length", prev);
            newPrev = function() {
                delete base[key];
                lenPrev();
            };
        }
        else {
            newPrev = function() {
                delete base[key];
                prev();
            };
        }
    }
    return newPrev;
}

function prevDeleteValue(base, key, prev) {
    var newPrev = prev;
    if (prev && base.hasOwnProperty(key)) {
        newPrev = prevSaveValue(base, key, prev);
        delete base[key];
    }
    return newPrev;
}

function getValue(ref, next, thrw, strict, prev) {
    var value;
    if (ref instanceof Reference) {
        if (ref.base === null || ref.base === undefined) {
            thrw(newReferenceError(ref.propertyName + " is not defined",
                                    ref.node.filename, ref.node.lineno), prev);
            return;
        }
        else {
            if (strict) {
                // if we are in strict mode, get the property in a strict function
                // the browser's javascript will then catch the bad accesses
                value = ref.base[ref.propertyName];
            }
            else {
                // otherwise access using a non-strict function
                value = nonStrictGetValue(ref.base, ref.propertyName);
            }
        }
    }
    else {
        value = ref;
    }
    
    next(value, prev, ref);
}

function putValue(x, ref, value, refNode, strict, next, thrw, prev) {
    if (ref instanceof Reference) {
        var base = (ref.base || global);
        var newPrev = prevSaveValue(base, ref.propertyName, prev);
        
        var result;
        if (strict) {
            // if we are in strict mode, run the assignment in a strict function
            // the browser's javascript will then catch the bad assignments
            result = base[ref.propertyName] = value;
        }
        else {
            // otherwise access using a non-strict function
            result = nonStrictPutValue(base, ref.propertyName, value);
        }
        next(result, newPrev);
    }
    else {
        thrw(newReferenceError("Invalid assignment left-hand side",
                                 refNode.filename, refNode.lineno), prev);
    }
}

function executeGV(n, x, next, ret, cont, brk, thrw, prev) {
    // execute then getValue of the returned var then continue
    execute(n, x, function(r, prev) {
            getValue(r, next, thrw, x.strict, prev);
        },
        function(r, prev) {
            getValue(r, ret, thrw, x.strict, prev);
        }, cont, brk, thrw, prev);
}

var counter = 0;

var executeFunctions = [];

// executeFunctions each handle a specific type of AST node
// n     the AST node we are interpreting
// x     the current execution context to interpret in

// next(result, prev, ref?)
//   the continuation which takes the result of executing the AST node
//   result is the result of the current computation
//   prev is the reversible continuation
//   ref is the reference to result, an optional parameter passed from getValue and executeGV

// ret(result, prev)
//   the continuation for return statements
//   result is the result of the return, which is also put in x.result
//   prev is the reversible continuation

// cont(target, prev)
//   the continuation for continue statements, inside for and while loops
//   target is the label of the scope the continue will happen in
//   prev is the reversible continuation

// brk(target, prev)
//   the continuation for break statements, inside for and while loops
//   target is the label of the scope the break will happen in
//   prev is the reversible continuation

// thrw  the continuation for throwing exceptions

executeFunctions[FUNCTION] = function exFunction(n, x, next, ret, cont, brk, thrw, prev) {
    var newFn;
    
    // Define this function in its own scope.
    if (n.functionForm !== Parser.DECLARED_FORM) {
        if (!n.name || n.functionForm === Parser.STATEMENT_FORM) {
            newFn = newFunction(n, x);
            if (n.functionForm === Parser.STATEMENT_FORM) {
                Definitions.defineProperty(x.scope.object, n.name, newFn, true);
            }
        }
        else {
            var t = new sandbox.Object();
            x.scope = {object: t, parent: x.scope};
            try {
                newFn = newFunction(n, x);
                Definitions.defineProperty(t, n.name, newFn, true, true);
            }
            finally {
                x.scope = x.scope.parent;
            }
        }
    }
    
    next(newFn, prev);
};

executeFunctions[SCRIPT] = function exScript(n, x, next, ret, cont, brk, thrw, prev) {
    var delPrev = function (object, name, prev) {
        var newPrev = prev;
        if (prev) {
            newPrev = function () {
                delete object[name];
                prev();
            };
        }
        return newPrev;
    }
    
    // Hoist variable and function definitions to top of scope.
    var t = x.scope.object;
    var funDecls = n.funDecls;
    for (var i = 0, c = funDecls.length; i < c; i++) {
        var name = funDecls[i].name;
        var f = newFunction(funDecls[i], x);
        // ECMA-262 says function bindings not created by `eval' are non-deleteable.
        //   (x.type !== EVAL_CODE)
        // But for reversible code we define all fns as deletable.
        // All function declarations start as the function.
        var deletable = prev || x.type === EVAL_CODE;
        
        // Special handling for parameters of Activations which are defined as getter/setters.
        if (hasDirectProperty(t, name)) {
            t[name] = f;
        }
        else {
            Object.defineProperty(t, name, {value:f, configurable:deletable, writable:true});
        }
        
        prev = delPrev(t, name, prev);
    }
    
    var varDecls = n.varDecls;
    for (var i = 0, c = varDecls.length; i < c; i++) {
        var v = varDecls[i];
        var name = v.name;
        if (v.readOnly && hasDirectProperty(t, name)) {
            thrw(newTypeError("Redeclaration of const " + name,
                                v.filename, v.lineno), prev);
            return;
        }
        if (v.readOnly || !hasDirectProperty(t, name)) {
            // ECMA-262 says variable bindings created by `eval' are deleteable.
            // But for reversible code we define all vars as deletable.
            // All var declarations start as undefined.
            var deletable = prev || x.type === EVAL_CODE;
            Object.defineProperty(t, name, {value:undefined, configurable:deletable, writable:true});
            
            prev = delPrev(t, name, prev);
        }
    }
    
    // Handle script as a block.
    executeFunctions[BLOCK](n, x, next, ret, cont, brk, thrw, prev);
};

executeFunctions[BLOCK] = function exBlock(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    // for loop in continuation passing style
    var forLoop = function(i, prev) {
        if (i < c.length) {
            execute(c[i], x, function(value, prev) {forLoop(i+1, prev);}, ret, cont, brk, thrw, prev);
        }
        else {
            next(undefined, prev);
        }
    };
    forLoop(0, prev);
};

executeFunctions[IF] = function exIf(n, x, next, ret, cont, brk, thrw, prev) {
    var ifNext = function ifNext(conditionValue, prev) {
        if (conditionValue) {
            execute(n.thenPart, x, next, ret, cont, brk, thrw, prev);
        }
        else if (n.elsePart) {
            execute(n.elsePart, x, next, ret, cont, brk, thrw, prev);
        }
        else {
            next(conditionValue, prev);
        }
    };
    executeGV(n.condition, x, ifNext, ret, cont, brk, thrw, prev);
};

executeFunctions[SWITCH] = function exSwitch(n, x, next, ret, cont, brk, thrw, prev) {
    var switchBody = function(switchValue, prev) {
        var cases = n.cases;
        
        // Called at the end of executing a case.
        // Either executes the next case or exits the switch.
        var caseEnd = function(i, prev) {
            // If we hit the end of the switch statement then exit.
            if (i === cases.length) {
                // Exit switch.
                next(undefined, prev);
            }
            else {
                // Otherwise continue executing the next case statement.
                caseBody(i, prev);
            }
        };
        
        // Function that executes the case statements.
        var caseBody = function(i, prev) {
            var caseT = cases[i];
            if (caseT.statements.children.length) {
                // New break continutation.
                var newBrk = function(target, prev) {
                    if (target === n) {
                        // Exit switch loop.
                        next(undefined, prev);
                    }
                    else {
                        // Break in outer scope.
                        brk(target, prev);
                    }
                };
                var newNext = function(ignored, prev) {
                    // Continue with the next case.
                    caseEnd(i+1, prev);
                };
                
                execute(caseT.statements, x, newNext, ret, cont, newBrk, thrw, prev);
            }
            else {
                // Skip continue with the next case.
                caseEnd(i+1, prev);
            }
        };
        
        // Function that loops through the cases and executes the correct one.
        var loopFn = function(i, prev) {
            // If we hit the end of the switch, either default or exit
            if (i === cases.length) {
                if (n.defaultIndex >= 0) {
                    // No case matched, do default.
                    caseBody(n.defaultIndex, prev);
                }
                else {
                    // No match exit switch.
                    next(undefined, prev);
                }
            }
            else {
                // Next case (might be default!)
                var theCase = cases[i];
                
                if (theCase.type === CASE) {
                    executeGV(theCase.caseLabel, x, function(caseValue, prev) {
                        if (caseValue === switchValue) {
                            // Execute this case.
                            caseBody(i, prev);
                        }
                        else {
                            // Continue looping through case statements.
                            loopFn(i+1, prev);
                        }
                    }, ret, cont, brk, thrw, prev);
                } else {
                    // Skip the default case and continue looping through case statements.
                    loopFn(i+1, prev);
                }
            }
        };
        
        loopFn(0, prev);
    };
    
    executeGV(n.discriminant, x, switchBody, ret, cont, brk, thrw, prev);
};

executeFunctions[FOR] = function exFor(n, x, next, ret, cont, brk, thrw, prev) {
    var contFn = function(ignored, prev) {
        if (n.update) {
            executeGV(n.update, x, whileBodyCondition, ret, null, null, thrw, prev);
        }
        else {
            whileBodyCondition(null, prev);
        }
    };
    
    // execute the body of the loop with continue and break continuations that catch
    // breaks or continues that match this target
    var whileBody = function(prev) {
        // New continue continuation.
        var newCont = function(target, prev) {
            if (target === n) {
                contFn(null, prev);
            }
            else {
                // Targets did not match, continue in outer scope.
                cont(target, prev);
            }
        };
        // New break continuation.
        var newBrk = function(target, prev) {
            if (target === n) {
                next(undefined, prev);
            }
            else {
                // Targets did not match, break in outer scope.
                brk(target, prev);
            }
        };
        
        execute(n.body, x, contFn, ret, newCont, newBrk, thrw, prev);
    };
    
    var whileBodyCondition = function(ignored, prev) {
        // Handle body with or without condition.
        if (!n.condition) {
            // Continue loop.
            whileBody(prev);
        }
        else {
            // Continuation to handle the result of the condition.
            var nextFor = function(conditionValue, prev) {
                if (conditionValue) {
                    // Continue loop.
                    whileBody(prev);
                }
                else {
                    // Exit the loop.
                    next(undefined, prev);
                }
            };
            
            executeGV(n.condition, x, nextFor, ret, cont, brk, thrw, prev);
        }
    };
    
    if (n.type === WHILE) {
        whileBodyCondition(null, prev);
    }
    else {
        if (n.setup) {
            executeGV(n.setup, x, whileBodyCondition, ret, cont, brk, thrw, prev);
        }
        else {
            whileBodyCondition(null, prev);
        }
    }
};

executeFunctions[WHILE] = executeFunctions[FOR];

executeFunctions[FOR_IN] = function exForIn(n, x, next, ret, cont, brk, thrw, prev) {
    var body = function(ignored, prev) {
        var r = n.iterator;
        var a = [];
        
        var forLoop = function(i, prev) {
            if (i < a.length) {
                execute(r, x, function(pv) {
                    // New continue continuation.
                    var newCont = function(target, prev) {
                        if (target === n) {
                            // Continue looping.
                            forLoop(i+1, prev);
                        }
                        else {
                            // Targets did not match, continue in outer scope.
                            cont(target, prev);
                        }
                    };
                    // New break continuation.
                    var newBrk = function(target) {
                        if (target === n) {
                            // Exit loop.
                            next(undefined, prev);
                        }
                        else {
                            // Targets did not match, break in outer scope.
                            brk(target, prev);
                        }
                    };
                    
                    putValue(x, pv, a[i], r, x.strict, function(r, prev) {
                        execute(n.body, x, function(ignored, prev) {
                            // Continue with the loop.
                            forLoop(i+1, prev);
                          }, ret, newCont, newBrk, thrw, prev);}, thrw, prev);
                  }, ret, cont, brk, thrw, prev);
            }
            else {
                // End loop.
                next(undefined, prev);
            }
        };
        
        // Execute and get the value of the object to iterate over.
        executeGV(n.object, x, function(objectIn, prev, ref) {
                var t = (objectIn === null || objectIn === undefined) ? objectIn : toObjectCheck(objectIn, ref, n.object);
                for (var i in objectIn) {
                    a.push(i);
                }
            
                // Run loop.
                forLoop(0, prev);
            }, ret, cont, brk, thrw, prev);
    };
    
    // Execute the for-in body after a potential var-decl.
    if (n.varDecl) {
        execute(n.varDecl, x, body, ret, cont, brk, thrw, prev);
    }
    else {
        body(undefined, prev);
    }
};

executeFunctions[DO] = function exDo(n, x, next, ret, cont, brk, thrw, prev) {
    // Loop executing n.body while n.condition is true.
    var doCondition = function(ignored, prev) {
        // Check while condition.
        var nextLoop = function(conditionValue, prev) {
            if (conditionValue) {
                // Keep looping.
                forLoop(prev);
            }
            else {
                // Exit loop.
                next(undefined, prev);
            }
        };
        
        executeGV(n.condition, x, nextLoop, ret, null, null, thrw, prev);
    };
    
    // New continue continuation
    var newCont = function(target, prev) {
        if (target === n) {
            // Continue the loop.
            forLoop(prev);
        }
        else {
            // Targets did not match, continue in outer scope.
            cont(target, prev);
        }
    };
    
    // New break continuation.
    var newBrk = function(target, prev) {
        if (target === n) {
            // Exit the loop.
            next(undefined, prev);
        }
        else {
            // Targets did not match, break in outer scope.
            brk(target, prev);
        }
    };
    
    var forLoop = function(prev) {
        // Execute loop body.
        execute(n.body, x, doCondition, ret, newCont, newBrk, thrw, prev);
    };
    
    forLoop(prev);
};

executeFunctions[BREAK] = function exBreak(n, x, next, ret, cont, brk, thrw, prev) {
    brk(n.target, prev);
};

executeFunctions[CONTINUE] = function exContinue(n, x, next, ret, cont, brk, thrw, prev) {
    cont(n.target, prev);
};

executeFunctions[TRY] = function exTry(n, x, next, ret, cont, brk, thrw, prev) {
    if (n.finallyBlock) {
        // Wrap all continuations in finally.
        var finalWrap = function(fn, ret, cont, brk, thrw) {
            return function(r, prev) {
                // We may already be returning something from the try or catch
                // blocks so nextWrap passes that value through to the wrapped function.
                var savedResult = x.result;
                var nextWrap = function(ignored, prev) {
                    x.result = savedResult;
                    fn(r, prev);
                };
                execute(n.finallyBlock, x, nextWrap, ret, cont, brk, thrw, prev);
            }
        };
        
        next = finalWrap(next, ret, cont, brk, thrw);
        ret = finalWrap(ret, ret, cont, brk, thrw);
        cont = finalWrap(cont, ret, cont, brk, thrw);
        brk = finalWrap(brk, ret, cont, brk, thrw);
        thrw = finalWrap(thrw, ret, cont, brk, thrw);
    }
    
    // Exception handling continuation.
    var exception = function(e, prev) {
        x.result = undefined;
        
        // Assume 1 catch clause without guard for now.
        if (n.catchClauses.length === 1) {
            var t = n.catchClauses[0];
            x.scope = {object: new Activation(), parent: x.scope};
            Definitions.defineProperty(x.scope.object, t.varName, e, true);
            
            execute(t.block, x, function(ignored, prev) {
                    x.scope = x.scope.parent;
                    next(undefined, prev);
                }, ret, cont, brk, thrw, prev);
        }
        else {
            thrw(e, prev);
        }
    };
    
    execute(n.tryBlock, x, next, ret, cont, brk, exception, prev);
};

executeFunctions[THROW] = function exThrow(n, x, next, ret, cont, brk, thrw, prev) {
    // get the value of the exception and throw it with the thrw continuation
    executeGV(n.exception, x, thrw, ret, cont, brk, thrw, prev);
};

executeFunctions[RETURN] = function exReturn(n, x, next, ret, cont, brk, thrw, prev) {
    // Check for returns with no return value
    if (n.value) {
        executeGV(n.value, x, function(r, prev) {
            x.result = r;
            ret(r, prev);
          }, ret, cont, brk, thrw, prev);
    }
    else {
        x.result = undefined;
        ret(undefined, prev);
    }
};

executeFunctions[WITH] = function exWith(n, x, next, ret, cont, brk, thrw, prev) {
    var withBody = function(inScope, prev, ref) {
        // Create a execution context with a new scope inside the inScope object.
        inScope = toObjectCheck(inScope, ref, n.object);
        var newX = x.copy();
        newX.scope = {object:inScope, parent:x.scope};
        
        // Execute the body of the with statement in the new scope.
        execute(n.body, newX, next, ret, cont, brk, thrw, prev);
    };
    
    executeGV(n.object, x, withBody, ret, cont, brk, thrw, prev);
};

executeFunctions[VAR] = function exVar(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    //for (i = 0; i < c.length; i++) {
    var forLoop = function(i, prev) {
        if (i < c.length) {
            var u = c[i].initializer;
            if (!u) {
                forLoop(i+1, prev); // continue
            }
            else {
                var name = c[i].name;
                for (var s = x.scope; s; s = s.parent) {
                    if (hasDirectProperty(s.object, name)) {
                        break;
                    }
                }
                executeGV(u, x, function(value, prev) {
                        // Create a function to reverse this assignment.
                        var newPrev = prevSaveValue(s.object, name, prev);
                        // Set the new value.
                        nonStrictPutValue(s.object, name, value);
                        
                        // Continue the loop, incrementing i.
                        forLoop(i+1, newPrev);
                    }, ret, cont, brk, thrw, prev);
            }
        }
        else {
            next(undefined, prev); // end loop
        }
    };
    
    forLoop(0, prev);
};

// executeFunctions[CONST] = executeFunctions[VAR];

executeFunctions[SEMICOLON] = function exSemicolon(n, x, next, ret, cont, brk, thrw, prev) {
    if (n.expression) {
        executeGV(n.expression, x, function(r, prev) {x.result = r; next(undefined, prev);},
            ret, cont, brk, thrw, prev);
    }
    else {
        next(undefined, prev);
    }
};

executeFunctions[LABEL] = function exLabel(n, x, next, ret, cont, brk, thrw, prev) {
    // execute n, setting up a break callback that continues with next() if the targets match
    // or breaks again if the targets don't match
    // fixme: is this needed?? -- what about continue??
    execute(n.statement, x, next, ret, cont, function(target, prev) {
            if (target === n.target) {
                next(undefined, prev);
            }
            else {
                brk(target, prev);
            }
        }, thrw, prev);
};

executeFunctions[COMMA] = function exComma(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    var forLoop = function(i, lastValue, prev) {
        if (i < c.length) {
            executeGV(c[i], x, function(v, prev) {forLoop(i+1, v, prev);},
                ret, cont, brk, thrw, prev);
        }
        else {
            next(lastValue, prev); // exit with last value
        }
    };
    forLoop(0, undefined, prev);
};

executeFunctions[ASSIGN] = function exAssign(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    var assignFn = function(r) {
        var t = n.assignOp;
        
        function assign(u, prev) {
            executeGV(c[1], x, function(v, prev) {
                    if (t) {
                        switch (t) {
                          case BITWISE_OR:  v = u | v; break;
                          case BITWISE_XOR: v = u ^ v; break;
                          case BITWISE_AND: v = u & v; break;
                          case LSH:         v = u << v; break;
                          case RSH:         v = u >> v; break;
                          case URSH:        v = u >>> v; break;
                          case PLUS:        v = u + v; break;
                          case MINUS:       v = u - v; break;
                          case MUL:         v = u * v; break;
                          case DIV:         v = u / v; break;
                          case MOD:         v = u % v; break;
                        }
                    }
                    putValue(x, r, v, c[0], x.strict, next, thrw, prev);
                }, ret, cont, brk, thrw, prev);
        }
        
        if (t) {
            getValue(r, assign, thrw, x.strict, prev);
        }
        else {
            // in strict mode ensure we are not assigning to a new reference
            if (!x.strict || ensureReferenceExists(r, thrw, prev)) {
                assign(undefined, prev);
            }
        }
    };
    execute(c[0], x, assignFn, ret, cont, brk, thrw, prev);
};

executeFunctions[HOOK] = function exHook(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    executeGV(c[0], x, function(conditionValue, prev) {
            executeGV(conditionValue? c[1] : c[2], x, next, ret, cont, brk, thrw, prev);
        }, ret, cont, brk, thrw, prev);
};

executeFunctions[OR] = function exOr(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    var orFn = function(a, prev) {
        if (a) {
            next(a, prev);
        }
        else {
            executeGV(c[1], x, function(b, prev) {
                next(b, prev);
            }, ret, cont, brk, thrw, prev);
        }
    };
    executeGV(c[0], x, orFn, ret, cont, brk, thrw, prev);
};

executeFunctions[AND] = function exAnd(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    var andFn = function(a, prev) {
        if (!a) {
            next(a, prev);
        }
        else {
            executeGV(c[1], x, function(b, prev) {
                next(b, prev);
            }, ret, cont, brk, thrw, prev);
        }
    };
    executeGV(c[0], x, andFn, ret, cont, brk, thrw, prev);
};

function binaryOperator(fn) {
    // Return a function that executes the binary operator fn.
    return function(n, x, next, ret, cont, brk, thrw, prev) {
        var c = n.children;
        // Execute and get the value of operand A.
        executeGV(c[0], x, function(a, prev) {
            // Execute and get the value of operand B.
            executeGV(c[1], x, function(b, prev) {
              // Pass the result of fn to the next continuation.
              next(fn(a, b), prev);
          }, ret, cont, brk, thrw, prev); }, ret, cont, brk, thrw, prev);
    }
}

function unaryOperator(fn) {
    // Return a function that executes the unary operator fn.
    return function(n, x, next, ret, cont, brk, thrw, prev) {
        // Execute and get the value of the operand.
        executeGV(n.children[0], x, function(a, prev) {
            // Pass the result of fn to the next continuation.
            next(fn(a), prev);
          }, ret, cont, brk, thrw, prev);
    };
}

executeFunctions[BITWISE_OR] = binaryOperator(function(a, b) {return a | b;});

executeFunctions[BITWISE_XOR] = binaryOperator(function(a, b) {return a ^ b;});

executeFunctions[BITWISE_AND] = binaryOperator(function(a, b) {return a & b;});

executeFunctions[EQ] = binaryOperator(function(a, b) {return a == b;});

executeFunctions[NE] = binaryOperator(function(a, b) {return a != b;});

executeFunctions[STRICT_EQ] = binaryOperator(function(a, b) {return a === b;});

executeFunctions[STRICT_NE] = binaryOperator(function(a, b) {return a !== b;});

executeFunctions[LT] = binaryOperator(function(a, b) {return a < b;});

executeFunctions[LE] = binaryOperator(function(a, b) {return a <= b;});

executeFunctions[GT] = binaryOperator(function(a, b) {return a > b;});

executeFunctions[GE] = binaryOperator(function(a, b) {return a >= b;});

executeFunctions[IN] = binaryOperator(function(a, b) {return a in b;});

executeFunctions[INSTANCEOF] = function exInstanceOf(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    executeGV(c[0], x, function(t, prev) {
        executeGV(c[1], x, function(u, prev) {
          var v;
          if (isObject(u) && functionInternals.has(u)) {
              v = hasInstance(u, t);
          }
          else {
              v = t instanceof u;
          }
          next(v, prev);
      }, ret, cont, brk, thrw, prev); }, ret, cont, brk, thrw, prev);
};

executeFunctions[LSH] = binaryOperator(function(a, b) {return a << b;});

executeFunctions[RSH] = binaryOperator(function(a, b) {return a >> b;});

executeFunctions[URSH] = binaryOperator(function(a, b) {return a >>> b;});

executeFunctions[PLUS] = binaryOperator(function(a, b) {return a + b;});

executeFunctions[MINUS] = binaryOperator(function(a, b) {return a - b;});

executeFunctions[MUL] = binaryOperator(function(a, b) {return a * b;});

executeFunctions[DIV] = binaryOperator(function(a, b) {return a / b;});

executeFunctions[MOD] = binaryOperator(function(a, b) {return a % b;});

executeFunctions[DELETE] = function exDelete(n, x, next, ret, cont, brk, thrw, prev) {
    execute(n.children[0], x, function(t, prev) {
            var v = !(t instanceof Reference) || !t.base;
            var newPrev = prev;
            if (!v) {
                newPrev = prevSaveValue(t.base, t.propertyName, prev);
                
                if (x.strict) {
                    // already in strict code, just delete normally
                    v = delete t.base[t.propertyName];
                }
                else {
                    // otherwise delete using a non-strict function
                    v = nonStrictDeleteValue(t.base, t.propertyName);
                }
            }
            next(v, newPrev);
        }, ret, cont, brk, thrw, prev);
};

executeFunctions[VOID] = function exVoid(n, x, next, ret, cont, brk, thrw, prev) {
    // GetValue must be called even though its value is not used because it may have observable side-effects.
    executeGV(n.children[0], x, function(v, prev) {
            // cannot just pass next to executeGV as we need to remove the value passed
            next(undefined, prev);
        }, ret, cont, brk, thrw, prev);
};

executeFunctions[TYPEOF] = function exTypeof(n, x, next, ret, cont, brk, thrw, prev) {
    execute(n.children[0], x, function(t, prev) {
            if (t instanceof Reference) {
                t = t.base ? t.base[t.propertyName] : undefined;
            }
            next(typeof t, prev);
        }, ret, cont, brk, thrw, prev);
};

executeFunctions[NOT] = unaryOperator(function(a) {return !a;});

executeFunctions[BITWISE_NOT] = unaryOperator(function(a) {return ~a;});

executeFunctions[UNARY_PLUS] = unaryOperator(function(a) {return +a;});

executeFunctions[UNARY_MINUS] = unaryOperator(function(a) {return -a;});

executeFunctions[INCREMENT] = function exIncrement(n, x, next, ret, cont, brk, thrw, prev) {
    executeGV(n.children[0], x, function(value, prev, ref) {
            var numValue = Number(value);
            var originalValue = numValue;
            var newValue = (n.type === INCREMENT) ? ++numValue : --numValue;
            
            putValue(x, ref, newValue, n.children[0], x.strict, function(result, prev) {
                next(n.postfix? originalValue : numValue, prev);
            }, thrw, prev);
        }, ret, cont, brk, thrw, prev);
};

executeFunctions[DECREMENT] = executeFunctions[INCREMENT];

executeFunctions[DOT] = function exDot(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    executeGV(c[0], x, function(t, prev, ref) {
            var u = c[1].value;
            //checkObjectCoercible(t, ref, c[0])
            //var v = new Reference(t, u, n);
            var v = new Reference(toObjectCheck(t, ref, c[0]), u, n);
            next(v, prev);
        }, ret, cont, brk, thrw, prev);
};

executeFunctions[INDEX] = function exIndex(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    executeGV(c[0], x, function(t, prev, ref) {
      executeGV(c[1], x, function(u, prev) {
        next(new Reference(toObjectCheck(t, ref, c[0]), String(u), n), prev);
      }, ret, cont, brk, thrw, prev);
    }, ret, cont, brk, thrw, prev);
};

executeFunctions[LIST] = function exList(n, x, next, ret, cont, brk, thrw, prev) {
    // Arguments is not an Array object, it will be converted in FunctionInternals.call.
    var v = [];
    var c = n.children;
    var forLoop = function(i, prev) {
        if (i < c.length) {
            executeGV(c[i], x, function(u, prev) {
                    v[i] = u;
                    forLoop(i+1, prev);
                }, ret, cont, brk, thrw, prev);
        }
        else {
            next(v, prev);
        }
    };
    forLoop(0, prev);
};

executeFunctions[CALL] = function exCall(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    executeGV(c[0], x, function(f, prev, r) {
        execute(c[1], x, function(a, prev) {
            if (typeof f !== "function") {
                thrw(newTypeError(f + " is not callable", c[0].filename, c[0].lineno), prev);
            }
            else {
                // Get the value for the 'this' of the function being called.
                var t;
                var options;
                
                // special case handling of non-direct calling of eval function 15.1.2.1.1
                if (f === sandbox.eval && (!(r instanceof Reference) || r.propertyName !== "eval" || r.base[r] !== sandbox.eval)) {
                    options = {indirectEval:true};
                }
                else if (f === sandbox.eval) {
                    // 10.4.2 Entering Eval Code.
                    // Set the ThisBinding to the same value as the ThisBinding of the calling execution context.
                    t = x.thisObject;
                }
                else {
                    t = (r instanceof Reference) ? r.base : undefined;
                    if (t instanceof Activation) {
                        t = undefined;
                    }
                }
                
                // handle control on return from calling
                if (x.control) {
                    var next_o = next;
                    next = function(v, prev) {
                        var newPrev = prevSaveValue(x, "returnedValue", prev);
                        x.returnedValue = v;
                        x.control(n, x, function(prev){ next_o(v, prev); }, newPrev);
                    };
                }
                callFunction(f, t, a, x, next, ret, cont, brk, thrw, prev, options);
            }
        }, ret, cont, brk, thrw, prev);
    }, ret, cont, brk, thrw, prev);
};

executeFunctions[NEW] = function exNew(n, x, next, ret, cont, brk, thrw, prev) {
    var c = n.children;
    // execute the fn name then create it
    executeGV(c[0], x, function(f, prev, ref) {
        // function to create the new object and then call next
        var constructFn = function(args, prev) {
            if (typeof f !== "function") {
                thrw(newTypeError(ref + " is not a constructor", c[0].filename, c[0].lineno), prev);
            }
            else {
                constructFunction(f, args, x, next, ret, cont, brk, thrw, prev);
            }
        };
        
        if (n.type === NEW) {// fixme: what is this???
            var a = new sandbox.Object();
            Definitions.defineProperty(a, "length", 0, false, false, true);
            constructFn(a, prev);
        } else {
            // Execute the arguments then call constructFn.
            execute(c[1], x, constructFn, ret, cont, brk, thrw, prev);
        }
      }, ret, cont, brk, thrw, prev);
};

executeFunctions[NEW_WITH_ARGS] = executeFunctions[NEW];

executeFunctions[ARRAY_INIT] = function exArrayInit(n, x, next, ret, cont, brk, thrw, prev) {
    var newArray = [];
    
    // for(i=0; i<c.length; i++)
    var forLoop = function(i, prev) {
        if (i < n.children.length) {
            if (n.children[i]) {
                // Get the value of the child and set it in the array.
                executeGV(n.children[i], x, function(childValue, prev) {
                    var newPrev = prevSaveValue(newArray, i, prev);
                    newArray[i] = childValue;
                    
                    // Continue looping.
                    forLoop(i+1, newPrev);
                  }, ret, cont, brk, thrw, prev);
            }
            else {
                // Continue looping.
                forLoop(i+1, prev);
            }
        }
        else {
            // Create a sandboxed array after collecting all values so that getters or setters in
            // Array.prototype don't affect array creation.
            var sandboxedArray = sandboxArray(newArray);
            // Set the length of newArray, and continue.
            sandboxedArray.length = n.children.length;
            next(sandboxedArray, prev);
        }
    };
    forLoop(0, prev);
};

executeFunctions[OBJECT_INIT] = function exObjectInit(n, x, next, ret, cont, brk, thrw, prev) {
    var newObject = new sandbox.Object();
    var c = n.children;
    
    // Initialise the objects contents looping over the children.
    // for (i = 0; i < c.length; i++)
    var forLoop = function(i, prev) {
        if (i < c.length) {
            var property = c[i];
            if (property.type === PROPERTY_INIT) {
                // Get the value of the property.
                executeGV(property.children[1], x, function(value, prev) {
                    // Set the property on newObject.
                    var key = property.children[0].value;
                    var newPrev = prevSaveValue(newObject, key, prev);
                    
                    Object.defineProperty(newObject, key,
                        {value:value, enumerable:true, configurable:true, writable:true});
                    
                    // Continue looping.
                    forLoop(i+1, newPrev);
                }, ret, cont, brk, thrw, prev);
            } else {
                // FIXME: can we delete getter/setters for prev?
                
                // getter/setters eg. {get x() {return 5;}}
                var fn = newFunction(property, x);
                
                if (property.type === GETTER) {
                    Object.defineProperty(newObject, property.name,
                        {get:thunk(fn, x), enumerable:true, configurable:true});
                }
                else {
                    Object.defineProperty(newObject, property.name,
                        {set:thunk(fn, x), enumerable:true, configurable:true});
                }
                
                // Continue looping.
                forLoop(i+1, prev);
            }
        }
        else {
            // End the loop.
            next(newObject, prev);
        }
    };
    forLoop(0, prev);
};

executeFunctions[NULL] = function exNull(n, x, next, ret, cont, brk, thrw, prev) {
    next(null, prev);
};

executeFunctions[THIS] = function exThis(n, x, next, ret, cont, brk, thrw, prev) {
    next(x.thisObject, prev);
};

executeFunctions[TRUE] = function exTrue(n, x, next, ret, cont, brk, thrw, prev) {
    next(true, prev);
};

executeFunctions[FALSE] = function exFalse(n, x, next, ret, cont, brk, thrw, prev) {
    next(false, prev);
};

executeFunctions[IDENTIFIER] = function exIdentifier(n, x, next, ret, cont, brk, thrw, prev) {
    for (var s = x.scope; s; s = s.parent) {
        if (n.value in s.object) {
            break;
        }
    }
    next(new Reference(s && s.object, n.value, n), prev);
};

executeFunctions[NUMBER] = function exValue(n, x, next, ret, cont, brk, thrw, prev) {
    next(n.value, prev);
};

executeFunctions[STRING] = executeFunctions[NUMBER];
executeFunctions[REGEXP] = executeFunctions[NUMBER];

executeFunctions[GROUP] = function exGroup(n, x, next, ret, cont, brk, thrw, prev) {
    execute(n.children[0], x, next, ret, cont, brk, thrw, prev);
};

function execute(n, x, next, ret, cont, brk, thrw, prev) {
    // Wrap up executing the AST node n in a continuation.
    var executeFn = function(prev) {
        // exceptions can be thrown from native code at any time eg. a*b
        // this catches them and handles via thrw
        try {
            var fn = executeFunctions[n.type];
            if (fn) {
                fn(n, x, next, ret, cont, brk, thrw, prev);
            }
            else {
                thrw("Not implemented: " + Definitions.tokens[n.type], prev);
            }
        }
        catch (e) {
            thrw(sandboxError(e, n.filename, n.lineno), prev);
        }
    }
    
    if (x.asynchronous) {
        var executeFnOriginal = executeFn;
        executeFn = function(prev) {
            // every 200 calls, use setTimeout to reset the stack
            // can only happen when asynchronous (not called from native code)
            counter++;
            if (counter > 200) {
                counter = 0;
                setTimeout(function(){ executeFnOriginal(prev); }, 0);
            }
            else {
                executeFnOriginal(prev);
            }
        }
    }
    
    // Set current node and remove returnedValue from execution context.
    var newPrev = prevDeleteValue(x, "returnedValue", prev);
    x.currentNode = n; // doesn't need reversibility
    
    if (x.control) {
        // the 'control' function provides an opportunity for controlling execution
        // n -- current AST node
        // x -- current execution-context
        // executeFn -- function(prev) continuation for execution
        // prev -- function() continuation for reverse execution
        x.control(n, x, executeFn, newPrev);
    }
    else {
        executeFn(newPrev);
    }
}

function thunk(f, x) {
    return function () { return functionInternals.get(f).call(f, this, arguments, x); };
}

function evaluate(s, f, l, ret, thrw, prev) {
    evaluateInContext(s, f, l, createExecutionContext(), ret, thrw, prev);
}

function evaluateInContext(s, f, l, x, ret, thrw, prev) {
    if (typeof s !== "string") {
        return s;
    }
    
    try {
        // Parse the string into an AST.
        var ast = Parser.parse(s, f, l, false, sandbox);
        
        if (ast.hasModules) {
            thrw("Modules unsupported.", prev);
        }
        else {
            x.strict = !!ast.strict;
            x.execute(ast, function(v, prev) {
                    ret(x.result, prev);
                }, ret, null, null, thrw, prev);
        }
    }
    catch (e) {
        // Returns any native exception via the thrw continuation.
        thrw(sandboxError(e), prev);
    }
}

function createExecutionContext() {
    return new ExecutionContext(GLOBAL_CODE);
}

function createEvalExecutionContext(strict) {
    return new ExecutionContext(EVAL_CODE, strict);
}

function createFunctionExecutionContext(strict) {
    return new ExecutionContext(FUNCTION_CODE, strict);
}

// resetEnvironment wipes any properties added externally to global,
// but properties added to globalBase will persist.
exports.global = global;
exports.globalBase = sandboxExports.globalBase;
exports.translate = sandboxExports.translate;
exports.resetEnvironment = sandboxExports.resetEnvironment;
exports.evaluate = evaluate;
exports.evaluateInContext = evaluateInContext;
exports.execute = execute;
exports.createExecutionContext = createExecutionContext;
exports.createEvalExecutionContext = createEvalExecutionContext;
exports.createFunctionExecutionContext = createFunctionExecutionContext;

return exports;
};
})();
