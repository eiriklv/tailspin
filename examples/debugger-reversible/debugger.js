var tailspinDebugger;
var mySource;

window.onload = function() {
    mySource = CodeMirror.fromTextArea(document.getElementById("source"),
        {lineNumbers:true, mode:"javascript"});
    
    tailspinDebugger = new Debugger();
    
    var myConsole = CodeMirror.fromTextArea(document.getElementById("console"),
        {readOnly:true, mode:"text"});

    var consoleLog = function(msg, logClass) {
        var from = myConsole.posFromIndex(myConsole.getValue().length);
        myConsole.replaceRange(msg+"\n", from);
        myConsole.markText(from, CodeMirror.Pos(myConsole.lastLine()), {className:logClass});
    }
    
    // Add a single global 'console' that has a log function.
    tailspinDebugger.interpreter.global.console = {
        log:function(msg) {consoleLog(msg, 'log');}
    };
    
    tailspinDebugger.log = consoleLog;
    
    // Save the code on changes.
    mySource.on('change', function(cMirror) {
        localStorage["debugger-source"] = cMirror.getValue();
        tailspinDebugger.reset();
    });
    
    // Load saved code.
    var savedScript = localStorage["debugger-source"];
    if (typeof savedScript === "string") {
        mySource.setValue(savedScript);
    }
}
function Debugger() {
    this.animateButton = document.getElementById("animate-button");
    this.stepBackButton = document.getElementById("step-back-button");
    this.stepForwardButton = document.getElementById("step-forward-button");
    /*this.stopButton = document.getElementById("stop-button");
    this.pauseButton = document.getElementById("pause-button");
    this.stepOverButton = document.getElementById("step-over-button");
    this.stepOutButton = document.getElementById("step-out-button");*/
    
    this.timeSlider = document.getElementById("time-slider");
    
    this.reset();
}

