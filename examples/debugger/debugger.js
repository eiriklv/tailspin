var interpreter;
var tailspinDebugger;
var mySource, myConsole;

window.onload = function() {
    // Create a new interpreter.
    interpreter = new Tailspin.Interpreter();
    tailspinDebugger = new Debugger();
    
    // Add a single global 'console' that has a log function.
    interpreter.global.console = {
        log:function(msg) {consoleLog(msg, 'log');}
    };
    
    mySource = CodeMirror.fromTextArea(document.getElementById("source"),
        {lineNumbers:true, mode:"javascript"});
    
    myConsole = CodeMirror.fromTextArea(document.getElementById("console"),
        {readOnly:true, mode:"text"});
    
    // Save the code on changes.
    mySource.on('change', function(cMirror) {
        localStorage["debugger-source"] = cMirror.getValue();
    });
    
    // Load saved code.
    var savedScript = localStorage["debugger-source"];
    if (typeof savedScript === "string") {
        mySource.setValue(savedScript);
    }
}

function consoleLog(msg, logClass) {
    var from = myConsole.posFromIndex(myConsole.getValue().length);
    myConsole.replaceRange(msg+"\n", from);
    myConsole.markText(from, CodeMirror.Pos(myConsole.lastLine()), {className:logClass});
}

function Debugger() {
    this.state = "stopped";
    this.currentLine = -1;
    this.continuation = null;
    this.highlightedLine = -1;
    
    this.runButton = document.getElementById("run-button");
    this.stopButton = document.getElementById("stop-button");
    this.pauseButton = document.getElementById("pause-button");
    this.stepIntoButton = document.getElementById("step-into-button");
    this.stepOverButton = document.getElementById("step-over-button");
    this.stepOutButton = document.getElementById("step-out-button");
    
    this.updateButtons();
}

Debugger.prototype = {
    updateButtons: function() {
        var running = (this.state === "paused" || this.state === "stopped");
        
        this.runButton.disabled = !running;
        this.stopButton.disabled = this.state === "stopped";
        this.pauseButton.disabled = running;
        this.stepIntoButton.disabled = !running; // Can start by stepping over or into.
        this.stepOverButton.disabled = !running;
        this.stepOutButton.disabled = this.state !== "paused";
    },
    end: function(output, outputClass) {
        if (output) {
            consoleLog(output, outputClass);
        }
        this.state = "stopped";
        this.continuation = null;
        mySource.removeLineClass(this.highlightedLine, 'background', 'current-line');
        
        this.updateButtons();
    },
    returnFn: function(result) {
        this.end(JSON.stringify(result), "output");
    },
    errorFn: function(result) {
        this.end("ERROR: "+JSON.stringify(result), "error");
    },
    start: function() {
        // Create an evaluation context that describes the how the code is to be executed.
        var x = interpreter.createExecutionContext();
        
        // Asynchronous running is prefered, so that tailspin execution does not block the browser.
        x.asynchronous = true;
        
        x.control = this.control.bind(this);
        
        this.currentLine = -1;
        this.stackDepth = 0;
        
        this.updateButtons();
        
        // Run the code.
        var source = mySource.getValue();
        interpreter.evaluateInContext(source, "source", 0, x, this.returnFn.bind(this), this.errorFn.bind(this), null);
    },
    continueWithState: function(state) {
        this.state = state;
        if (this.continuation) {
            this.continuation();
        }
        else {
            this.start();
        }
    },
    run: function() {
        this.continueWithState("running");
    },
    stepInto: function() {
        this.continueWithState("step-into");
    },
    stepOver: function() {
        this.continueWithState("step-over");
    },
    stepOut: function() {
        this.continueWithState("step-out");
    },
    pause: function() {
        this.state = "paused";
    },
    stop: function() {
        this.state = "stopped";
        this.end();
    },
    
    doPause: function(n, x, next, prev) {
        this.state = "paused";
        this.currentLine = n.lineno;
        this.stackDepth = x.stack.length;
        
        // Save a continuation which will continue the execution of the code.
        this.continuation = function() {
            this.updateButtons();
            mySource.removeLineClass(this.highlightedLine, 'background', 'current-line');
            next(prev);
          }.bind(this);
        
        // Highlight the new line.
        this.highlightedLine = n.lineno-1;
        mySource.addLineClass(this.highlightedLine, 'background', 'current-line');
        
        this.updateButtons();
    },
    
    control: function(n, x, next, prev) {
        switch (this.state) {
            case "running":
                next(prev);
                break;
            case "step-into":
                if (n.lineno != this.currentLine) {
                    this.doPause(n, x, next, prev);
                }
                else {
                    next(prev);
                }
                break;
            case "step-over":
                if (n.lineno != this.currentLine && x.stack.length <= this.stackDepth) {
                    this.doPause(n, x, next, prev);
                }
                else {
                    next(prev);
                }
                break;
            case "step-out":
                if (n.lineno != this.currentLine && x.stack.length < this.stackDepth) {
                    this.doPause(n, x, next, prev);
                }
                else {
                    next(prev);
                }
                break;
            case "paused":
                this.doPause(n, x, next, prev);
                break;
            case "stopped":
                // Don't continue execution.
                break;
        }
    }
};