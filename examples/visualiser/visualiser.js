var tailspinDebugger;
var mySupport;

var supportDocs = [
    {name:"Support", src:_support, mode:"javascript"},
    {name:"Options", src:JSON.stringify(_options), mode:{name: "javascript", json: true}},
    {name:"Visualisation", src:_visualisation, mode:"htmlmixed"},
];
var selectedDoc = 0;

window.onload = function() {
    var mySource = CodeMirror(document.getElementById("debugger"), {
      value:_code,
      lineNumbers:true,
      mode:"javascript",
      indentUnit:4});
        
    mySupport = CodeMirror(document.getElementById("support"), {
      value: "",
      lineNumbers:true,
      mode: "javascript",
      indentUnit:4});
    mySupport.on('changes', supportUpdate);
    
    tailspinDebugger = new Debugger(mySource);
    tailspinDebugger.log = console.log;
    
    // Load saved code.
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
    
    updateVisualisation();
    selectTab(0);
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
        
        // Reset the debugger.
        tailspinDebugger.supportCode = supportDocs[0].src;
        tailspinDebugger.reset();
    };
    
    // Load the source into the frame.
    v.contentDocument.open();
    v.contentDocument.write(supportDocs[2].src);
    v.contentDocument.close();
}

function supportUpdate(cMirror) {
    var code = cMirror.getValue();
    supportDocs[selectedDoc].src = code;
    localStorage["support_"+supportDocs[selectedDoc].name] = code;
    
    if (selectedDoc === 0) {
        tailspinDebugger.supportCode = supportDocs[0].src;
        tailspinDebugger.reset();
    }
    if (selectedDoc === 2) {
        updateVisualisation();
    }
}

function selectTab(docIndex) {
    selectedDoc = docIndex;
    for (var i=0, c=supportDocs.length; i<c; i++) {
        supportDocs[i].element.setAttribute("class", i===selectedDoc?"selected":"");
    }
    
    mySupport.off('changes', supportUpdate);
    mySupport.getDoc().setValue(supportDocs[selectedDoc].src);
    mySupport.setOption("mode", supportDocs[selectedDoc].mode);
    mySupport.on('changes', supportUpdate);
}