Debugger.prototype = {
    reset: function() {
        // Create a new interpreter.
        this.interpreter = new Tailspin.Interpreter();
        
        this.state = "stopped";
        this.currentLine = -1;
        this.executeNext = null;
        this.executePrev = null;
        this.highlightLine(-1);
        
        this.stepCount = -1;
        
        this.timeSlider.value = -1;
        this.timeSlider.min = -1;
        this.timeSlider.disabled = true;
        
        var setSteps = function(n) {
            this.timeSlider.disabled = false;
            this.timeSlider.max = n;
        }.bind(this);
        
        this.countSteps([{source:mySource.getValue(), url:"my-code", count:true, runCount:true}], setSteps);
        
        this.updateButtons();
    },
    
    highlightLine: function(n) {
        if (this.highlightedLine >= 0) {
            mySource.removeLineClass(this.highlightedLine, 'background', 'current-line');
        }
        this.highlightedLine = n;
        if (this.highlightedLine >= 0) {
            mySource.addLineClass(this.highlightedLine, 'background', 'current-line');
        }
    },
    
    updateButtons: function() {
        var running = (this.state === "paused" || this.state === "stopped");
        
        this.stepBackButton.disabled = typeof this.executePrev !== "function";
        this.stepForwardButton.disabled = !running; // Can start by stepping over or into.
        /*this.animateButton.disabled = !running;
        this.stopButton.disabled = this.state === "stopped";
        this.pauseButton.disabled = running;
        this.stepOverButton.disabled = !running;
        this.stepOutButton.disabled = this.state !== "paused";*/
    },
    
    // Counts the number of steps it takes to run the scripts
    // Calls completionHandler with the number of steps taken.
    // scripts is an array of the form '[{source:"...", url:"my-code", count:true},...]'
    countSteps: function(scripts, completionHandler) {
        if (this.countWorker) {
            this.countWorker.terminate();
        }
        
        this.countWorker = new Worker("tailspin-worker.js");
        
        // Run for a maximum of 10s.
        var timer = setTimeout(function () {
            if (this.countWorker) {
                this.countWorker.terminate();
            }
          }, 10000);
        
        this.countWorker.onmessage = function (e) {
            completionHandler(e.data.lineCount);
        };
        
        this.countWorker.postMessage(scripts);
    },
    
    log: function(output, outputClass) {
        // For individual instances to implement.
    },
    
    end: function(output, outputClass, prev) {
        if (output) {
            this.log(output, outputClass);
        }
        this.state = "stopped";
        this.executeNext = null;
        this.executePrev = prev;
        this.highlightLine(-1);
        this.timeSlider.value = this.stepCount;
        
        this.updateButtons();
    },
    returnFn: function(result, prev) {
        this.end(JSON.stringify(result), "output", prev);
    },
    errorFn: function(result, prev) {
        this.end("ERROR: "+JSON.stringify(result), "error", prev);
    },
    start: function() {
        // Create an evaluation context that describes the how the code is to be executed.
        var x = this.interpreter.createExecutionContext();
        
        // Asynchronous running is prefered, so that tailspin execution does not block the browser.
        x.asynchronous = true;
        
        x.control = this.control.bind(this);
        
        this.stepCount = 0;
        this.currentLine = -1;
        this.stackDepth = 0;
        
        this.updateButtons();
        
        // Run the code.
        var source = mySource.getValue();
        this.interpreter.evaluateInContext(source, "source", 0, x, this.returnFn.bind(this), this.errorFn.bind(this), this.reset.bind(this));
    },
    
    continueWithState: function(state) {
        this.state = state;
        if (this.executeNext) {
            this.executeNext();
        }
        else {
            this.start();
        }
    },
    
    forward: function() {
        this.stepInto();
    },
    back: function() {
        if (this.executePrev) {
            this.state = "step-back";
            this.executePrev();
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
    
    doPause: function(n, x, next, prev) {
        this.state = "paused";
        this.currentLine = n.lineno;
        this.stackDepth = x.stack.length;
        
        // Save a continuation 'executeNext' which will continue the execution of the code.
        this.executeNext = function() {
            this.updateButtons();
            this.highlightLine(-1);
            next(prev);
          }.bind(this);
        
        this.executePrev = prev;
        
        // Highlight the new line.
        this.highlightLine(n.lineno-1);
        this.timeSlider.value = this.stepCount;
        
        this.updateButtons();
    },
    
    control: function(n, x, next, prev) {
        var myDebugger = this;
        
        // Only consider pausing if we are at a new line.
        var newLine = this.currentLine !== n.lineno || x.stack.length !== this.stackDepth;
        if (!newLine) {
            next(prev);
            return; // EARLY RETURN
        }
        
        var oldStep = this.stepCount;
        
        // Adjust the next continuation, to add a hook into the prev
        // continuation so that we can pause the reverse execution.
        var newNext = function(prev) {
            // Hit a new line, increment the step count.
            myDebugger.stepCount++;
            
            // Create a newPrev that allows stopping.
            var newPrev2 = function() {
                // step the stepCount backwards
                if (myDebugger.stepCount-1 !== oldStep) {
                    throw "Step count mismatch in reverse execution.";
                }
                myDebugger.stepCount = oldStep;
                
                //control.currentNode = n;
                //control.currentExecutionContext = x;
                //control.currentLineno = n.lineno;
                
                // Stop if we are stepping back or we hit the stepCount target.
                if (myDebugger.state === "step-back" || (myDebugger.state === "jump to step" && myDebugger.stepCount === myDebugger.stepCountTarget)) {
                    myDebugger.doPause(n, x, newNext, prev);
                }
                else {
                    prev();
                }
            };
            // Continue execution with the new prev continuation.
            next(newPrev2);
        };
        
        switch (this.state) {
            case "running":
                newNext(prev);
                break;
            case "step-into":
                if (n.lineno != this.currentLine) {
                    this.doPause(n, x, newNext, prev);
                }
                else {
                    newNext(prev);
                }
                break;
            case "step-over":
                if (n.lineno != this.currentLine && x.stack.length <= this.stackDepth) {
                    this.doPause(n, x, newNext, prev);
                }
                else {
                    newNext(prev);
                }
                break;
            case "step-out":
                if (n.lineno != this.currentLine && x.stack.length < this.stackDepth) {
                    this.doPause(n, x, newNext, prev);
                }
                else {
                    newNext(prev);
                }
                break;
            case "paused":
                this.doPause(n, x, newNext, prev);
                break;
            case "stopped":
                // Don't continue execution.
                break;
        }
    }
};