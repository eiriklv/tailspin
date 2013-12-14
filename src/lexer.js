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
 *   Stephan Herhut <stephan.a.herhut@intel.com>
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
 * Lexical scanner.
 */


var Lexer = (function () {
"use strict";
var tk = Definitions.tokenIds;

// Build up a trie of operator tokens.
var opTokens = {};
for (var op in Definitions.opTypeNames) {
    if (Object.prototype.hasOwnProperty.call(Definitions.opTypeNames, op)) {
        if (op === '\n' || op === '.')
            continue;
    
        var node = opTokens;
        for (var i = 0; i < op.length; i++) {
            var ch = op[i];
            if (!(ch in node))
                node[ch] = {};
            node = node[ch];
            node.op = op;
        }
    }
}

/*
 * Since JavaScript provides no convenient way to determine if a
 * character is in a particular Unicode category, we use
 * metacircularity to accomplish this (oh yeaaaah!)
 */
function isValidIdentifierChar(ch, first) {
    // check directly for ASCII
    if (ch <= "\u007F") {
        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '$' || ch === '_' ||
            (!first && (ch >= '0' && ch <= '9'))) {
            return true;
        }
        return false;
    }

    // create an object to test this in
    var x = {};
    x["x"+ch] = true;
    x[ch] = true;

    // then use eval to determine if it's a valid character
    var valid = false;
    try {
        valid = (Function("x", "return (x." + (first?"":"x") + ch + ");")(x) === true);
    } catch (ex) {}

    return valid;
}

function isIdentifier(str) {
    if (typeof str !== "string")
        return false;

    if (str.length === 0)
        return false;

    if (!isValidIdentifierChar(str[0], true))
        return false;

    for (var i = 1; i < str.length; i++) {
        if (!isValidIdentifierChar(str[i], false))
            return false;
    }

    return true;
}

/*
 * Tokenizer :: (source, filename, line number, boolean, sandbox) -> Tokenizer
 */
function Tokenizer(source, filename, lineno, allowHTMLComments, sandbox) {
    this.cursor = 0;
    this.source = String(source);
    this.tokens = [];
    this.tokenIndex = 0;
    this.lookahead = 0;
    this.scanNewlines = false;
    this.filename = filename || "";
    this.lineno = lineno || 1;
    this.allowHTMLComments = allowHTMLComments;
    this.blockComments = null;
    this.sandbox = sandbox || (new Function("return this"))();
}

Tokenizer.prototype = {
    get done() {
        // We need to set scanOperand to true here because the first thing
        // might be a regexp.
        return this.peek(true) === tk.END;
    },

    get token() {
        return this.tokens[this.tokenIndex];
    },

    match: function (tt, scanOperand, keywordIsName) {
        return this.get(scanOperand, keywordIsName) === tt || this.unget();
    },

    mustMatch: function (tt, keywordIsName) {
        if (!this.match(tt, false, keywordIsName)) {
            throw this.newSyntaxError("Missing " +
                                      Definitions.tokens[tt].toLowerCase());
        }
        return this.token;
    },

    peek: function (scanOperand) {
        var tt, next;
        if (this.lookahead) {
            next = this.tokens[(this.tokenIndex + this.lookahead) & 3];
            tt = (this.scanNewlines && next.lineno !== this.lineno) ? tk.NEWLINE : next.type;
        } else {
            tt = this.get(scanOperand);
            this.unget();
        }
        return tt;
    },

    peekOnSameLine: function (scanOperand) {
        this.scanNewlines = true;
        var tt = this.peek(scanOperand);
        this.scanNewlines = false;
        return tt;
    },

    lastBlockComment: function() {
        var length = this.blockComments.length;
        return length ? this.blockComments[length - 1] : null;
    },

    // Eat comments and whitespace.
    skip: function () {
        var input = this.source;
        this.blockComments = [];
        for (;;) {
            var ch = input[this.cursor++];
            var next = input[this.cursor];
            // handle \r, \r\n and (always preferable) \n
            if (Definitions.newlines[ch]) {
                // if the next character is \n, we don't care about this at all
                if (ch === '\r' && next === '\n') continue;

                // otherwise, we want to consider this as a newline
                ch = '\n';
            }

            if (ch === '\n' && !this.scanNewlines) {
                this.lineno++;
            } else if (ch === '/' && next === '*') {
                var commentStart = ++this.cursor;
                var commentEnd = commentStart;
                for (;;) {
                    ch = input[this.cursor++];
                    if (ch === undefined)
                        throw this.newSyntaxError("Unterminated comment");

                    if (ch === '*') {
                        next = input[this.cursor];
                        if (next === '/') {
                            commentEnd = this.cursor - 1;
                            this.cursor++;
                            break;
                        }
                    } else if (ch === '\n') {
                        this.lineno++;
                    }
                }
                this.blockComments.push(input.substring(commentStart, commentEnd));
            } else if ((ch === '/' && next === '/') ||
                       (this.allowHTMLComments && ch === '<' && next === '!' &&
                        input[this.cursor + 1] === '-' && input[this.cursor + 2] === '-' &&
                        (this.cursor += 2))) {
                this.cursor++;
                for (;;) {
                    ch = input[this.cursor++];
                    next = input[this.cursor];
                    if (ch === undefined)
                        return;

                    if (Definitions.newlines[ch]) {
                        // check for \r\n but skip \r
                        if (ch !== '\r' || next !== '\n') ch = '\n';
                    }

                    if (ch === '\n') {
                        if (this.scanNewlines) {
                            this.cursor--;
                        } else {
                            this.lineno++;
                        }
                        break;
                    }
                }
            } else if (!(ch in Definitions.whitespace)) {
                this.cursor--;
                return;
            }
        }
    },

    // Lex the exponential part of a number, if present. Return true iff an
    // exponential part was found.
    lexExponent: function() {
        var input = this.source;
        var next = input[this.cursor];
        if (next === 'e' || next === 'E') {
            this.cursor++;
            ch = input[this.cursor++];
            if (ch === '+' || ch === '-')
                ch = input[this.cursor++];

            if (ch < '0' || ch > '9')
                throw this.newSyntaxError("Missing exponent");

            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '9');
            this.cursor--;

            return true;
        }

        return false;
    },

    lexZeroNumber: function (ch) {
        var token = this.token, input = this.source;
        token.type = tk.NUMBER;

        ch = input[this.cursor++];
        if (ch === '.') {
            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '9');
            this.cursor--;

            this.lexExponent();
            token.value = this.sandbox.parseFloat(input.substring(token.start, this.cursor));
        }
        else if (ch === 'x' || ch === 'X') {
            do {
                ch = input[this.cursor++];
            } while ((ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'f') ||
                     (ch >= 'A' && ch <= 'F'));
            this.cursor--;
            
            if (token.start+2 >= this.cursor) {
                throw this.newSyntaxError("At least one digit must occur after 0x");
            }

            token.value = this.sandbox.parseInt(input.substring(token.start, this.cursor));
        }
        else if (ch >= '0' && ch <= '9') {
            if (this.parser.x.strictMode) {
                throw this.newSyntaxError("Octal escapes are forbidden in strict mode");
            }
            
            // always parse as non-octal
            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '9');
            this.cursor--;

            token.value = this.sandbox.parseInt(input.substring(token.start, this.cursor));
        }
        else {
            this.cursor--;
            this.lexExponent();     // 0E1, &c.
            token.value = 0;
        }
    },

    lexNumber: function (ch) {
        var token = this.token, input = this.source;
        token.type = tk.NUMBER;

        var floating = false;
        do {
            ch = input[this.cursor++];
            if (ch === '.' && !floating) {
                floating = true;
                ch = input[this.cursor++];
            }
        } while (ch >= '0' && ch <= '9');

        this.cursor--;

        var exponent = this.lexExponent();
        floating = floating || exponent;

        var str = input.substring(token.start, this.cursor);
        token.value = floating ? this.sandbox.parseFloat(str) : this.sandbox.parseInt(str);
    },

    lexDot: function (ch) {
        var token = this.token, input = this.source;
        var next = input[this.cursor];
        if (next >= '0' && next <= '9') {
            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '9');
            this.cursor--;

            this.lexExponent();

            token.type = tk.NUMBER;
            token.value = this.sandbox.parseFloat(input.substring(token.start, this.cursor));
        } else {
            token.type = tk.DOT;
            token.assignOp = null;
            token.value = '.';
        }
    },

    lexString: function (ch) {
        var token = this.token, input = this.source;
        token.type = tk.STRING;

        var hasEscapes = false;
        var delim = ch;
        
        if (this.cursor >= input.length) {
            throw this.newSyntaxError("Unterminated string literal");
        }
            
        while ((ch = input[this.cursor++]) !== delim) {
            if (Definitions.newlines[ch]) {
                throw this.newSyntaxError("Unterminated string literal, illegal unescaped new-line.");
            }
            
            if (ch === '\\') {
                hasEscapes = true;
                
                // Treat \r\n as a single character for escaping new lines.
                if (this.cursor+1 < input.length) {
                    if (input[this.cursor] === '\r' && input[this.cursor+1] === '\n') {
                        this.cursor++;
                    }
                }
                
                this.cursor++;
            }
            
            if (this.cursor >= input.length) {
                throw this.newSyntaxError("Unterminated string literal");
            }
        }
        
        if (this.parser.x.strictMode) {
            token.value = this.sandbox.eval('"use strict"; '+input.substring(token.start, this.cursor));
        }
        else {
            // Always evaluate the string in the sandbox, to convert the string to a sandbox string.
            token.value = this.sandbox.eval(input.substring(token.start, this.cursor));
        }
    },

    lexRegExp: function (ch) {
        var token = this.token, input = this.source;
        token.type = tk.REGEXP;

        do {
            ch = input[this.cursor++];
            if (ch === '\\') {
                this.cursor++;
            }
            else if (ch === '[') {
                do {
                    if (ch === undefined)
                        throw this.newSyntaxError("Unterminated character class");

                    if (ch === '\\')
                        this.cursor++;

                    ch = input[this.cursor++];
                } while (ch !== ']');
            }
            else if (ch === undefined) {
                throw this.newSyntaxError("Unterminated regex");
            }
        } while (ch !== '/');

        do {
            ch = input[this.cursor++];
        } while (ch >= 'a' && ch <= 'z');

        this.cursor--;

        token.value = this.sandbox.eval(input.substring(token.start, this.cursor));
    },

    lexOp: function (ch) {
        var token = this.token, input = this.source;

        // A bit ugly, but it seems wasteful to write a trie lookup routine
        // for only 3 characters...
        var node = opTokens[ch];
        var next = input[this.cursor];
        if (next in node) {
            node = node[next];
            this.cursor++;
            next = input[this.cursor];
            if (next in node) {
                node = node[next];
                this.cursor++;
                next = input[this.cursor];
            }
        }

        var op = node.op;
        if (Definitions.assignOps[op] && input[this.cursor] === '=') {
            this.cursor++;
            token.type = tk.ASSIGN;
            token.assignOp = Definitions.tokenIds[Definitions.opTypeNames[op]];
            op += '=';
        } else {
            token.type = Definitions.tokenIds[Definitions.opTypeNames[op]];
            token.assignOp = null;
        }

        token.value = op;
    },

    // FIXME: Unicode escape sequences
    lexIdent: function (ch, keywordIsName) {
        var token = this.token;
        var id = ch;

        while ((ch = this.getValidIdentifierChar(false)) !== null) {
            id += ch;
        }

        token.type = tk.IDENTIFIER;
        token.value = id;

        if (keywordIsName)
            return;

        var kw;

        if (this.parser.mozillaMode) {
            kw = Definitions.mozillaKeywords[id];
            if (kw) {
                token.type = kw;
                return;
            }
        }

        if (this.parser.x.strictMode) {
            kw = Definitions.strictKeywords[id];
            if (kw) {
                token.type = kw;
                return;
            }
        }

        kw = Definitions.keywords[id];
        if (kw) {
            token.type = kw;
        }
    },

    /*
     * Tokenizer.get :: ([boolean[, boolean]]) -> token type
     *
     * Consume input *only* if there is no lookahead.
     * Dispatch to the appropriate lexing function depending on the input.
     */
    get: function (scanOperand, keywordIsName) {
        var token;
        while (this.lookahead) {
            var newTokenIndex = (this.tokenIndex + 1) & 3;
            token = this.tokens[newTokenIndex];
            
            if (scanOperand && token.value === '/') {
                // Need to scan for regex instead of division.
                this.discardLookahead();
                break;
            }
            
            this.lookahead--;
            this.tokenIndex = newTokenIndex;
            
            if (token.type !== tk.NEWLINE || this.scanNewlines) {
                if (keywordIsName && token.value in Definitions.keywords) {
                    return tk.IDENTIFIER;
                }
                return token.type;
            }
        }

        this.skip();

        this.tokenIndex = (this.tokenIndex + 1) & 3;
        token = this.tokens[this.tokenIndex];
        if (!token) {
            this.tokens[this.tokenIndex] = token = {};
        }

        var input = this.source;
        if (this.cursor >= input.length) {
            token.type = tk.END;
            return token.type;
        }

        token.start = this.cursor;
        token.lineno = this.lineno;

        var ich = this.getValidIdentifierChar(true);
        var ch = (ich === null) ? input[this.cursor++] : null;
        if (ich !== null) {
            this.lexIdent(ich, keywordIsName);
        } else if (scanOperand && ch === '/') {
            this.lexRegExp(ch);
        } else if (ch in opTokens) {
            this.lexOp(ch);
        } else if (ch === '.') {
            this.lexDot(ch);
        } else if (ch >= '1' && ch <= '9') {
            this.lexNumber(ch);
        } else if (ch === '0') {
            this.lexZeroNumber(ch);
        } else if (ch === '"' || ch === "'") {
            this.lexString(ch);
        } else if (this.scanNewlines && Definitions.newlines[ch]) {
            // if this was a \r, look for \r\n
            if (ch === '\r' && input[this.cursor] === '\n') this.cursor++;
            token.type = tk.NEWLINE;
            token.value = '\n';
            this.lineno++;
        } else {
            throw this.newSyntaxError("Illegal token");
        }

        token.end = this.cursor;
        return token.type;
    },

    /*
     * Tokenizer.unget :: void -> undefined
     *
     * Match depends on unget returning undefined.
     */
    unget: function () {
        if (++this.lookahead === 4) throw "PANIC: too much lookahead!";
        this.tokenIndex = (this.tokenIndex - 1) & 3;
    },
    
    discardLookahead: function () {
        while (this.lookahead) {
            --this.lookahead;
            this.tokenIndex = (this.tokenIndex + 1) & 3;
            var token = this.tokens[this.tokenIndex];
            this.cursor = token.start;
        }
    },

    newError: function (errorClass, m) {
        m = "["+(this.filename ? this.filename + ":" : "") + this.lineno + "] " + m;
        var e = new errorClass(m, this.filename, this.lineno);
        e.source = this.source;
        e.sourceLine = this.lineno;
        e.cursor = this.lookahead ?
              this.tokens[(this.tokenIndex + this.lookahead) & 3].start
            : this.cursor;
        return e;
    },

    newSyntaxError: function (m) {
        return this.newError(SyntaxError, m);
    },

    newReferenceError: function (m) {
        return this.newError(ReferenceError, m);
    },


    /* Gets a single valid identifier char from the input stream, or null
     * if there is none.
     */
    getValidIdentifierChar: function(first) {
        var input = this.source;
        if (this.cursor >= input.length) return null;
        var ch = input[this.cursor];
        var chInc = 1;

        // first check for \u escapes
        if (ch === '\\' && input[this.cursor+1] === 'u') {
            // get the character value
            try {
                ch = String.fromCharCode(parseInt(
                    input.substring(this.cursor + 2, this.cursor + 6),
                    16));
            } catch (ex) {
                return null;
            }
            chInc = 6;
        }

        var valid = isValidIdentifierChar(ch, first);
        if (valid) {
            this.cursor += chInc;
        }
        return (valid ? ch : null);
    },
};

var exports = {};
exports.isIdentifier = isIdentifier;
exports.Tokenizer = Tokenizer;

return exports;
})();
