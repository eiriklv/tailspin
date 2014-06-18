importScripts('tailspin.js');

var interpreter = new Tailspin.Interpreter();
var x;
var xCounter;
var scripts;
var lineCount = 0;

function returnFn (result) {
    if (scripts.length > 0) {
        // Run the next script.
        runScript();
    }
    else {
        postMessage({type:"return", data:result, lineCount:lineCount});
    }
}

function errorFn (error) {
    postMessage({type:"error", data:{sourceFile:error.sourceFile, sourceLine:error.sourceLine, message:error.message}, lineCount:lineCount});
}

function setupCounting () {
    // Do we need to count lines?
    var countScripts = {};
    var runCount = false;
    for (var i=0, c=scripts.length; i<c; i++) {
        if (scripts[i].count) {
            countScripts[scripts[i].url] = true;
        }
        if (scripts[i].runCount) {
            runCount = true;
        }
    }
    
    if (runCount) {
        xCounter = interpreter.createExecutionContext();
        xCounter.asynchronous = true;
        
        var currentLineno = -1;
        var currentStackDepth = -1;
        
        xCounter.control = function(n, x, next, prev) {
            if (lineCount > 1000) {
                postMessage({type:"error", message:"count limit", lineCount:lineCount});
                return;
            }
            
            // Only count scripts with the 'count' flag set.
            if (!countScripts[n.filename]) {
                next(prev);
                return;
            }
            
            // Count each line or stack depth change.
            var stackDelta = x.stack.length - currentStackDepth;
            var newLine = currentLineno !== n.lineno || stackDelta !== 0;
            
            currentLineno = n.lineno;
            currentStackDepth = x.stack.length;
            if (newLine) {
                lineCount++;
            }
            next(prev);
        };
    }
}

onmessage = function (e) {
    // Setup the globals.
    scripts = e.data;
    
    x = interpreter.createExecutionContext();
    x.asynchronous = true;
    
    setupCounting();
    
    // Run the first script.
    runScript();
}

function runScript () {
    var script = scripts.shift();
    
    var xContext = script.runCount? xCounter : x;
    
    interpreter.evaluateInContext(script.source, script.url, 1, xContext, returnFn, errorFn);
}
