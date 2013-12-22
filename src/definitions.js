/* vim: set sw=4 ts=4 et tw=78: */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Narcissus JavaScript engine.
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
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/*
 * Narcissus - JS implemented in JS.
 *
 * Well-known constants and lookup tables.  Many consts are generated from the
 * tokens table via eval to minimize redundancy, so consumers must be compiled
 * separately to take advantage of the simple switch-case constant propagation
 * done by SpiderMonkey.
 */

var hostSupportsEvalConst = (function() {
    try {
        return eval("(function(s) { eval(s); return x })('const x = true;')");
    } catch (e) {
        return false;
    }
})();

var Definitions = (function () {
"use strict";

var tokens = [
    // End of source.
    "END",

    // Operators and punctuators.  Some pair-wise order matters, e.g. (+, -)
    // and (UNARY_PLUS, UNARY_MINUS).
    "\n", ";",
    ",",
    "=",
    "?", ":", "CONDITIONAL",
    "||",
    "&&",
    "|",
    "^",
    "&",
    "==", "!=", "===", "!==",
    "<", "<=", ">=", ">",
    "<<", ">>", ">>>",
    "+", "-",
    "*", "/", "%",
    "!", "~", "UNARY_PLUS", "UNARY_MINUS",
    "++", "--",
    ".",
    "[", "]",
    "{", "}",
    "(", ")",

    // Nonterminal tree node type codes.
    "SCRIPT", "BLOCK", "LABEL", "FOR_IN", "CALL", "NEW_WITH_ARGS", "INDEX",
    "ARRAY_INIT", "OBJECT_INIT", "PROPERTY_INIT", "GETTER", "SETTER",
    "GROUP", "LIST", "LET_BLOCK", "ARRAY_COMP", "GENERATOR", "COMP_TAIL",

    // Contextual keywords.
    "IMPLEMENTS", "INTERFACE", "LET", "MODULE", "PACKAGE", "PRIVATE",
    "PROTECTED", "PUBLIC", "STATIC", "USE", "YIELD",

    // Terminals.
    "IDENTIFIER", "NUMBER", "STRING", "REGEXP",

    // Keywords.
    "break",
    "case", "catch", "const", "continue",
    "debugger", "default", "delete", "do",
    "else", "export",
    "false", "finally", "for", "function",
    "if", "import", "in", "instanceof",
    "new", "null",
    "return",
    "switch",
    "this", "throw", "true", "try", "typeof",
    "var", "void",
    "while", "with",
    
    // Reserved keywords.
    "class", "extends", "enum", "super"
];

var strictKeywords = {
    __proto__: null,
    "implements": true,
    "interface": true,
    "let": true,
    "module": true,
    "package": true,
    "private": true,
    "protected": true,
    "public": true,
    "static": true,
    "use": true,
    "yield": true
};

var statementStartTokens = [
    "break",
    "const", "continue",
    "debugger", "do",
    "for",
    "if",
    "let",
    "return",
    "switch",
    "throw", "try",
    "var",
    "yield",
    "while", "with",
];

// Whitespace characters (see ECMA-262 7.2)
var whitespaceChars = [
    // normal whitespace:
    "\u0009", "\u000B", "\u000C", "\u0020", "\u00A0", "\uFEFF",

    // high-Unicode whitespace:
    "\u1680", "\u180E",
    "\u2000", "\u2001", "\u2002", "\u2003", "\u2004", "\u2005", "\u2006",
    "\u2007", "\u2008", "\u2009", "\u200A",
    "\u2028", "\u2029", "\u202F", "\u205F", "\u3000"
];

var newlineChars = [
    "\u000A", "\u000D", "\u2028", "\u2029"
];

var whitespace = {};
for (var i = 0; i < whitespaceChars.length; i++) {
    whitespace[whitespaceChars[i]] = true;
}

var newlines = {};
for (var i = 0; i < newlineChars.length; i++) {
    newlines[newlineChars[i]] = true;
}

// Operator and punctuator mapping from token to tree node type name.
// NB: because the lexer doesn't backtrack, all token prefixes must themselves
// be valid tokens (e.g. !== is acceptable because its prefixes are the valid
// tokens != and !).
var opTypeNames = {
    '\n':   "NEWLINE",
    ';':    "SEMICOLON",
    ',':    "COMMA",
    '?':    "HOOK",
    ':':    "COLON",
    '||':   "OR",
    '&&':   "AND",
    '|':    "BITWISE_OR",
    '^':    "BITWISE_XOR",
    '&':    "BITWISE_AND",
    '===':  "STRICT_EQ",
    '==':   "EQ",
    '=':    "ASSIGN",
    '!==':  "STRICT_NE",
    '!=':   "NE",
    '<<':   "LSH",
    '<=':   "LE",
    '<':    "LT",
    '>>>':  "URSH",
    '>>':   "RSH",
    '>=':   "GE",
    '>':    "GT",
    '++':   "INCREMENT",
    '--':   "DECREMENT",
    '+':    "PLUS",
    '-':    "MINUS",
    '*':    "MUL",
    '/':    "DIV",
    '%':    "MOD",
    '!':    "NOT",
    '~':    "BITWISE_NOT",
    '.':    "DOT",
    '[':    "LEFT_BRACKET",
    ']':    "RIGHT_BRACKET",
    '{':    "LEFT_CURLY",
    '}':    "RIGHT_CURLY",
    '(':    "LEFT_PAREN",
    ')':    "RIGHT_PAREN"
};

// Hash of keyword identifier to tokens index.  NB: we must null __proto__ to
// avoid toString, etc. namespace pollution.
var keywords = {__proto__: null};
var isKeyword = [];
var mozillaKeywords = {__proto__: null};

// Define const END, etc., based on the token names.  Also map name to index.
var tokenIds = {};

// Building up a string to be eval'd in different contexts.
var consts = hostSupportsEvalConst ? "const " : "var ";
for (var i = 0, j = tokens.length; i < j; i++) {
    if (i > 0)
        consts += ", ";
    var t = tokens[i];
    var name;
    if (/^[a-z]/.test(t)) {
        name = t.toUpperCase();
        if (name === "LET" || name === "YIELD")
            mozillaKeywords[name] = i;
        if (strictKeywords[name])
            strictKeywords[name] = i;
        keywords[t] = i;
        isKeyword[i] = true;
    } else {
        name = (/^\W/.test(t) ? opTypeNames[t] : t);
    }
    consts += name + " = " + i;
    tokenIds[name] = i;
    tokens[t] = i;
}
consts += ";";

var isStatementStartCode = {__proto__: null};
for (i = 0, j = statementStartTokens.length; i < j; i++)
    isStatementStartCode[keywords[statementStartTokens[i]]] = true;

// Map assignment operators to their indexes in the tokens array.
var assignOps = ['|', '^', '&', '<<', '>>', '>>>', '+', '-', '*', '/', '%'];

for (i = 0, j = assignOps.length; i < j; i++) {
    var t = assignOps[i];
    assignOps[t] = tokens[t];
}

function defineProperty(obj, prop, val, dontDelete, readOnly, dontEnum) {
    Object.defineProperty(obj, prop,
                          { value: val, writable: !readOnly, configurable: !dontDelete,
                            enumerable: !dontEnum });
}

// Returns true if fn is a native function.  (Note: SpiderMonkey specific.)
function isNativeCode(fn) {
    // Relies on the toString method to identify native code.
    return ((typeof fn) === "function") && fn.toString().match(/\[native code\]/);
}

var Fpapply = Function.prototype.apply;

function apply(f, o, a) {
    return Fpapply.call(f, [o].concat(a));
}

var applyNew;

// ES5's bind is a simpler way to implement applyNew
if (Function.prototype.bind) {
    applyNew = function applyNew(f, a) {
        return new (f.bind.apply(f, [,].concat(Array.prototype.slice.call(a))))();
    };
} else {
    applyNew = function applyNew(f, a) {
        switch (a.length) {
          case 0:
            return new f();
          case 1:
            return new f(a[0]);
          case 2:
            return new f(a[0], a[1]);
          case 3:
            return new f(a[0], a[1], a[2]);
          default:
            var argStr = "a[0]";
            for (var i = 1, n = a.length; i < n; i++)
                argStr += ",a[" + i + "]";
            return eval("new f(" + argStr + ")");
        }
    };
}

// Helper to avoid Object.prototype.hasOwnProperty polluting scope objects.
function hasDirectProperty(o, p) {
    return Object.prototype.hasOwnProperty.call(o, p);
}

function Dict(table, size) {
    this.table = table || Object.create(null, {});
    this.size = size || 0;
}

Dict.create = function(table) {
    var init = Object.create(null, {});
    var size = 0;
    var names = Object.getOwnPropertyNames(table);
    for (var i = 0, n = names.length; i < n; i++) {
        var name = names[i];
        init[name] = table[name];
        size++;
    }
    return new Dict(init, size);
};

Dict.prototype = {
    has: function(x) { return hasDirectProperty(this.table, x); },
    set: function(x, v) {
        if (!hasDirectProperty(this.table, x))
            this.size++;
        this.table[x] = v;
    },
    get: function(x) { return this.table[x]; },
    getDef: function(x, thunk) {
        if (!hasDirectProperty(this.table, x)) {
            this.size++;
            this.table[x] = thunk();
        }
        return this.table[x];
    },
    forEach: function(f) {
        var table = this.table;
        for (var key in table) {
            if (hasDirectProperty(table, key)) {
                f.call(this, key, table[key]);
            }
        }
    },
    map: function(f) {
        var table2 = Object.create(null, {});
        this.forEach(function(key, val) {
            table2[key] = f.call(this, val, key);
        });
        return new Dict(table2, this.size);
    },
    mapObject: function(f) {
        var table2 = Object.create(null, {});
        this.forEach(function(key, val) {
            table2[key] = f.call(this, val, key);
        });
        return table2;
    },
    toObject: function() {
        return this.mapObject(function(val) { return val; });
    },
    choose: function() {
        return Object.getOwnPropertyNames(this.table)[0];
    },
    remove: function(x) {
        if (hasDirectProperty(this.table, x)) {
            this.size--;
            delete this.table[x];
        }
    },
    copy: function() {
        var table = Object.create(null, {});
        for (var key in this.table) {
            if (hasDirectProperty(table, key)) {
                table[key] = this.table[key];
            }
        }
        return new Dict(table, this.size);
    },
    keys: function() {
        return Object.keys(this.table);
    },
    toString: function() { return "[object Dict]"; }
};

// non-destructive stack
function Stack(elts) {
    this.elts = elts || null;
}

Stack.prototype = {
    push: function(x) {
        return new Stack({ top: x, rest: this.elts });
    },
    top: function() {
        if (!this.elts)
            throw new Error("empty stack");
        return this.elts.top;
    },
    isEmpty: function() {
        return this.top === null;
    },
    find: function(test) {
        for (var elts = this.elts; elts; elts = elts.rest) {
            if (test(elts.top))
                return elts.top;
        }
        return null;
    },
    has: function(x) {
        return Boolean(this.find(function(elt) { return elt === x; }));
    },
    forEach: function(f) {
        for (var elts = this.elts; elts; elts = elts.rest) {
            f(elts.top);
        }
    }
};

if (!Array.prototype.copy) {
    defineProperty(Array.prototype, "copy",
                   function() {
                       var result = [];
                       for (var i = 0, n = this.length; i < n; i++)
                           result[i] = this[i];
                       return result;
                   }, false, false, true);
}

if (!Array.prototype.top) {
    defineProperty(Array.prototype, "top",
                   function() {
                       return this.length && this[this.length-1];
                   }, false, false, true);
}

var exports = {};
exports.tokens = tokens;
exports.whitespace = whitespace;
exports.newlines = newlines;
exports.opTypeNames = opTypeNames;
exports.keywords = keywords;
exports.isKeyword = isKeyword;
exports.mozillaKeywords = mozillaKeywords;
exports.strictKeywords = strictKeywords;
exports.isStatementStartCode = isStatementStartCode;
exports.tokenIds = tokenIds;
exports.consts = consts;
exports.assignOps = assignOps;
exports.defineProperty = defineProperty;
exports.hasDirectProperty = hasDirectProperty;
exports.isNativeCode = isNativeCode;
exports.apply = apply;
exports.applyNew = applyNew;
exports.Dict = Dict;
exports.Stack = Stack;
return exports;
})();
