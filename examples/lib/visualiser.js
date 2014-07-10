var tailspinDebugger;
var mySource, mySupport;

var supportDocs = [
    {name:"Support", src:_support, mode:"javascript"},
    {name:"Options", src:JSON.stringify(_options), mode:{name: "javascript", json: true}},
    {name:"Visualisation", src:_visualisation, mode:"htmlmixed"},
];
var selectedDoc = 0;

window.onload = function() {
    mySource = CodeMirror(document.getElementById("debugger"), {
      value:_code,
      lineNumbers:true,
      mode:"javascript",
      indentUnit:4});
    
    mySupport = CodeMirror(document.getElementById("support"), {
      value: "",
      lineNumbers:true,
      mode: "javascript",
      indentUnit:4});
    
    tailspinDebugger = new Debugger(mySource);
    tailspinDebugger.callRunFunctionOnRunning = true;
    tailspinDebugger.result = console.log.bind(console);
    tailspinDebugger.error = console.error.bind(console);
    
    // Load saved code.
    if (typeof localStorage["Source"] === "string") {
        mySource.getDoc().setValue(localStorage["Source"]);
    }
    if (typeof localStorage["support_Support"] === "string") {
        supportDocs[0].src = localStorage["support_Support"];
    }
    if (typeof localStorage["support_Options"] === "string") {
        supportDocs[1].src = localStorage["support_Options"];
    }
    if (typeof localStorage["support_Visualisation"] === "string") {
        supportDocs[2].src = localStorage["support_Visualisation"];
    }
    
    // Setup support tabs.
    var tabs = document.getElementById("docs");
    for (var i=0, c=supportDocs.length; i<c; i++) {
        var t = document.createElement("li");
        t.innerHTML = supportDocs[i].name;
        t.addEventListener('click', selectTab.bind(null, i));
        if (i===selectedDoc) t.setAttribute("class", "selected");
        tabs.appendChild(t);
        
        supportDocs[i].element = t;
    }
    
    updateOptions();
    updateVisualisation();
    selectTab(0);
    
    mySupport.on('changes', supportUpdate);
    mySource.on('changes', sourceUpdate);
}

function updateOptions() {
    var options = JSON.parse(supportDocs[1].src);
    tailspinDebugger.preRunSource = options.preRunSource;
    tailspinDebugger.persistentGlobals = options.persistentGlobals;
}

function updateVisualisation() {
    // Loads the visualisation code into an iFrame and links it up to the debugger.
    var v = document.getElementById('visualiser');
    
    v.onload = function () {
        tailspinDebugger.updateCallback = v.contentWindow.update;
        tailspinDebugger.argsCallback = v.contentWindow.args;
        tailspinDebugger.globalsCallback = v.contentWindow.globals;
        
        v.contentWindow.reset = function() {
            tailspinDebugger.reset();
        };
        v.contentWindow.runScript = function(script) {
            tailspinDebugger.runUserScript(script);
        };
        
        // Reset the debugger.
        tailspinDebugger.supportCode = supportDocs[0].src;
        tailspinDebugger.reset();
    };
    
    // Load the source into the frame.
    v.contentDocument.open();
    v.contentDocument.write(supportDocs[2].src);
    v.contentDocument.close();
}

var updateSupportTimeout, updateSourceTimeout;

function supportUpdateSave() {
    var code = mySupport.getValue();
    supportDocs[selectedDoc].src = code;
    localStorage["support_"+supportDocs[selectedDoc].name] = code;
    
    if (selectedDoc === 0) {
        tailspinDebugger.supportCode = supportDocs[0].src;
        tailspinDebugger.reset();
    }
    else if (selectedDoc === 1) {
        updateOptions();
    }
    else if (selectedDoc === 2) {
        updateVisualisation();
    }
    updateSupportTimeout = null;
}

function supportUpdate(cMirror) {
    clearTimeout(updateSupportTimeout);
    updateSupportTimeout = setTimeout(supportUpdateSave, 3*1000);
}

function sourceUpdateSave() {
    var code = mySource.getValue();
    localStorage["Source"] = code;
    tailspinDebugger.reset();
    updateSourceTimeout = null;
}

function sourceUpdate(cMirror) {
    clearTimeout(updateSourceTimeout);
    updateSourceTimeout = setTimeout(sourceUpdateSave, 3*1000);
}

function selectTab(docIndex) {
    if (updateSupportTimeout) {
        clearTimeout(updateSupportTimeout);
        supportUpdateSave();
    }
    
    selectedDoc = docIndex;
    for (var i=0, c=supportDocs.length; i<c; i++) {
        supportDocs[i].element.setAttribute("class", i===selectedDoc?"selected":"");
    }
    
    mySupport.off('changes', supportUpdate);
    mySupport.getDoc().setValue(supportDocs[selectedDoc].src);
    mySupport.setOption("mode", supportDocs[selectedDoc].mode);
    mySupport.on('changes', supportUpdate);
}
