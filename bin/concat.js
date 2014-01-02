#!/usr/bin/env node

var fs = require("fs");

// Load using 'eval' as definitions is not a Node module.
var defs = fs.readFileSync("src/definitions.js", "utf8");
eval(defs);

var stringify = JSON.stringify;
var whitespaceStringify = function (obj) {
    var white = "";
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            var unid = k.charCodeAt(0).toString(16)
            while (unid.length < 4) unid = "0"+unid;
            white += "'\\u"+unid+"':true,";
        }
    }
    return "{"+white+"}";
}

var concat = "";

// Start
concat += "var Tailspin = new (function () {\nvar Tailspin = this;\n\n";

// Definitions
concat += Tailspin.Definitions.consts;

concat += "\n\nTailspin.Definitions = {\n";
concat += "tokens: "+stringify(Tailspin.Definitions.tokens)+",\n";
concat += "whitespace: "+whitespaceStringify(Tailspin.Definitions.whitespace)+",\n";
concat += "newlines: "+whitespaceStringify(Tailspin.Definitions.newlines)+",\n";
concat += "opTypeNames: "+stringify(Tailspin.Definitions.opTypeNames)+",\n";
concat += "keywords: "+stringify(Tailspin.Definitions.keywords)+",\n";
concat += "strictKeywords: "+stringify(Tailspin.Definitions.strictKeywords)+",\n";
concat += "isStatementStartCode: "+stringify(Tailspin.Definitions.isStatementStartCode)+",\n";
concat += "tokenIds: "+stringify(Tailspin.Definitions.tokenIds)+",\n";
concat += "assignOps: "+stringify(Tailspin.Definitions.assignOps)+",\n";
    
concat += "}\n\n";

function concatFile(file) {
    var src = fs.readFileSync(file, "utf8");
    src = src.replace(/CUT>[\s\S]*?<CUT/g, "");
    concat += src;
}

concatFile("src/utility.js");
concatFile("src/lexer.js");
concatFile("src/parser.js");
concatFile("src/decompiler.js");
concatFile("src/sandbox.js");
concatFile("src/interpreter.js");

concat += "\n\n})();\n";

console.log(concat);
