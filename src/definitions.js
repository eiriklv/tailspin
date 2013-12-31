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

var Tailspin = {};

Tailspin.Definitions = (function () {
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
    "GROUP", "LIST", "ARRAY_COMP", "COMP_TAIL",

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

// Hash of keyword identifier to tokens index.
var keywords = {};

// Define const END, etc., based on the token names.  Also map name to index.
var tokenIds = {};

// Building up a string to be eval'd in different contexts.
var consts = "var ";
for (var i = 0, j = tokens.length; i < j; i++) {
    if (i > 0) {
        consts += ", ";
    }
    
    var t = tokens[i];
    var name;
    if (/^[a-z]/.test(t)) {
        name = t.toUpperCase();
        if (strictKeywords.hasOwnProperty(name)) {
            strictKeywords[name] = i;
        }
        keywords[t] = i;
    }
    else {
        name = (/^\W/.test(t) ? opTypeNames[t] : t);
    }
    
    consts += name + " = " + i;
    tokenIds[name] = i;
    tokens[t] = i;
}
consts += ";";

var isStatementStartCode = {};
for (i = 0, j = statementStartTokens.length; i < j; i++) {
    isStatementStartCode[keywords[statementStartTokens[i]]] = true;
}

// Map assignment operators to their indexes in the tokens array.
var assignOps = ['|', '^', '&', '<<', '>>', '>>>', '+', '-', '*', '/', '%'];

for (i = 0, j = assignOps.length; i < j; i++) {
    var t = assignOps[i];
    assignOps[t] = tokens[t];
}

var exports = {};
exports.tokens = tokens;
exports.whitespace = whitespace;
exports.newlines = newlines;
exports.opTypeNames = opTypeNames;
exports.keywords = keywords;
exports.strictKeywords = strictKeywords;
exports.isStatementStartCode = isStatementStartCode;
exports.tokenIds = tokenIds;
exports.consts = consts;
exports.assignOps = assignOps;
return exports;
})();
