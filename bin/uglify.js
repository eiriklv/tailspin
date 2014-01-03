#!/usr/bin/env node

var UglifyJS = require("uglify-js");
var data = "";


process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
    data += chunk;
});

process.stdin.on('end', function() {
    var ast = UglifyJS.parse(data);
    
    /*
var warn = UglifyJS.AST_Node.warn;
UglifyJS.AST_Node.warn = function(s, o) {
console.log(o.msg);
    if (o.msg === "Dropping unused function argument") return;
    warn.apply(this, arguments);
};*/
    
    
    ast.figure_out_scope();
    ast.scope_warnings({
        undeclared: false,
        unreferenced: false,
        assign_to_global: true,
        func_arguments: false,
        nested_defuns: false,
        eval: false
      });
    
    compressor = UglifyJS.Compressor({warnings:true, comparisons:false});
    ast = ast.transform(compressor);
    
    ast.figure_out_scope();
    ast.compute_char_frequency(true);
    ast.mangle_names(true);
    
    console.log(ast.print_to_string());
});
