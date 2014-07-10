// can set 'Debugger.result', 'Debugger.error', 'updateCallback', 'argsCallback(forCloning)', 'globalsCallback(forCloning)', 'callRunFunctionOnRunning'

function Debugger(source, supportCode) {
    this.source = source;
    this.supportCode = typeof supportCode === "string"? supportCode : "";
    
    this.animateButton = document.getElementById("animate-button");
    this.stepBackButton = document.getElementById("step-back-button");
    this.stepForwardButton = document.getElementById("step-forward-button");
    this.stepOverButton = document.getElementById("step-over-button");
    this.stepOutButton = document.getElementById("step-out-button");
    
    this.runButton = document.getElementById("run-button");
    this.stopButton = document.getElementById("stop-button");
    this.pauseButton = document.getElementById("pause-button");
    this.stepIntoButton = document.getElementById("step-into-button");
    
    this.speedSlider = document.getElementById("speed-slider");
    
    this.timeSlider = document.getElementById("time-slider");
    if (this.timeSlider) {
        var jump = function(e) {
            this.jumpToStep(e.target.valueAsNumber);
        }.bind(this);
        this.timeSlider.oninput = jump;
        this.timeSlider.onchange = jump;
    }
    
    this.reset();
}

Debugger.prototype = {
    reset: function() {
        // Create a new interpreter.
        if (this.interpreter) {
            this.interpreter.cleanup();
        }
        this.interpreter = new Tailspin.Interpreter();
        
        // Add a single global 'console' that has a log function.
        var self = this;
        this.interpreter.global.console = {
            log:function(msg) {console.log(msg);}
        };
        
        this.setGlobals();
        
        this.runSupport();
        
        this.state = "stopped";
        this.currentLine = -1;
        this.executeNext = null;
        this.executePrev = null;
        this.highlightLine(-1);
        
        this.stepCount = -1;
        
        if (this.timeSlider) {
            this.timeSlider.min = -1;
            this.timeSlider.value = -1;
            this.timeSlider.disabled = true;
        
            var setSteps = function(n) {
                this.timeSlider.disabled = false;
                this.timeSlider.max = n;
            }.bind(this);
            
            var x = this.interpreter.createExecutionContext();
            if (this.updateCallback) {
                this.updateCallback(null, x, false, 0);
            }
            
            if (this.callRunFunctionOnRunning && x.lookupInScope("run")) {
                var args = null;
                if (this.argsCallback) {
                    args = this.argsCallback(true);
                }
                
                this.countSteps([
                      {randomSeed:this.interpreter.randomSeed},
                      {globals:{"__args":args}},
                      {source:"function preRun(){}", url:"_preRun"},
                      {source:this.supportCode, url:"_support"},
                      {source:this.source.getValue(), url:"my-code", count:true},
                      {source:"preRun()", url:"_runPreRun"},
                      {source:"run(__args)", url:"_run", runCount:true}
                    ]
                    , setSteps);
            }
            else {
                this.countSteps([
                      {randomSeed:this.interpreter.randomSeed},
                      {source:this.supportCode, url:"_support"},
                      {source:"console={log:function(){}}", url:"_support2"},
                      {source:this.source.getValue(), url:"my-code", count:true, runCount:true}
                    ]
                    , setSteps);
            }
        }
        
        this.updateButtons();
    },
    
    runSupport: function() {
        // Run any support code that has been loaded.
        if (this.supportCode.length > 0) {
            if (this.preRunSource) {
                this.doPreRunSource();
            }
            
            // Run synchronously for now.
            var self = this;
            var x = this.interpreter.createExecutionContext();
            this.interpreter.evaluateInContext(this.supportCode, "_supportCode", 1, x,
                function(r) {},
                function(e) {
                    throw e;
                });
        }
    },
    // Runs the source quietly without triggering any visualisation.
    doPreRunSource: function() {
        this.setGlobals();
        var source = this.source.getValue();
        var x = this.interpreter.createExecutionContext();
        
        this.interpreter.evaluateInContext(source, "source", 1, x,
            function(r) {},
            function(e) {console.error(e);});
    },
    runUserScript: function(script) {
        this.setGlobals();
        this.state = "paused";
        var self = this;
        var source = this.source.getValue();
        
        // Reset the time slider.
        this.timeSlider.min = -1;
        this.timeSlider.value = -1;
        this.timeSlider.disabled = true;
        
        var setSteps = function(n) {
            self.timeSlider.disabled = false;
            self.timeSlider.max = n;
        };
        
        // Send persistent globals to the web-worker for counting steps.
        var pGlobals = {};
        if (this.persistentGlobals) {
            for (var i=0, c=this.persistentGlobals.length; i<c; i++) {
                var g = this.persistentGlobals[i];
                pGlobals[g] = this.interpreter.global[g];
            }
        }
        
        this.countSteps([
              {randomSeed:this.interpreter.randomSeed},
              {source:source, url:"my-code", count:true},
              {source:"function preRun(){}", url:"_preRun"},
              {source:this.supportCode, url:"_support"},
              {globals:pGlobals},
              {source:"preRun()", url:"_runPreRun"},
              {source:script, url:"runUserScript", runCount:true}
            ]
            , setSteps);
        
        // Start running the supplied script as normal.
        self.start(script);
    },
    
    
    highlightLine: function(n) {
        if (this.highlightedLine >= 0) {
            this.source.removeLineClass(this.highlightedLine, 'background', 'current-line');
        }
        this.highlightedLine = n;
        if (this.highlightedLine >= 0) {
            this.source.addLineClass(this.highlightedLine, 'background', 'current-line');
        }
    },
    
    updateButtons: function() {
        var running = !(this.state === "paused" || this.state === "stopped" || this.state === "animate");
        var isPaused = (this.state === "paused" || this.state === "stopped");
        
        var hasPrev = typeof this.executePrev === "function";
        var hasNext = typeof this.executeNext === "function" || this.stepCount === -1;
        
        if (this.stepBackButton) {
            this.stepBackButton.disabled = !hasPrev || running;
        }
        if (this.stepForwardButton) {
            this.stepForwardButton.disabled = !hasNext || running; // Can start by stepping over or into.
        }
        if (this.timeSlider) {
            this.stepOverButton.disabled = !hasNext || running;
            this.stepOutButton.disabled = !hasNext || running;
        }
        else {
            this.stepOverButton.disabled = !isPaused;
            this.stepOutButton.disabled = this.state !== "paused";
        }
        
        if (this.animateButton) {
            this.animateButton.disabled = !hasNext || running;
            if (this.state === "animate") {
                this.animateButton.setAttribute("class", "pause");
            }
            else {
                this.animateButton.removeAttribute("class");
            }
        }
        
        if (this.runButton) {
            this.runButton.disabled = !isPaused;
        }
        if (this.stopButton) {
            this.stopButton.disabled = this.state === "stopped";
        }
        if (this.pauseButton) {
            this.pauseButton.disabled = isPaused;
        }
        if (this.stepIntoButton) {
            this.stepIntoButton.disabled = !isPaused; // Can start by stepping over or into.
        }
    },
    
    // Counts the number of steps it takes to run the scripts
    // Calls completionHandler with the number of steps taken.
    // scripts is an array of the form '[{source:"...", url:"my-code", count:true},...]'
    countSteps: function(scripts, completionHandler) {
        if (this.countWorker) {
            this.countWorker.terminate();
        }
        
        this.countWorker = new Worker("lib/tailspin-worker.js");
        
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
    
    result: function(result) {
        // For individual instances to implement.
    },
    error: function(error) {
        // For individual instances to implement.
    },
    
    end: function(x, prev) {
        if (this.updateCallback) {
            var newPrev = this.updateCallback(null, x, false, 100, prev);
            if (newPrev) {
                prev = newPrev;
            }
        }
        
        this.state = "stopped";
        this.executeNext = null;
        this.executePrev = prev;
        this.highlightLine(-1);
        if (this.timeSlider) {
            this.timeSlider.value = this.stepCount;
        }
        
        this.updateButtons();
    },
    returnFn: function(x, result, prev) {
        this.end(x, prev);
        this.result(result);
    },
    errorFn: function(x, result, prev) {
        this.end(x, prev);
        this.error(result);
    },
    start: function(script) {
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
            if (self.timeSlider) {
                self.timeSlider.value = self.stepCount;
            }
            
            delete self.executePrev;
            self.executeNext = function() {
                self.start(script);
            }
            
            if (self.updateCallback) {
                self.updateCallback(null, x, false, 100);
            }
            
            self.updateButtons();
        };
        
        var source = typeof script === "string"? script : this.source.getValue();
        var sourceName = typeof script === "string"? "script" : "source";
        
        var runFn = function () {
            if (self.callRunFunctionOnRunning && x.lookupInScope("run")) {
                var x2 = self.interpreter.createExecutionContext();
                // Run the source silently first then run the run() function.
                var runFn2 = function() {
                    // If there is an argsCallback, use the return value to send to the run(args) function.
                    var args = "";
                    if (self.argsCallback) {
                        self.interpreter.global.__args = self.argsCallback(false);
                        args = "__args";
                    }
                    // Run the support function run(args?).
                    self.interpreter.evaluateInContext("run("+args+")", "_support_run", 0, x, self.returnFn.bind(self, x), self.errorFn.bind(self, x), prev);
                };
                
                self.interpreter.evaluateInContext(source, sourceName, 1, x2,
                    runFn2,       // return continuation
                    function(e) { // exception continuation
                        throw e;
                    });
            }
            else {
                // Run the code.
                self.interpreter.evaluateInContext(source, sourceName, 0, x, self.returnFn.bind(self, x), self.errorFn.bind(self, x), prev);
            }
        }
        
        // If there is a preRun function defined, call that first.
        if (x.lookupInScope("preRun")) {
            var x2 = self.interpreter.createExecutionContext();
            self.interpreter.evaluateInContext("preRun()", "_runPreRun", 0, x2, runFn, self.errorFn.bind(self, x), prev);
        }
        else {
            runFn();
        }
    },
    
    // Loads in any custom globals provided by the globalsCallback.
    setGlobals: function() {
        if (this.globalsCallback) {
            var globals = this.globalsCallback();
            for (var g in globals) {
                if (globals.hasOwnProperty(g)) {
                    this.interpreter.global[g] = this.interpreter.translate(globals[g]);
                }
            }
        }
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
    stop: function() {
        this.end();
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
        var oldState = this.state;
        this.state = typeof state === "string"? state : "paused";
        this.pausedStackDepth = x.stack.length;
        this.pausedLine = n.lineno;
        
        if (this.updateCallback) {
            var duration = 0;
            if (oldState !== "jump") {
                duration = this.animationDelay()*10;
                if (duration < 0) duration = 0;
                if (duration > 100) duration = 100;
            }
            
            // Get a potentially updated prev continuation.
            var prev2 = this.updateCallback(n, x, true, duration, prev);
            if (prev2) {
                prev = prev2;
            }
        }
        
        // Save a continuation 'executeNext' which will continue the execution of the code.
        this.executeNext = function() {
            this.updateButtons();
            this.highlightLine(-1);
            next(prev);
          }.bind(this);
        
        this.executePrev = prev;
        
        // Highlight the new line.
        this.highlightLine(n.lineno-1);
        if (this.timeSlider) {
            this.timeSlider.value = this.stepCount;
        }
        
        this.updateButtons();
    },
    
    control: function(n, x, next, prev) {
        var self = this;
        
        if (n.filename !== "source") {
            next(prev);
            return; // EARLY RETURN
        }
        
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
        
        var newPauseLine = this.pausedLine !== n.lineno || pausedStackDelta !== 0;
        this.currentLine = n.lineno;
        this.stackDepth = x.stack.length;
        
        var oldStep = this.stepCount;
        
        // Adjust the next continuation, to add a hook into the prev
        // continuation so that we can pause the reverse execution.
        var newNext = function(prev) {
            // Hit a new line, increment the step count.
            self.stepCount++;
            
            // Create a newPrev that allows stopping.
            var newPrev2 = function() {
                // step the stepCount backwards
                if (self.stepCount-1 !== oldStep) {
                    throw "Step count mismatch in reverse execution.";
                }
                self.stepCount = oldStep;
                
                self.currentLine = n.lineno;
                self.stackDepth = x.stack.length;
                
                // Stop if we are stepping back or we hit the stepCount target.
                if (self.state === "step-back" || (self.state === "jump" && self.stepCount === self.jumpStepTarget)) {
                    self.doPause(n, x, newNext, prev);
                }
                else {
                    prev();
                }
            };
            // Continue execution with the new prev continuation.
            next(newPrev2);
        };
        
        var continueFwd = function() {
            var newPrev = prev;
            // Update the visualisation mid-running.
            if (self.updateCallback) {
                // Call updateCallback with a duration of -1 to indicate any non-stateful update should be skipped.
                var updatePrev = self.updateCallback(n, x, true, -1, newPrev);
                if (updatePrev) {
                    newPrev = updatePrev;
                }
            }
            newNext(newPrev);
        }
        
        // Handle jumping.
        if (this.state === "jump") {
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
                continueFwd();
            }
            return;
        }
        
        if (!newPauseLine) {
            continueFwd();
            return;
        }
        
        switch (this.state) {
            case "step-into":
                this.doPause(n, x, newNext, prev);
                break;
            case "step-over":
                if (pausedStackDelta <= 0) {
                    this.doPause(n, x, newNext, prev);
                }
                else {
                    continueFwd();
                }
                break;
            case "step-out":
                if (pausedStackDelta < 0) {
                    this.doPause(n, x, newNext, prev);
                }
                else {
                    continueFwd();
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
                    continueFwd();
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
