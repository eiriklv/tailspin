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
    this.stepOverButton = document.getElementById("step-over-button");
    this.stepOutButton = document.getElementById("step-out-button");
    
    this.speedSlider = document.getElementById("speed-slider");
    
    this.timeSlider = document.getElementById("time-slider");
    var jump = function(e) {
        this.jumpToStep(e.target.valueAsNumber);
    }.bind(this);
    this.timeSlider.oninput = jump;
    this.timeSlider.onchange = jump;
    
    this.reset();
}

Debugger.prototype = {
    reset: function() {
        // Create a new interpreter.
        this.interpreter = new Tailspin.Interpreter();
        
        // Add a single global 'console' that has a log function.
        var self = this;
        this.interpreter.global.console = {
            log:function(msg) {self.log(msg, 'log');}
        };
        
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
        
        this.countSteps([
            {source:"console={log:function(){}}", url:"setup"},
            {source:mySource.getValue(), url:"my-code", count:true, runCount:true}
            ]
            , setSteps);
        
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
        var running = !(this.state === "paused" || this.state === "stopped" || this.state === "animate");
        
        var hasPrev = typeof this.executePrev === "function";
        var hasNext = typeof this.executeNext === "function" || this.stepCount === -1;
        
        this.stepBackButton.disabled = !hasPrev || running;
        this.stepForwardButton.disabled = !hasNext || running; // Can start by stepping over or into.
        this.animateButton.disabled = !hasNext || running;
        this.stepOverButton.disabled = !hasNext || running;
        this.stepOutButton.disabled = !hasNext || running;
        
        if (this.state === "animate") {
            this.animateButton.setAttribute("class", "pause");
        }
        else {
            this.animateButton.removeAttribute("class");
        }
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
        this.pausedLine = -1;
        this.pausedStackDepth = 0;
        
        this.updateButtons();
        
        var self = this;
        var prev = function() {
            self.state = "stopped";
            self.stepCount = -1;
            self.highlightLine(-1);
            self.timeSlider.value = self.stepCount;
            
            delete self.executePrev;
            self.executeNext = null;
            
            self.updateButtons();
        };
        
        // Run the code.
        var source = mySource.getValue();
        this.interpreter.evaluateInContext(source, "source", 0, x, this.returnFn.bind(this), this.errorFn.bind(this), prev);
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
    jumpToStep: function(target) {
        if (this.state === "jump" && target >= 0) {
            this.jumpStepTarget = target;
        }
        else {
            this.jumpStepTarget = target;
            
            // Go forwards or back to reach target.
            if (this.stepCount < target) {
                this.continueWithState("jump");
            }
            else if (this.executePrev && this.stepCount > target) {
                this.state = "jump";
                this.executePrev();
            }
        }
    },
    
    run: function() {
        this.continueWithState("running");
    },
    animate: function() {
        if (this.state === "animate") {
            this.pause();
            this.updateButtons();
        }
        else {
            this.continueWithState("animate");
        }
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
    
    
    resumeAnimating: function() {
        if (this.state === "animate") {
            this.continueWithState("animate");
        }
    },
    
    animationDelay: function() {
        var delay = 90-this.speedSlider.valueAsNumber;
        if (delay > 75) {
            delay = (delay-75);
            delay = delay*delay + 75;
        }
        
        // slider     0 -> 15 -> 0 -> 100
        // delay    300 -> 75 -> 0 -> -10
        return delay;
    },
    
    doPause: function(n, x, next, prev, state) {
        this.state = typeof state === "string"? state : "paused";
        this.pausedStackDepth = x.stack.length;
        this.pausedLine = n.lineno;
        
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
        
        // 'this.pausedStackDepth' is the last line the user stopped on and is used for user control.
        // 'this.stackDepth' is the last time control was called and is used to count the number of steps taken.
        var stackDelta = x.stack.length - this.stackDepth;
        var pausedStackDelta = x.stack.length - this.pausedStackDepth;
        
        // Only consider pausing if we are at a new line.
        var newLine = this.currentLine !== n.lineno || stackDelta !== 0;
        if (!newLine) {
            next(prev);
            return; // EARLY RETURN
        }
        
        this.currentLine = n.lineno;
        this.stackDepth = x.stack.length;
        
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
                
                myDebugger.currentLine = n.lineno;
                myDebugger.stackDepth = x.stack.length;
                
                // Stop if we are stepping back or we hit the stepCount target.
                if (myDebugger.state === "step-back" || (myDebugger.state === "jump" && myDebugger.stepCount === myDebugger.jumpStepTarget)) {
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
            case "jump":
                // Stop if we hit the stepCount target.
                if (this.stepCount === this.jumpStepTarget) {
                    this.doPause(n, x, newNext, prev);
                }
                else if (this.stepCount > this.stepCountTarget) {
                    // Reverse execution.
                    prev();
                    return;
                }
                else {
                    // Otherwise continue execution.
                    newNext(prev);
                }
                break;
            case "step-into":
                if (this.pausedLine !== n.lineno || pausedStackDelta !== 0) {
                    this.doPause(n, x, newNext, prev);
                }
                else {
                    newNext(prev);
                }
                break;
            case "step-over":
                if (this.pausedLine !== n.lineno || pausedStackDelta <= 0) {
                    this.doPause(n, x, newNext, prev);
                }
                else {
                    newNext(prev);
                }
                break;
            case "step-out":
                if (this.pausedLine !== n.lineno || pausedStackDelta < 0) {
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
            case "running":
                newNext(prev);
                break;
            case "animate":
                // delay is a number 300 -> -10
                var delay = this.animationDelay();
                
                // If delay -1 -> -10: start skipping 1/11 up to 10/11 lines.
                if (delay < 0 && this.stepCount%11 < -delay) {
                    newNext(prev);
                }
                else {
                    var animateTimeout = setTimeout(this.resumeAnimating.bind(this), delay*10);
                    this.doPause(n, x, function(prev) {
                          window.clearTimeout(animateTimeout);
                          newNext(prev);
                        }, function() {
                          window.clearTimeout(animateTimeout);
                          prev();
                        }, "animate");
                    return;
                }
                break;
        }
    }
};