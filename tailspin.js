var Tailspin = new function() {
  var Tailspin = this;
  var END = 0, NEWLINE = 1, SEMICOLON = 2, COMMA = 3, ASSIGN = 4, HOOK = 5, COLON = 6, CONDITIONAL = 7, OR = 8, AND = 9, BITWISE_OR = 10, BITWISE_XOR = 11, BITWISE_AND = 12, EQ = 13, NE = 14, STRICT_EQ = 15, STRICT_NE = 16, LT = 17, LE = 18, GE = 19, GT = 20, LSH = 21, RSH = 22, URSH = 23, PLUS = 24, MINUS = 25, MUL = 26, DIV = 27, MOD = 28, NOT = 29, BITWISE_NOT = 30, UNARY_PLUS = 31, UNARY_MINUS = 32, INCREMENT = 33, DECREMENT = 34, DOT = 35, LEFT_BRACKET = 36, RIGHT_BRACKET = 37, LEFT_CURLY = 38, RIGHT_CURLY = 39, LEFT_PAREN = 40, RIGHT_PAREN = 41, SCRIPT = 42, BLOCK = 43, LABEL = 44, FOR_IN = 45, CALL = 46, NEW_WITH_ARGS = 47, INDEX = 48, ARRAY_INIT = 49, OBJECT_INIT = 50, PROPERTY_INIT = 51, GETTER = 52, SETTER = 53, GROUP = 54, LIST = 55, ARRAY_COMP = 56, COMP_TAIL = 57, IDENTIFIER = 58, NUMBER = 59, STRING = 60, REGEXP = 61, BREAK = 62, CASE = 63, CATCH = 64, CONST = 65, CONTINUE = 66, DEBUGGER = 67, DEFAULT = 68, DELETE = 69, DO = 70, ELSE = 71, EXPORT = 72, FALSE = 73, FINALLY = 74, FOR = 75, FUNCTION = 76, IF = 77, IMPORT = 78, IN = 79, INSTANCEOF = 80, NEW = 81, NULL = 82, RETURN = 83, SWITCH = 84, THIS = 85, THROW = 86, TRUE = 87, TRY = 88, TYPEOF = 89, VAR = 90, VOID = 91, WHILE = 92, WITH = 93, CLASS = 94, EXTENDS = 95, ENUM = 96, SUPER = 97;
  Tailspin.Definitions = {
    tokens: [ "END", "\n", ";", ",", "=", "?", ":", "CONDITIONAL", "||", "&&", "|", "^", "&", "==", "!=", "===", "!==", "<", "<=", ">=", ">", "<<", ">>", ">>>", "+", "-", "*", "/", "%", "!", "~", "UNARY_PLUS", "UNARY_MINUS", "++", "--", ".", "[", "]", "{", "}", "(", ")", "SCRIPT", "BLOCK", "LABEL", "FOR_IN", "CALL", "NEW_WITH_ARGS", "INDEX", "ARRAY_INIT", "OBJECT_INIT", "PROPERTY_INIT", "GETTER", "SETTER", "GROUP", "LIST", "ARRAY_COMP", "COMP_TAIL", "IDENTIFIER", "NUMBER", "STRING", "REGEXP", "break", "case", "catch", "const", "continue", "debugger", "default", "delete", "do", "else", "export", "false", "finally", "for", "function", "if", "import", "in", "instanceof", "new", "null", "return", "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while", "with", "class", "extends", "enum", "super" ],
    whitespace: {
      "	": true,
      "": true,
      "\f": true,
      " ": true,
      " ": true,
      "﻿": true,
      " ": true,
      "᠎": true,
      " ": true,
      " ": true,
      " ": true,
      " ": true,
      " ": true,
      " ": true,
      " ": true,
      " ": true,
      " ": true,
      " ": true,
      " ": true,
      "\u2028": true,
      "\u2029": true,
      " ": true,
      " ": true,
      "　": true
    },
    newlines: {
      "\n": true,
      "\r": true,
      "\u2028": true,
      "\u2029": true
    },
    opTypeNames: {
      "\n": "NEWLINE",
      ";": "SEMICOLON",
      ",": "COMMA",
      "?": "HOOK",
      ":": "COLON",
      "||": "OR",
      "&&": "AND",
      "|": "BITWISE_OR",
      "^": "BITWISE_XOR",
      "&": "BITWISE_AND",
      "===": "STRICT_EQ",
      "==": "EQ",
      "=": "ASSIGN",
      "!==": "STRICT_NE",
      "!=": "NE",
      "<<": "LSH",
      "<=": "LE",
      "<": "LT",
      ">>>": "URSH",
      ">>": "RSH",
      ">=": "GE",
      ">": "GT",
      "++": "INCREMENT",
      "--": "DECREMENT",
      "+": "PLUS",
      "-": "MINUS",
      "*": "MUL",
      "/": "DIV",
      "%": "MOD",
      "!": "NOT",
      "~": "BITWISE_NOT",
      ".": "DOT",
      "[": "LEFT_BRACKET",
      "]": "RIGHT_BRACKET",
      "{": "LEFT_CURLY",
      "}": "RIGHT_CURLY",
      "(": "LEFT_PAREN",
      ")": "RIGHT_PAREN"
    },
    keywords: {
      "break": 62,
      "case": 63,
      "catch": 64,
      "const": 65,
      "continue": 66,
      "debugger": 67,
      "default": 68,
      "delete": 69,
      "do": 70,
      "else": 71,
      "export": 72,
      "false": 73,
      "finally": 74,
      "for": 75,
      "function": 76,
      "if": 77,
      "import": 78,
      "in": 79,
      "instanceof": 80,
      "new": 81,
      "null": 82,
      "return": 83,
      "switch": 84,
      "this": 85,
      "throw": 86,
      "true": 87,
      "try": 88,
      "typeof": 89,
      "var": 90,
      "void": 91,
      "while": 92,
      "with": 93,
      "class": 94,
      "extends": 95,
      "enum": 96,
      "super": 97
    },
    strictKeywords: {
      "implements": true,
      "interface": true,
      let: true,
      module: true,
      "package": true,
      "private": true,
      "protected": true,
      "public": true,
      "static": true,
      use: true,
      yield: true
    },
    isStatementStartCode: {
      "62": true,
      "65": true,
      "66": true,
      "67": true,
      "70": true,
      "75": true,
      "77": true,
      "83": true,
      "84": true,
      "86": true,
      "88": true,
      "90": true,
      "92": true,
      "93": true
    },
    tokenIds: {
      END: 0,
      NEWLINE: 1,
      SEMICOLON: 2,
      COMMA: 3,
      ASSIGN: 4,
      HOOK: 5,
      COLON: 6,
      CONDITIONAL: 7,
      OR: 8,
      AND: 9,
      BITWISE_OR: 10,
      BITWISE_XOR: 11,
      BITWISE_AND: 12,
      EQ: 13,
      NE: 14,
      STRICT_EQ: 15,
      STRICT_NE: 16,
      LT: 17,
      LE: 18,
      GE: 19,
      GT: 20,
      LSH: 21,
      RSH: 22,
      URSH: 23,
      PLUS: 24,
      MINUS: 25,
      MUL: 26,
      DIV: 27,
      MOD: 28,
      NOT: 29,
      BITWISE_NOT: 30,
      UNARY_PLUS: 31,
      UNARY_MINUS: 32,
      INCREMENT: 33,
      DECREMENT: 34,
      DOT: 35,
      LEFT_BRACKET: 36,
      RIGHT_BRACKET: 37,
      LEFT_CURLY: 38,
      RIGHT_CURLY: 39,
      LEFT_PAREN: 40,
      RIGHT_PAREN: 41,
      SCRIPT: 42,
      BLOCK: 43,
      LABEL: 44,
      FOR_IN: 45,
      CALL: 46,
      NEW_WITH_ARGS: 47,
      INDEX: 48,
      ARRAY_INIT: 49,
      OBJECT_INIT: 50,
      PROPERTY_INIT: 51,
      GETTER: 52,
      SETTER: 53,
      GROUP: 54,
      LIST: 55,
      ARRAY_COMP: 56,
      COMP_TAIL: 57,
      IDENTIFIER: 58,
      NUMBER: 59,
      STRING: 60,
      REGEXP: 61,
      BREAK: 62,
      CASE: 63,
      CATCH: 64,
      CONST: 65,
      CONTINUE: 66,
      DEBUGGER: 67,
      DEFAULT: 68,
      DELETE: 69,
      DO: 70,
      ELSE: 71,
      EXPORT: 72,
      FALSE: 73,
      FINALLY: 74,
      FOR: 75,
      FUNCTION: 76,
      IF: 77,
      IMPORT: 78,
      IN: 79,
      INSTANCEOF: 80,
      NEW: 81,
      NULL: 82,
      RETURN: 83,
      SWITCH: 84,
      THIS: 85,
      THROW: 86,
      TRUE: 87,
      TRY: 88,
      TYPEOF: 89,
      VAR: 90,
      VOID: 91,
      WHILE: 92,
      WITH: 93,
      CLASS: 94,
      EXTENDS: 95,
      ENUM: 96,
      SUPER: 97
    },
    assignOps: {
      "|": 10,
      "^": 11,
      "&": 12,
      "<<": 21,
      ">>": 22,
      ">>>": 23,
      "+": 24,
      "-": 25,
      "*": 26,
      "/": 27,
      "%": 28
    }
  };
  Tailspin.Utility = function() {
    "use strict";
    function applyNew(f, a) {
      return new (f.bind.apply(f, [ ,  ].concat(Array.prototype.slice.call(a))))();
    }
    function hasDirectProperty(o, p) {
      return Object.prototype.hasOwnProperty.call(o, p);
    }
    function getPropertyDescriptor(obj, propName) {
      var propDesc;
      while (!propDesc && obj) {
        propDesc = Object.getOwnPropertyDescriptor(obj, propName);
        if (!propDesc) {
          obj = Object.getPrototypeOf(obj);
        }
      }
      return propDesc;
    }
    function Dict(table, size) {
      this.table = table || Object.create(null, {});
      this.size = size || 0;
    }
    Dict.create = function(table) {
      var init = Object.create(null, {});
      var size = 0;
      var names = Object.getOwnPropertyNames(table);
      for (var i = 0, n = names.length; i < n; i++) {
        var name = names[i];
        init[name] = table[name];
        size++;
      }
      return new Dict(init, size);
    };
    Dict.prototype = {
      has: function(x) {
        return hasDirectProperty(this.table, x);
      },
      set: function(x, v) {
        if (!hasDirectProperty(this.table, x)) this.size++;
        this.table[x] = v;
      },
      get: function(x) {
        return this.table[x];
      },
      getDef: function(x, thunk) {
        if (!hasDirectProperty(this.table, x)) {
          this.size++;
          this.table[x] = thunk();
        }
        return this.table[x];
      },
      forEach: function(f) {
        var table = this.table;
        for (var key in table) {
          if (hasDirectProperty(table, key)) {
            f.call(this, key, table[key]);
          }
        }
      },
      map: function(f) {
        var table2 = Object.create(null, {});
        this.forEach(function(key, val) {
          table2[key] = f.call(this, val, key);
        });
        return new Dict(table2, this.size);
      },
      mapObject: function(f) {
        var table2 = Object.create(null, {});
        this.forEach(function(key, val) {
          table2[key] = f.call(this, val, key);
        });
        return table2;
      },
      toObject: function() {
        return this.mapObject(function(val) {
          return val;
        });
      },
      choose: function() {
        return Object.getOwnPropertyNames(this.table)[0];
      },
      remove: function(x) {
        if (hasDirectProperty(this.table, x)) {
          this.size--;
          delete this.table[x];
        }
      },
      copy: function() {
        var table = Object.create(null, {});
        for (var key in this.table) {
          if (hasDirectProperty(table, key)) {
            table[key] = this.table[key];
          }
        }
        return new Dict(table, this.size);
      },
      keys: function() {
        return Object.keys(this.table);
      },
      toString: function() {
        return "[object Dict]";
      }
    };
    function Stack(elts) {
      this.elts = elts || null;
    }
    Stack.prototype = {
      push: function(x) {
        return new Stack({
          top: x,
          rest: this.elts
        });
      },
      top: function() {
        if (!this.elts) throw new Error("empty stack");
        return this.elts.top;
      },
      isEmpty: function() {
        return this.top === null;
      },
      find: function(test) {
        for (var elts = this.elts; elts; elts = elts.rest) {
          if (test(elts.top)) return elts.top;
        }
        return null;
      },
      has: function(x) {
        return Boolean(this.find(function(elt) {
          return elt === x;
        }));
      },
      forEach: function(f) {
        for (var elts = this.elts; elts; elts = elts.rest) {
          f(elts.top);
        }
      }
    };
    var exports = {};
    exports.hasDirectProperty = hasDirectProperty;
    exports.getPropertyDescriptor = getPropertyDescriptor;
    exports.applyNew = applyNew;
    exports.Dict = Dict;
    exports.Stack = Stack;
    return exports;
  }();
  Tailspin.Lexer = function() {
    "use strict";
    var Definitions = Tailspin.Definitions;
    var tk = Definitions.tokenIds;
    var opTokens = {};
    for (var op in Definitions.opTypeNames) {
      if (Definitions.opTypeNames.hasOwnProperty(op)) {
        if (op === "\n" || op === ".") {
          continue;
        }
        var node = opTokens;
        for (var i = 0; i < op.length; i++) {
          var ch = op[i];
          if (!node.hasOwnProperty(ch)) {
            node[ch] = {};
          }
          node = node[ch];
          node.op = op;
        }
      }
    }
    function isValidIdentifierChar(ch, first) {
      if (ch <= "") {
        if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch === "$" || ch === "_" || !first && ch >= "0" && ch <= "9") {
          return true;
        }
        return false;
      }
      var x = {};
      x["x" + ch] = true;
      x[ch] = true;
      var valid = false;
      try {
        valid = Function("x", "return (x." + (first ? "" : "x") + ch + ");")(x) === true;
      } catch (ex) {}
      return valid;
    }
    function isIdentifier(str) {
      if (typeof str !== "string") return false;
      if (str.length === 0) return false;
      if (!isValidIdentifierChar(str[0], true)) return false;
      for (var i = 1; i < str.length; i++) {
        if (!isValidIdentifierChar(str[i], false)) return false;
      }
      return true;
    }
    function Tokenizer(source, filename, lineno, sandbox) {
      this.cursor = 0;
      this.source = String(source);
      this.tokens = [];
      this.tokenIndex = 0;
      this.lookahead = 0;
      this.scanNewlines = false;
      this.filename = filename || "";
      this.lineno = lineno || 1;
      this.blockComments = null;
      this.sandbox = sandbox || new Function("return this")();
    }
    Tokenizer.prototype = {
      get done() {
        return this.peek(true) === tk.END;
      },
      get token() {
        return this.tokens[this.tokenIndex];
      },
      match: function(tt, scanOperand, keywordIsName) {
        return this.get(scanOperand, keywordIsName) === tt || this.unget();
      },
      mustMatch: function(tt, keywordIsName) {
        if (!this.match(tt, false, keywordIsName)) {
          throw this.newSyntaxError("Missing " + Definitions.tokens[tt].toLowerCase());
        }
        return this.token;
      },
      peek: function(scanOperand, keywordIsName) {
        var tt, next;
        if (this.lookahead) {
          next = this.tokens[this.tokenIndex + this.lookahead & 3];
          tt = this.scanNewlines && next.lineno !== this.lineno ? tk.NEWLINE : next.type;
        } else {
          tt = this.get(scanOperand, keywordIsName);
          this.unget();
        }
        return tt;
      },
      peekOnSameLine: function(scanOperand) {
        this.scanNewlines = true;
        var tt = this.peek(scanOperand);
        this.scanNewlines = false;
        return tt;
      },
      lastBlockComment: function() {
        var length = this.blockComments.length;
        return length ? this.blockComments[length - 1] : null;
      },
      skip: function() {
        var input = this.source;
        this.blockComments = [];
        for (;;) {
          var ch = input[this.cursor++];
          var next = input[this.cursor];
          if (Definitions.newlines[ch]) {
            if (ch === "\r" && next === "\n") continue;
            ch = "\n";
          }
          if (ch === "\n" && !this.scanNewlines) {
            this.lineno++;
          } else if (ch === "/" && next === "*") {
            var commentStart = ++this.cursor;
            var commentEnd = commentStart;
            for (;;) {
              ch = input[this.cursor++];
              if (ch === undefined) throw this.newSyntaxError("Unterminated comment");
              if (ch === "*") {
                next = input[this.cursor];
                if (next === "/") {
                  commentEnd = this.cursor - 1;
                  this.cursor++;
                  break;
                }
              } else if (ch === "\n") {
                this.lineno++;
              }
            }
            this.blockComments.push(input.substring(commentStart, commentEnd));
          } else if (ch === "/" && next === "/") {
            this.cursor++;
            for (;;) {
              ch = input[this.cursor++];
              next = input[this.cursor];
              if (ch === undefined) return;
              if (Definitions.newlines[ch]) {
                if (ch !== "\r" || next !== "\n") ch = "\n";
              }
              if (ch === "\n") {
                if (this.scanNewlines) {
                  this.cursor--;
                } else {
                  this.lineno++;
                }
                break;
              }
            }
          } else if (!Definitions.whitespace.hasOwnProperty(ch)) {
            this.cursor--;
            return;
          }
        }
      },
      lexExponent: function() {
        var input = this.source;
        var next = input[this.cursor];
        if (next === "e" || next === "E") {
          this.cursor++;
          ch = input[this.cursor++];
          if (ch === "+" || ch === "-") ch = input[this.cursor++];
          if (ch < "0" || ch > "9") throw this.newSyntaxError("Missing exponent");
          do {
            ch = input[this.cursor++];
          } while (ch >= "0" && ch <= "9");
          this.cursor--;
          return true;
        }
        return false;
      },
      lexZeroNumber: function(ch) {
        var token = this.token, input = this.source;
        token.type = tk.NUMBER;
        ch = input[this.cursor++];
        if (ch === ".") {
          do {
            ch = input[this.cursor++];
          } while (ch >= "0" && ch <= "9");
          this.cursor--;
          this.lexExponent();
          token.value = this.sandbox.parseFloat(input.substring(token.start, this.cursor));
        } else if (ch === "x" || ch === "X") {
          do {
            ch = input[this.cursor++];
          } while (ch >= "0" && ch <= "9" || ch >= "a" && ch <= "f" || ch >= "A" && ch <= "F");
          this.cursor--;
          if (token.start + 2 >= this.cursor) {
            throw this.newSyntaxError("At least one digit must occur after 0x");
          }
          token.value = this.sandbox.parseInt(input.substring(token.start, this.cursor));
        } else if (ch >= "0" && ch <= "9") {
          if (this.parser.x.strictMode) {
            throw this.newSyntaxError("Octal escapes are forbidden in strict mode");
          }
          do {
            ch = input[this.cursor++];
          } while (ch >= "0" && ch <= "9");
          this.cursor--;
          token.value = this.sandbox.parseInt(input.substring(token.start, this.cursor));
        } else {
          this.cursor--;
          this.lexExponent();
          token.value = 0;
        }
      },
      lexNumber: function(ch) {
        var token = this.token, input = this.source;
        token.type = tk.NUMBER;
        var floating = false;
        do {
          ch = input[this.cursor++];
          if (ch === "." && !floating) {
            floating = true;
            ch = input[this.cursor++];
          }
        } while (ch >= "0" && ch <= "9");
        this.cursor--;
        var exponent = this.lexExponent();
        floating = floating || exponent;
        var str = input.substring(token.start, this.cursor);
        token.value = floating ? this.sandbox.parseFloat(str) : this.sandbox.parseInt(str);
      },
      lexDot: function(ch) {
        var token = this.token, input = this.source;
        var next = input[this.cursor];
        if (next >= "0" && next <= "9") {
          do {
            ch = input[this.cursor++];
          } while (ch >= "0" && ch <= "9");
          this.cursor--;
          this.lexExponent();
          token.type = tk.NUMBER;
          token.value = this.sandbox.parseFloat(input.substring(token.start, this.cursor));
        } else {
          token.type = tk.DOT;
          token.assignOp = null;
          token.value = ".";
        }
      },
      lexString: function(ch) {
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
          if (ch === "\\") {
            hasEscapes = true;
            if (this.cursor + 1 < input.length) {
              if (input[this.cursor] === "\r" && input[this.cursor + 1] === "\n") {
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
          token.value = this.sandbox.eval('"use strict"; ' + input.substring(token.start, this.cursor));
        } else {
          token.value = this.sandbox.eval(input.substring(token.start, this.cursor));
        }
      },
      lexRegExp: function(ch) {
        var token = this.token, input = this.source;
        token.type = tk.REGEXP;
        do {
          ch = input[this.cursor++];
          if (ch === "\\") {
            this.cursor++;
          } else if (ch === "[") {
            do {
              if (ch === undefined) throw this.newSyntaxError("Unterminated character class");
              if (ch === "\\") this.cursor++;
              ch = input[this.cursor++];
            } while (ch !== "]");
          } else if (ch === undefined) {
            throw this.newSyntaxError("Unterminated regex");
          }
        } while (ch !== "/");
        do {
          ch = input[this.cursor++];
        } while (ch >= "a" && ch <= "z");
        this.cursor--;
        token.value = this.sandbox.eval(input.substring(token.start, this.cursor));
      },
      lexOp: function(ch) {
        var token = this.token, input = this.source;
        var node = opTokens[ch];
        var next = input[this.cursor];
        if (node.hasOwnProperty(next)) {
          node = node[next];
          this.cursor++;
          next = input[this.cursor];
          if (node.hasOwnProperty(next)) {
            node = node[next];
            this.cursor++;
            next = input[this.cursor];
          }
        }
        var op = node.op;
        if (Definitions.assignOps[op] && input[this.cursor] === "=") {
          this.cursor++;
          token.type = tk.ASSIGN;
          token.assignOp = Definitions.tokenIds[Definitions.opTypeNames[op]];
          op += "=";
        } else {
          token.type = Definitions.tokenIds[Definitions.opTypeNames[op]];
          token.assignOp = null;
        }
        token.value = op;
      },
      lexIdent: function(ch, keywordIsName) {
        var token = this.token;
        var id = ch;
        while ((ch = this.getValidIdentifierChar(false)) !== null) {
          id += ch;
        }
        token.type = tk.IDENTIFIER;
        token.value = id;
        if (keywordIsName) {
          return;
        }
        if (this.parser.x.strictMode) {
          if (Definitions.strictKeywords.hasOwnProperty(id)) {
            token.type = Definitions.strictKeywords[id];
            return;
          }
        }
        if (Definitions.keywords.hasOwnProperty(id)) {
          token.type = Definitions.keywords[id];
        }
      },
      get: function(scanOperand, keywordIsName) {
        var token;
        while (this.lookahead) {
          var newTokenIndex = this.tokenIndex + 1 & 3;
          token = this.tokens[newTokenIndex];
          if (scanOperand && token.value === "/") {
            this.discardLookahead();
            break;
          }
          this.lookahead--;
          this.tokenIndex = newTokenIndex;
          if (token.type !== tk.NEWLINE || this.scanNewlines) {
            if (keywordIsName && Definitions.keywords.hasOwnProperty(token.value)) {
              return tk.IDENTIFIER;
            }
            return token.type;
          }
        }
        this.skip();
        this.tokenIndex = this.tokenIndex + 1 & 3;
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
        var ch = ich === null ? input[this.cursor++] : null;
        if (ich !== null) {
          this.lexIdent(ich, keywordIsName);
        } else if (scanOperand && ch === "/") {
          this.lexRegExp(ch);
        } else if (opTokens.hasOwnProperty(ch)) {
          this.lexOp(ch);
        } else if (ch === ".") {
          this.lexDot(ch);
        } else if (ch >= "1" && ch <= "9") {
          this.lexNumber(ch);
        } else if (ch === "0") {
          this.lexZeroNumber(ch);
        } else if (ch === '"' || ch === "'") {
          this.lexString(ch);
        } else if (this.scanNewlines && Definitions.newlines.hasOwnProperty(ch)) {
          if (ch === "\r" && input[this.cursor] === "\n") this.cursor++;
          token.type = tk.NEWLINE;
          token.value = "\n";
          this.lineno++;
        } else {
          throw this.newSyntaxError("Illegal token");
        }
        token.end = this.cursor;
        return token.type;
      },
      unget: function() {
        if (++this.lookahead === 4) throw "PANIC: too much lookahead!";
        this.tokenIndex = this.tokenIndex - 1 & 3;
      },
      discardLookahead: function() {
        while (this.lookahead) {
          --this.lookahead;
          this.tokenIndex = this.tokenIndex + 1 & 3;
          var token = this.tokens[this.tokenIndex];
          this.cursor = token.start;
        }
      },
      newError: function(errorClass, m) {
        m = "[" + (this.filename ? this.filename + ":" : "") + this.lineno + "] " + m;
        var e = new errorClass(m, this.filename, this.lineno);
        e.source = this.source;
        e.sourceLine = this.lineno;
        e.cursor = this.lookahead ? this.tokens[this.tokenIndex + this.lookahead & 3].start : this.cursor;
        return e;
      },
      newSyntaxError: function(m) {
        return this.newError(SyntaxError, m);
      },
      newReferenceError: function(m) {
        return this.newError(ReferenceError, m);
      },
      getValidIdentifierChar: function(first) {
        var input = this.source;
        if (this.cursor >= input.length) return null;
        var ch = input[this.cursor];
        var chInc = 1;
        if (ch === "\\" && input[this.cursor + 1] === "u") {
          try {
            ch = String.fromCharCode(parseInt(input.substring(this.cursor + 2, this.cursor + 6), 16));
          } catch (ex) {
            return null;
          }
          chInc = 6;
        }
        var valid = isValidIdentifierChar(ch, first);
        if (valid) {
          this.cursor += chInc;
        }
        return valid ? ch : null;
      }
    };
    var exports = {};
    exports.isIdentifier = isIdentifier;
    exports.Tokenizer = Tokenizer;
    return exports;
  }();
  Tailspin.Parser = function() {
    "use strict";
    var Tokenizer = Tailspin.Lexer.Tokenizer;
    var Definitions = Tailspin.Definitions;
    var Dict = Tailspin.Utility.Dict;
    var Stack = Tailspin.Utility.Stack;
    function pushDestructuringVarDecls(n, s) {
      for (var i in n) {
        var sub = n[i];
        if (sub.type === IDENTIFIER) {
          s.varDecls.push(sub);
        } else {
          pushDestructuringVarDecls(sub, s);
        }
      }
    }
    function Parser(tokenizer) {
      tokenizer.parser = this;
      this.t = tokenizer;
      this.x = null;
      this.unexpectedEOF = false;
    }
    function StaticContext(parentScript, parentBlock, inFunction, strictMode) {
      this.parentScript = parentScript;
      this.parentBlock = parentBlock || parentScript;
      this.inFunction = inFunction || null;
      this.inForLoopInit = false;
      this.topLevel = true;
      this.allLabels = new Stack();
      this.currentLabels = new Stack();
      this.labeledTargets = new Stack();
      this.defaultLoopTarget = null;
      this.defaultTarget = null;
      this.strictMode = strictMode;
      this.pragmas = [];
    }
    StaticContext.prototype = {
      update: function(ext) {
        var desc = {};
        for (var key in ext) {
          desc[key] = {
            value: ext[key],
            writable: true,
            enumerable: true,
            configurable: true
          };
        }
        return Object.create(this, desc);
      },
      pushLabel: function(label) {
        return this.update({
          currentLabels: this.currentLabels.push(label),
          allLabels: this.allLabels.push(label)
        });
      },
      pushTarget: function(target) {
        var isDefaultLoopTarget = target.isLoop;
        var isDefaultTarget = isDefaultLoopTarget || target.type === SWITCH;
        if (this.currentLabels.isEmpty()) {
          if (isDefaultLoopTarget) this.update({
            defaultLoopTarget: target
          });
          if (isDefaultTarget) this.update({
            defaultTarget: target
          });
          return this;
        }
        target.labels = new Dict();
        this.currentLabels.forEach(function(label) {
          target.labels.set(label, true);
        });
        return this.update({
          currentLabels: new Stack(),
          labeledTargets: this.labeledTargets.push(target),
          defaultLoopTarget: isDefaultLoopTarget ? target : this.defaultLoopTarget,
          defaultTarget: isDefaultTarget ? target : this.defaultTarget
        });
      },
      nest: function() {
        return this.topLevel ? this.update({
          topLevel: false
        }) : this;
      },
      banWith: function() {
        return this.strictMode;
      }
    };
    var Pp = Parser.prototype;
    Pp.withContext = function(x, f) {
      var x0 = this.x;
      this.x = x;
      var result = f.call(this);
      this.x = x0;
      return result;
    };
    Pp.newNode = function newNode(opts) {
      return new Node(this.t, opts);
    };
    Pp.fail = function fail(msg) {
      throw this.t.newSyntaxError(msg);
    };
    Pp.checkValidIdentifierIfStrict = function fail(type, value) {
      if (this.x.strictMode && (value === "eval" || value === "arguments")) {
        this.fail("Cannot declare a " + type + " named '" + value + "' in strict mode.");
      }
    };
    Pp.match = function match(tt, scanOperand, keywordIsName) {
      return this.t.match(tt, scanOperand, keywordIsName);
    };
    Pp.mustMatch = function mustMatch(tt, keywordIsName) {
      return this.t.mustMatch(tt, keywordIsName);
    };
    Pp.peek = function peek(scanOperand, keywordIsName) {
      return this.t.peek(scanOperand, keywordIsName);
    };
    Pp.peekOnSameLine = function peekOnSameLine(scanOperand) {
      return this.t.peekOnSameLine(scanOperand);
    };
    Pp.done = function done() {
      return this.t.done;
    };
    Pp.Script = function Script(inFunction, expectEnd, strict) {
      var node = this.newNode(scriptInit());
      var x2 = new StaticContext(node, node, inFunction, strict);
      this.withContext(x2, function() {
        this.Statements(node, true);
      });
      if (expectEnd && !this.done()) this.fail("expected end of input");
      return node;
    };
    function Pragma(n) {
      if (n.type === SEMICOLON) {
        var e = n.expression;
        if (e && e.type === STRING) {
          if (e.value === "use strict" && e.end - e.start === "use strict".length + 2) {
            n.pragma = "strict";
          }
          return true;
        }
      }
      return false;
    }
    function Node(t, init) {
      var token = t.token;
      if (token) {
        this.type = token.type;
        this.value = token.value;
        this.lineno = token.lineno;
        this.start = token.start;
        this.end = token.end;
      } else {
        this.lineno = t.lineno;
      }
      this.filename = t.filename;
      this.children = [];
      for (var prop in init) this[prop] = init[prop];
    }
    function SyntheticNode(init) {
      this.children = [];
      for (var prop in init) this[prop] = init[prop];
      this.synthetic = true;
    }
    var Np = Node.prototype = SyntheticNode.prototype = {};
    Np.constructor = Node;
    var TO_SOURCE_SKIP = {
      type: true,
      value: true,
      lineno: true,
      start: true,
      end: true,
      tokenizer: true,
      assignOp: true
    };
    function unevalableConst(code) {
      var token = Definitions.tokens[code];
      var constName = Definitions.opTypeNames.hasOwnProperty(token) ? Definitions.opTypeNames[token] : Definitions.keywords.hasOwnProperty(token) ? token.toUpperCase() : token;
      return {
        toSource: function() {
          return constName;
        }
      };
    }
    Np.toSource = function toSource() {
      var mock = {};
      var self = this;
      mock.type = unevalableConst(this.type);
      if (this.generatingSource) return mock.toSource();
      this.generatingSource = true;
      if ("value" in this) mock.value = this.value;
      if ("lineno" in this) mock.lineno = this.lineno;
      if ("start" in this) mock.start = this.start;
      if ("end" in this) mock.end = this.end;
      if (this.assignOp) mock.assignOp = unevalableConst(this.assignOp);
      for (var key in this) {
        if (this.hasOwnProperty(key) && !(key in TO_SOURCE_SKIP)) mock[key] = this[key];
      }
      try {
        return mock.toSource();
      } finally {
        delete this.generatingSource;
      }
    };
    Np.push = function(kid) {
      if (kid !== null) {
        if (kid.start < this.start) this.start = kid.start;
        if (this.end < kid.end) this.end = kid.end;
      }
      return this.children.push(kid);
    };
    Node.indentLevel = 0;
    function tokenString(tt) {
      var t = Definitions.tokens[tt];
      return /^\W/.test(t) ? Definitions.opTypeNames[t] : t.toUpperCase();
    }
    Np.toString = function() {
      var a = [];
      for (var i in this) {
        if (this.hasOwnProperty(i) && i !== "type" && i !== "target") a.push({
          id: i,
          value: this[i]
        });
      }
      a.sort(function(a, b) {
        return a.id < b.id ? -1 : 1;
      });
      var INDENTATION = "    ";
      var n = ++Node.indentLevel;
      var s = "{\n" + repeatString(INDENTATION, n) + "type: " + tokenString(this.type);
      for (i = 0; i < a.length; i++) s += ",\n" + repeatString(INDENTATION, n) + a[i].id + ": " + a[i].value;
      n = --Node.indentLevel;
      s += "\n" + repeatString(INDENTATION, n) + "}";
      return s;
    };
    Np.synth = function(init) {
      var node = new SyntheticNode(init);
      node.filename = this.filename;
      node.lineno = this.lineno;
      node.start = this.start;
      node.end = this.end;
      return node;
    };
    var LOOP_INIT = {
      isLoop: true
    };
    function blockInit() {
      return {
        type: BLOCK,
        varDecls: []
      };
    }
    function scriptInit() {
      return {
        type: SCRIPT,
        funDecls: [],
        varDecls: [],
        modDefns: new Dict(),
        modAssns: new Dict(),
        modDecls: new Dict(),
        modLoads: new Dict(),
        impDecls: [],
        expDecls: [],
        hasEmptyReturn: false,
        hasReturnWithValue: false
      };
    }
    function repeatString(str, n) {
      var s = "", t = str + s;
      while (--n >= 0) {
        s += t;
      }
      return s;
    }
    Pp.MaybeLeftParen = function MaybeLeftParen() {
      return this.mustMatch(LEFT_PAREN).type;
    };
    Pp.MaybeRightParen = function MaybeRightParen(p) {
      if (p === LEFT_PAREN) this.mustMatch(RIGHT_PAREN);
    };
    Pp.checkContextForStrict = function() {
      for (var i = 0, c = this.x.pragmas.length; i < c; i++) {
        var p = this.x.pragmas[i];
        eval('"use strict"; ' + this.t.source.substring(p.start, p.end));
      }
      if (this.x.inFunction) {
        this.checkValidIdentifierIfStrict("function", this.x.inFunction.name);
        var params = this.x.inFunction.params;
        for (var i = 0, c = params.length; i < c; i++) {
          this.checkValidIdentifierIfStrict("parameter", params[i]);
          if (params.indexOf(params[i]) !== i) {
            this.fail("Cannot declare a parameter named '" + params[i] + "' more than once in strict mode");
          }
        }
      }
    };
    Pp.Statements = function Statements(n, topLevel) {
      var prologue = !!topLevel;
      try {
        if (this.x.strictMode) {
          n.strict = true;
        }
        while (!this.done() && this.peek(true) !== RIGHT_CURLY) {
          var n2 = this.Statement();
          n.push(n2);
          if (prologue && Pragma(n2)) {
            if (n2.pragma === "strict") {
              this.x.strictMode = true;
              n.strict = true;
              this.checkContextForStrict();
            }
            this.x.pragmas.push(n2);
          } else {
            prologue = false;
          }
        }
      } catch (e) {
        if (this.done()) this.unexpectedEOF = true;
        throw e;
      }
    };
    Pp.Block = function Block() {
      this.mustMatch(LEFT_CURLY);
      var n = this.newNode(blockInit());
      var x2 = this.x.update({
        parentBlock: n
      }).pushTarget(n);
      this.withContext(x2, function() {
        this.Statements(n);
      });
      this.mustMatch(RIGHT_CURLY);
      return n;
    };
    var DECLARED_FORM = 0, EXPRESSED_FORM = 1, STATEMENT_FORM = 2;
    Pp.Statement = function Statement() {
      var i, label, n, n2, p, c, ss, tt = this.t.get(true), tt2, x0, x2, x3;
      var comments = this.t.blockComments;
      switch (tt) {
       case FUNCTION:
        return this.FunctionDefinition(true, this.x.topLevel ? DECLARED_FORM : STATEMENT_FORM, comments);

       case LEFT_CURLY:
        n = this.newNode(blockInit());
        x2 = this.x.update({
          parentBlock: n
        }).pushTarget(n).nest();
        this.withContext(x2, function() {
          this.Statements(n);
        });
        this.mustMatch(RIGHT_CURLY);
        return n;

       case IF:
        n = this.newNode();
        n.condition = this.HeadExpression();
        x2 = this.x.pushTarget(n).nest();
        this.withContext(x2, function() {
          n.thenPart = this.Statement();
          n.elsePart = this.match(ELSE, true) ? this.Statement() : null;
        });
        return n;

       case SWITCH:
        n = this.newNode({
          cases: [],
          defaultIndex: -1
        });
        n.discriminant = this.HeadExpression();
        x2 = this.x.pushTarget(n).nest();
        this.withContext(x2, function() {
          this.mustMatch(LEFT_CURLY);
          while ((tt = this.t.get()) !== RIGHT_CURLY) {
            switch (tt) {
             case DEFAULT:
              if (n.defaultIndex >= 0) this.fail("More than one switch default");

             case CASE:
              n2 = this.newNode();
              if (tt === DEFAULT) n.defaultIndex = n.cases.length; else n2.caseLabel = this.Expression(COLON);
              break;

             default:
              this.fail("Invalid switch case");
            }
            this.mustMatch(COLON);
            n2.statements = this.newNode(blockInit());
            while ((tt = this.peek(true)) !== CASE && tt !== DEFAULT && tt !== RIGHT_CURLY) n2.statements.push(this.Statement());
            n.cases.push(n2);
          }
        });
        return n;

       case FOR:
        n = this.newNode(LOOP_INIT);
        n.blockComments = comments;
        this.mustMatch(LEFT_PAREN);
        x2 = this.x.pushTarget(n).nest();
        x3 = this.x.update({
          inForLoopInit: true
        });
        n2 = null;
        if ((tt = this.peek(true)) !== SEMICOLON) {
          this.withContext(x3, function() {
            if (tt === VAR || tt === CONST) {
              this.t.get();
              n2 = this.Variables();
            } else {
              n2 = this.Expression();
            }
          });
        }
        if (n2 && this.match(IN)) {
          n.type = FOR_IN;
          this.withContext(x3, function() {
            n.object = this.Expression();
            if (n2.type === VAR) {
              c = n2.children;
              if (c.length !== 1 && n2.destructurings.length !== 1) {
                this.fail("Invalid for..in left-hand side", this.filename, n2.lineno);
              }
              if (n2.destructurings.length > 0) {
                n.iterator = n2.destructurings[0];
              } else {
                n.iterator = c[0];
              }
              n.varDecl = n2;
            } else {
              if (n2.type === ARRAY_INIT || n2.type === OBJECT_INIT) {
                n2.destructuredNames = this.checkDestructuring(n2);
              }
              n.iterator = n2;
            }
          });
        } else {
          x3.inForLoopInit = false;
          n.setup = n2;
          this.mustMatch(SEMICOLON);
          this.withContext(x3, function() {
            n.condition = this.peek(true) === SEMICOLON ? null : this.Expression();
            this.mustMatch(SEMICOLON);
            tt2 = this.peek(true);
            n.update = tt2 === RIGHT_PAREN ? null : this.Expression();
          });
        }
        this.mustMatch(RIGHT_PAREN);
        this.withContext(x2, function() {
          n.body = this.Statement();
        });
        return n;

       case WHILE:
        n = this.newNode({
          isLoop: true
        });
        n.blockComments = comments;
        n.condition = this.HeadExpression();
        x2 = this.x.pushTarget(n).nest();
        this.withContext(x2, function() {
          n.body = this.Statement();
        });
        return n;

       case DO:
        n = this.newNode({
          isLoop: true
        });
        n.blockComments = comments;
        x2 = this.x.pushTarget(n).nest();
        this.withContext(x2, function() {
          n.body = this.Statement();
        });
        this.mustMatch(WHILE);
        n.condition = this.HeadExpression();
        this.match(SEMICOLON);
        return n;

       case BREAK:
       case CONTINUE:
        n = this.newNode();
        n.blockComments = comments;
        x2 = this.x.pushTarget(n);
        if (this.peekOnSameLine() === IDENTIFIER) {
          this.t.get();
          n.label = this.t.token.value;
        }
        if (n.label) {
          n.target = x2.labeledTargets.find(function(target) {
            return target.labels.has(n.label);
          });
        } else if (tt === CONTINUE) {
          n.target = x2.defaultLoopTarget;
        } else {
          n.target = x2.defaultTarget;
        }
        if (!n.target) this.fail("Invalid " + (tt === BREAK ? "break" : "continue"));
        if (!n.target.isLoop && tt === CONTINUE) this.fail("Invalid continue");
        break;

       case TRY:
        n = this.newNode({
          catchClauses: []
        });
        n.blockComments = comments;
        n.tryBlock = this.Block();
        while (this.match(CATCH)) {
          n2 = this.newNode();
          this.mustMatch(LEFT_PAREN);
          switch (this.t.get()) {
           case LEFT_BRACKET:
           case LEFT_CURLY:
            this.t.unget();
            n2.varName = this.DestructuringExpression(true);
            break;

           case IDENTIFIER:
            n2.varName = this.t.token.value;
            this.checkValidIdentifierIfStrict("parameter", this.t.token.value);
            break;

           default:
            this.fail("missing identifier in catch");
            break;
          }
          this.mustMatch(RIGHT_PAREN);
          n2.block = this.Block();
          n.catchClauses.push(n2);
        }
        if (this.match(FINALLY)) n.finallyBlock = this.Block();
        if (!n.catchClauses.length && !n.finallyBlock) this.fail("Invalid try statement");
        return n;

       case CATCH:
       case FINALLY:
        this.fail(Definitions.tokens[tt] + " without preceding try");

       case THROW:
        n = this.newNode();
        n.exception = this.Expression();
        break;

       case RETURN:
        n = this.Return();
        break;

       case WITH:
        if (this.x.banWith()) {
          this.fail("with statements not allowed in strict code");
        }
        n = this.newNode();
        n.blockComments = comments;
        n.object = this.HeadExpression();
        x2 = this.x.pushTarget(n).nest();
        this.withContext(x2, function() {
          n.body = this.Statement();
        });
        return n;

       case VAR:
       case CONST:
        n = this.Variables();
        break;

       case DEBUGGER:
        n = this.newNode();
        break;

       case NEWLINE:
       case SEMICOLON:
        n = this.newNode({
          type: SEMICOLON
        });
        n.blockComments = comments;
        n.expression = null;
        return n;

       case IDENTIFIER:
        tt = this.peek();
        if (tt === COLON) {
          label = this.t.token.value;
          if (this.x.allLabels.has(label)) this.fail("Duplicate label: " + label);
          this.t.get();
          n = this.newNode({
            type: LABEL,
            label: label
          });
          n.blockComments = comments;
          x2 = this.x.pushLabel(label).nest();
          this.withContext(x2, function() {
            n.statement = this.Statement();
          });
          n.target = n.statement.type === LABEL ? n.statement.target : n.statement;
          return n;
        }

       default:
        n = this.newNode({
          type: SEMICOLON
        });
        this.t.unget();
        n.blockComments = comments;
        n.expression = this.Expression();
        n.end = n.expression.end;
        break;
      }
      n.blockComments = comments;
      this.MagicalSemicolon();
      return n;
    };
    function isPragmaToken(tt) {
      switch (tt) {
       case IDENTIFIER:
       case STRING:
       case NUMBER:
       case NULL:
       case TRUE:
       case FALSE:
        return true;
      }
      return false;
    }
    Pp.Pragmas = function Pragmas() {
      var pragmas = [];
      do {
        pragmas.push(this.Pragma());
      } while (this.match(COMMA));
      this.MagicalSemicolon();
      return pragmas;
    };
    Pp.Pragma = function Pragma() {
      var items = [];
      var tt;
      do {
        tt = this.t.get(true);
        items.push(this.t.token);
      } while (isPragmaToken(this.peek()));
      return items;
    };
    Pp.MagicalSemicolon = function MagicalSemicolon() {
      var tt;
      if (this.t.lineno === this.t.token.lineno) {
        tt = this.peekOnSameLine();
        if (tt !== END && tt !== NEWLINE && tt !== SEMICOLON && tt !== RIGHT_CURLY) this.fail("missing ; before statement");
      }
      this.match(SEMICOLON);
    };
    Pp.Return = function Return() {
      var parentScript = this.x.parentScript;
      if (!this.x.inFunction) {
        this.fail("Return not in function");
      }
      var n = this.newNode({
        value: undefined
      });
      var tt2 = this.peekOnSameLine(true);
      if (tt2 !== END && tt2 !== NEWLINE && tt2 !== SEMICOLON && tt2 !== RIGHT_CURLY) {
        n.value = this.Expression();
        parentScript.hasReturnWithValue = true;
      } else {
        parentScript.hasEmptyReturn = true;
      }
      return n;
    };
    Pp.ExplicitSpecifierSet = function ExplicitSpecifierSet(SpecifierRHS) {
      var n, n2, id, tt;
      n = this.newNode({
        type: OBJECT_INIT
      });
      this.mustMatch(LEFT_CURLY);
      if (!this.match(RIGHT_CURLY)) {
        do {
          id = this.Identifier();
          if (this.match(COLON)) {
            n2 = this.newNode({
              type: PROPERTY_INIT
            });
            n2.push(id);
            n2.push(SpecifierRHS());
            n.push(n2);
          } else {
            n.push(id);
          }
        } while (!this.match(RIGHT_CURLY) && this.mustMatch(COMMA));
      }
      return n;
    };
    Pp.Identifier = function Identifier() {
      this.mustMatch(IDENTIFIER);
      return this.newNode({
        type: IDENTIFIER
      });
    };
    Pp.IdentifierName = function IdentifierName() {
      this.mustMatch(IDENTIFIER, true);
      return this.newNode({
        type: IDENTIFIER
      });
    };
    Pp.QualifiedPath = function QualifiedPath() {
      var n, n2;
      n = this.Identifier();
      while (this.match(DOT)) {
        if (this.peek() !== IDENTIFIER) {
          this.t.unget();
          break;
        }
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.Identifier());
        n = n2;
      }
      return n;
    };
    Pp.FunctionDefinition = function FunctionDefinition(requireName, functionForm, comments, keywordIsName) {
      var tt;
      var f = this.newNode({
        params: [],
        paramComments: []
      });
      if (typeof comments === "undefined") comments = null;
      f.blockComments = comments;
      if (f.type !== FUNCTION) f.type = f.value === "get" ? GETTER : SETTER;
      if (this.match(IDENTIFIER, false, keywordIsName)) {
        f.name = this.t.token.value;
        this.checkValidIdentifierIfStrict("function", f.name);
      } else if (requireName) this.fail("missing function identifier");
      var x2 = new StaticContext(null, null, f, this.x.strictMode);
      this.withContext(x2, function() {
        this.mustMatch(LEFT_PAREN);
        if (!this.match(RIGHT_PAREN)) {
          do {
            tt = this.t.get();
            f.paramComments.push(this.t.lastBlockComment());
            switch (tt) {
             case LEFT_BRACKET:
             case LEFT_CURLY:
              this.t.unget();
              f.params.push(this.DestructuringExpression());
              break;

             case IDENTIFIER:
              if (this.x.strictMode) {
                this.checkValidIdentifierIfStrict("parameter", this.t.token.value);
                if (f.params.indexOf(this.t.token.value) !== -1) {
                  this.fail("Cannot declare a parameter named '" + this.t.token.value + "' more than once in strict mode");
                }
              }
              f.params.push(this.t.token.value);
              break;

             default:
              this.fail("missing formal parameter");
            }
          } while (this.match(COMMA));
          this.mustMatch(RIGHT_PAREN);
        }
        tt = this.t.get(true);
        if (tt !== LEFT_CURLY) this.t.unget();
        if (tt !== LEFT_CURLY) {
          f.body = this.AssignExpression();
        } else {
          f.body = this.Script(f, false, x2.strictMode);
        }
      });
      if (tt === LEFT_CURLY) this.mustMatch(RIGHT_CURLY);
      f.end = this.t.token.end;
      f.functionForm = functionForm;
      if (functionForm === DECLARED_FORM) this.x.parentScript.funDecls.push(f);
      return f;
    };
    Pp.Variables = function Variables() {
      var n, n2, ss, i, s, tt;
      tt = this.t.token.type;
      switch (tt) {
       case VAR:
       case CONST:
        s = this.x.parentScript;
        break;
      }
      n = this.newNode({
        type: tt,
        destructurings: []
      });
      do {
        tt = this.t.get();
        if (tt === LEFT_BRACKET || tt === LEFT_CURLY) {
          this.t.unget();
          var dexp = this.DestructuringExpression(true);
          n2 = this.newNode({
            type: IDENTIFIER,
            name: dexp,
            readOnly: n.type === CONST
          });
          n.push(n2);
          pushDestructuringVarDecls(n2.name.destructuredNames, s);
          n.destructurings.push({
            exp: dexp,
            decl: n2
          });
          if (this.x.inForLoopInit && this.peek() === IN) {
            continue;
          }
          this.mustMatch(ASSIGN);
          if (this.t.token.assignOp) this.fail("Invalid variable initialization");
          n2.blockComment = this.t.lastBlockComment();
          n2.initializer = this.AssignExpression();
          continue;
        }
        if (tt !== IDENTIFIER) this.fail("missing variable name");
        this.checkValidIdentifierIfStrict("variable", this.t.token.value);
        n2 = this.newNode({
          type: IDENTIFIER,
          name: this.t.token.value,
          readOnly: n.type === CONST
        });
        n.push(n2);
        s.varDecls.push(n2);
        if (this.match(ASSIGN)) {
          var comment = this.t.lastBlockComment();
          if (this.t.token.assignOp) this.fail("Invalid variable initialization");
          n2.initializer = this.AssignExpression();
        } else {
          var comment = this.t.lastBlockComment();
        }
        n2.blockComment = comment;
      } while (this.match(COMMA));
      return n;
    };
    Pp.checkDestructuring = function checkDestructuring(n, simpleNamesOnly) {
      if (n.type === ARRAY_COMP) this.fail("Invalid array comprehension left-hand side");
      if (n.type !== ARRAY_INIT && n.type !== OBJECT_INIT) return;
      var lhss = {};
      var nn, n2, idx, sub, cc, c = n.children;
      for (var i = 0, j = c.length; i < j; i++) {
        if (!(nn = c[i])) continue;
        if (nn.type === PROPERTY_INIT) {
          cc = nn.children;
          sub = cc[1];
          idx = cc[0].value;
        } else if (n.type === OBJECT_INIT) {
          sub = nn;
          idx = nn.value;
        } else {
          sub = nn;
          idx = i;
        }
        if (sub.type === ARRAY_INIT || sub.type === OBJECT_INIT) {
          lhss[idx] = this.checkDestructuring(sub, simpleNamesOnly);
        } else {
          if (simpleNamesOnly && sub.type !== IDENTIFIER) {
            this.fail("missing name in pattern");
          }
          lhss[idx] = sub;
        }
      }
      return lhss;
    };
    Pp.DestructuringExpression = function DestructuringExpression(simpleNamesOnly) {
      var n = this.PrimaryExpression();
      n.destructuredNames = this.checkDestructuring(n, simpleNamesOnly);
      return n;
    };
    Pp.ComprehensionTail = function ComprehensionTail() {
      var body, n, n2, n3;
      body = this.newNode({
        type: COMP_TAIL
      });
      do {
        n = this.newNode({
          type: FOR_IN,
          isLoop: true
        });
        this.mustMatch(LEFT_PAREN);
        switch (this.t.get()) {
         case LEFT_BRACKET:
         case LEFT_CURLY:
          this.t.unget();
          n.iterator = this.DestructuringExpression();
          break;

         case IDENTIFIER:
          n.iterator = n3 = this.newNode({
            type: IDENTIFIER
          });
          n3.name = n3.value;
          n.varDecl = n2 = this.newNode({
            type: VAR
          });
          n2.push(n3);
          this.x.parentScript.varDecls.push(n3);
          break;

         default:
          this.fail("missing identifier");
        }
        this.mustMatch(IN);
        n.object = this.Expression();
        this.mustMatch(RIGHT_PAREN);
        body.push(n);
      } while (this.match(FOR));
      if (this.match(IF)) body.guard = this.HeadExpression();
      return body;
    };
    Pp.HeadExpression = function HeadExpression() {
      this.mustMatch(LEFT_PAREN);
      var n = this.ParenExpression();
      this.mustMatch(RIGHT_PAREN);
      return n;
    };
    Pp.ParenExpression = function ParenExpression() {
      var x2 = this.x.update({
        inForLoopInit: this.x.inForLoopInit && this.t.token.type === LEFT_PAREN
      });
      var n = this.withContext(x2, function() {
        return this.Expression();
      });
      return n;
    };
    Pp.Expression = function Expression() {
      var n, n2;
      n = this.AssignExpression();
      if (this.match(COMMA)) {
        n2 = this.newNode({
          type: COMMA
        });
        n2.push(n);
        n = n2;
        do {
          n2 = n.children[n.children.length - 1];
          n.push(this.AssignExpression());
        } while (this.match(COMMA));
      }
      return n;
    };
    Pp.AssignExpression = function AssignExpression() {
      var n, lhs;
      lhs = this.ConditionalExpression();
      if (!this.match(ASSIGN)) {
        return lhs;
      }
      n = this.newNode({
        type: ASSIGN
      });
      n.blockComment = this.t.lastBlockComment();
      switch (lhs.type) {
       case OBJECT_INIT:
       case ARRAY_INIT:
        lhs.destructuredNames = this.checkDestructuring(lhs);

       case IDENTIFIER:
        this.checkValidIdentifierIfStrict("variable", lhs.value);
        break;

       case DOT:
       case INDEX:
       case CALL:
        break;

       case NUMBER:
       case STRING:
       case TRUE:
       case FALSE:
       case NULL:
        throw this.t.newReferenceError("Bad left-hand side of assignment");
        break;

       default:
        this.fail("Bad left-hand side of assignment");
        break;
      }
      n.assignOp = lhs.assignOp = this.t.token.assignOp;
      n.push(lhs);
      n.push(this.AssignExpression());
      return n;
    };
    Pp.ConditionalExpression = function ConditionalExpression() {
      var n, n2;
      n = this.OrExpression();
      if (this.match(HOOK)) {
        n2 = n;
        n = this.newNode({
          type: HOOK
        });
        n.push(n2);
        var x2 = this.x.update({
          inForLoopInit: false
        });
        this.withContext(x2, function() {
          n.push(this.AssignExpression());
        });
        if (!this.match(COLON)) this.fail("missing : after ?");
        n.push(this.AssignExpression());
      }
      return n;
    };
    Pp.OrExpression = function OrExpression() {
      var n, n2;
      n = this.AndExpression();
      while (this.match(OR)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.AndExpression());
        n = n2;
      }
      return n;
    };
    Pp.AndExpression = function AndExpression() {
      var n, n2;
      n = this.BitwiseOrExpression();
      while (this.match(AND)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.BitwiseOrExpression());
        n = n2;
      }
      return n;
    };
    Pp.BitwiseOrExpression = function BitwiseOrExpression() {
      var n, n2;
      n = this.BitwiseXorExpression();
      while (this.match(BITWISE_OR)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.BitwiseXorExpression());
        n = n2;
      }
      return n;
    };
    Pp.BitwiseXorExpression = function BitwiseXorExpression() {
      var n, n2;
      n = this.BitwiseAndExpression();
      while (this.match(BITWISE_XOR)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.BitwiseAndExpression());
        n = n2;
      }
      return n;
    };
    Pp.BitwiseAndExpression = function BitwiseAndExpression() {
      var n, n2;
      n = this.EqualityExpression();
      while (this.match(BITWISE_AND)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.EqualityExpression());
        n = n2;
      }
      return n;
    };
    Pp.EqualityExpression = function EqualityExpression() {
      var n, n2;
      n = this.RelationalExpression();
      while (this.match(EQ) || this.match(NE) || this.match(STRICT_EQ) || this.match(STRICT_NE)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.RelationalExpression());
        n = n2;
      }
      return n;
    };
    Pp.RelationalExpression = function RelationalExpression() {
      var n, n2;
      n = this.ShiftExpression();
      while (this.match(LT) || this.match(LE) || this.match(GE) || this.match(GT) || !this.x.inForLoopInit && this.match(IN) || this.match(INSTANCEOF)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.ShiftExpression());
        n = n2;
      }
      return n;
    };
    Pp.ShiftExpression = function ShiftExpression() {
      var n, n2;
      var x2 = this.x.update({
        inForLoopInit: false
      });
      this.withContext(x2, function() {
        n = this.AddExpression();
        while (this.match(LSH) || this.match(RSH) || this.match(URSH)) {
          n2 = this.newNode();
          n2.push(n);
          n2.push(this.AddExpression());
          n = n2;
        }
      });
      return n;
    };
    Pp.AddExpression = function AddExpression() {
      var n, n2;
      n = this.MultiplyExpression();
      while (this.match(PLUS) || this.match(MINUS)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.MultiplyExpression());
        n = n2;
      }
      return n;
    };
    Pp.MultiplyExpression = function MultiplyExpression() {
      var n, n2;
      n = this.UnaryExpression();
      while (this.match(MUL) || this.match(DIV) || this.match(MOD)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.UnaryExpression());
        n = n2;
      }
      return n;
    };
    Pp.UnaryExpression = function UnaryExpression() {
      var n, n2, tt;
      switch (tt = this.t.get(true)) {
       case DELETE:
       case VOID:
       case TYPEOF:
       case NOT:
       case BITWISE_NOT:
       case PLUS:
       case MINUS:
        if (tt === PLUS) n = this.newNode({
          type: UNARY_PLUS
        }); else if (tt === MINUS) n = this.newNode({
          type: UNARY_MINUS
        }); else n = this.newNode();
        n2 = this.UnaryExpression();
        n.push(n2);
        if (tt === DELETE && this.x.strictMode && !(n2.type === DOT || n2.type === INDEX)) {
          this.fail("Cannot delete unqualified property '" + n2.value + "' in strict mode");
        }
        break;

       case INCREMENT:
       case DECREMENT:
        n = this.newNode();
        n.push(this.MemberExpression(true));
        this.checkValidIdentifierIfStrict("variable", n.children[0].value);
        break;

       default:
        this.t.unget();
        n = this.MemberExpression(true);
        if (this.t.tokens[this.t.tokenIndex + this.t.lookahead - 1 & 3].lineno === this.t.lineno) {
          if (this.match(INCREMENT) || this.match(DECREMENT)) {
            this.checkValidIdentifierIfStrict("variable", n.value);
            n2 = this.newNode({
              postfix: true
            });
            n2.push(n);
            n = n2;
          }
        }
        break;
      }
      return n;
    };
    Pp.MemberExpression = function MemberExpression(allowCallSyntax) {
      var n, n2, name, tt;
      if (this.match(NEW)) {
        n = this.newNode();
        n.push(this.MemberExpression(false));
        if (this.match(LEFT_PAREN)) {
          n.type = NEW_WITH_ARGS;
          n.push(this.ArgumentList());
        }
      } else {
        n = this.PrimaryExpression();
      }
      while ((tt = this.t.get()) !== END) {
        switch (tt) {
         case DOT:
          n2 = this.newNode();
          n2.push(n);
          n2.push(this.IdentifierName());
          break;

         case LEFT_BRACKET:
          n2 = this.newNode({
            type: INDEX
          });
          n2.push(n);
          n2.push(this.Expression());
          this.mustMatch(RIGHT_BRACKET);
          break;

         case LEFT_PAREN:
          if (allowCallSyntax) {
            n2 = this.newNode({
              type: CALL
            });
            n2.push(n);
            n2.push(this.ArgumentList());
            break;
          }

         default:
          this.t.unget();
          return n;
        }
        n = n2;
      }
      return n;
    };
    Pp.ArgumentList = function ArgumentList() {
      var n, n2;
      n = this.newNode({
        type: LIST
      });
      if (this.match(RIGHT_PAREN, true)) return n;
      do {
        n2 = this.AssignExpression();
        n.push(n2);
      } while (this.match(COMMA));
      this.mustMatch(RIGHT_PAREN);
      return n;
    };
    Pp.PrimaryExpression = function PrimaryExpression() {
      var n, n2, tt = this.t.get(true);
      switch (tt) {
       case FUNCTION:
        n = this.FunctionDefinition(false, EXPRESSED_FORM);
        break;

       case LEFT_BRACKET:
        n = this.newNode({
          type: ARRAY_INIT
        });
        while ((tt = this.peek(true)) !== RIGHT_BRACKET) {
          if (tt === COMMA) {
            this.t.get();
            n.push(null);
            continue;
          }
          n.push(this.AssignExpression());
          if (tt !== COMMA && !this.match(COMMA)) break;
        }
        if (n.children.length === 1 && this.match(FOR)) {
          n2 = this.newNode({
            type: ARRAY_COMP,
            expression: n.children[0],
            tail: this.ComprehensionTail()
          });
          n = n2;
        }
        this.mustMatch(RIGHT_BRACKET);
        break;

       case LEFT_CURLY:
        var id, fd;
        var idTypes = {};
        n = this.newNode({
          type: OBJECT_INIT
        });
        object_init: if (!this.match(RIGHT_CURLY)) {
          do {
            tt = this.t.get();
            var tokenValue = this.t.token.value;
            if ((tokenValue === "get" || tokenValue === "set") && this.peek(false, true) === IDENTIFIER) {
              var fn = this.FunctionDefinition(true, EXPRESSED_FORM, null, true);
              if (idTypes[fn.name] & 1) {
                this.fail("cannot create object with '" + fn.name + "' and '" + tokenValue + " " + fn.name + "'");
              }
              if (idTypes[fn.name] & (tokenValue === "get" ? 2 : 4)) {
                this.fail("cannot create object with multiple '" + tokenValue + " " + fn.name + "' values");
              }
              idTypes[fn.name] = (idTypes[fn.name] || 0) | (tokenValue === "get" ? 2 : 4);
              n.push(fn);
            } else {
              var comments = this.t.blockComments;
              switch (tt) {
               case IDENTIFIER:
               case NUMBER:
               case STRING:
                id = this.newNode({
                  type: IDENTIFIER
                });
                break;

               case RIGHT_CURLY:
                break object_init;

               default:
                if (Definitions.keywords.hasOwnProperty(this.t.token.value)) {
                  id = this.newNode({
                    type: IDENTIFIER
                  });
                  break;
                }
                this.fail("Invalid property name");
              }
              if (this.match(COLON)) {
                n2 = this.newNode({
                  type: PROPERTY_INIT
                });
                n2.push(id);
                n2.push(this.AssignExpression());
                n2.blockComments = comments;
                if (idTypes[id.value] & 2) {
                  this.fail("cannot create object with 'get " + id.value + "' and '" + id.value + "'");
                }
                if (idTypes[id.value] & 4) {
                  this.fail("cannot create object with 'set " + id.value + "' and '" + id.value + "'");
                }
                if (this.x.strictMode && idTypes[id.value] & 1) {
                  this.fail("cannot create object with multiple '" + id.value + "' values");
                }
                idTypes[id.value] = (idTypes[id.value] || 0) | 1;
                n.push(n2);
              } else {
                if (this.peek() !== COMMA && this.peek() !== RIGHT_CURLY) this.fail("missing : after property");
                n.push(id);
              }
            }
          } while (this.match(COMMA));
          this.mustMatch(RIGHT_CURLY);
        }
        break;

       case LEFT_PAREN:
        n = this.ParenExpression();
        this.mustMatch(RIGHT_PAREN);
        n.parenthesized = true;
        break;

       case NULL:
       case THIS:
       case TRUE:
       case FALSE:
       case IDENTIFIER:
       case NUMBER:
       case STRING:
       case REGEXP:
        n = this.newNode();
        break;

       default:
        this.fail("missing operand; found " + Definitions.tokens[tt]);
        break;
      }
      return n;
    };
    function parse(source, filename, lineno, strict, sandbox) {
      var tokenizer = new Tokenizer(source, filename, lineno, sandbox);
      var parser = new Parser(tokenizer);
      return parser.Script(null, true, strict);
    }
    function parseFunction(source, requireName, form, filename, lineno, sandbox) {
      var t = new Tokenizer(source, filename, lineno, sandbox);
      var p = new Parser(t);
      p.x = new StaticContext(null, null, null, false);
      return p.FunctionDefinition(requireName, form);
    }
    var exports = {};
    exports.parse = parse;
    exports.parseFunction = parseFunction;
    exports.Node = Node;
    exports.DECLARED_FORM = DECLARED_FORM;
    exports.EXPRESSED_FORM = EXPRESSED_FORM;
    exports.STATEMENT_FORM = STATEMENT_FORM;
    exports.Tokenizer = Tokenizer;
    exports.Parser = Parser;
    return exports;
  }();
  Tailspin.Decompiler = function() {
    "use strict";
    var tokens = Tailspin.Definitions.tokens;
    function indent(n, s) {
      var ss = "", d = true;
      for (var i = 0, j = s.length; i < j; i++) {
        if (d) for (var k = 0; k < n; k++) ss += " ";
        ss += s[i];
        d = s[i] === "\n";
      }
      return ss;
    }
    function isBlock(n) {
      return n && n.type === BLOCK;
    }
    function isNonEmptyBlock(n) {
      return isBlock(n) && n.children.length > 0;
    }
    function nodeStrEscape(str) {
      return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/</g, "\\u003C").replace(/>/g, "\\u003E");
    }
    function nodeStr(n) {
      if (/[\u0000-\u001F\u0080-\uFFFF]/.test(n.value)) {
        var str = "";
        for (var i = 0; i < n.value.length; i++) {
          var c = n.value[i];
          if (c <= "" || c >= "") {
            var cc = c.charCodeAt(0).toString(16);
            while (cc.length < 4) cc = "0" + cc;
            str += "\\u" + cc;
          } else {
            str += nodeStrEscape(c);
          }
        }
        return '"' + str + '"';
      }
      return '"' + nodeStrEscape(n.value) + '"';
    }
    function pp(n, d) {
      var topScript = false;
      if (!n) return "";
      if (!(n instanceof Object)) return n;
      if (!d) {
        topScript = true;
        d = 1;
      }
      var p = "";
      if (n.parenthesized) p += "(";
      switch (n.type) {
       case FUNCTION:
       case GETTER:
       case SETTER:
        if (n.type === FUNCTION) p += "function"; else if (n.type === GETTER) p += "get"; else p += "set";
        p += (n.name ? " " + n.name : "") + "(";
        for (var i = 0, j = n.params.length; i < j; i++) p += (i > 0 ? ", " : "") + pp(n.params[i], d);
        p += ") " + pp(n.body, d);
        break;

       case SCRIPT:
       case BLOCK:
        var nc = n.children;
        if (topScript) {
          for (var i = 0, j = nc.length; i < j; i++) {
            if (i > 0) p += "\n";
            p += pp(nc[i], d);
            var eoc = p[p.length - 1];
            if (eoc != ";") p += ";";
          }
          break;
        }
        p += "{";
        if (n.id !== undefined) p += " /* " + n.id + " */";
        p += "\n";
        for (var i = 0, j = nc.length; i < j; i++) {
          if (i > 0) p += "\n";
          p += indent(4, pp(nc[i], d));
          var eoc = p[p.length - 1];
          if (eoc != ";") p += ";";
        }
        p += "\n}";
        break;

       case IF:
        p += "if (" + pp(n.condition, d) + ") ";
        var tp = n.thenPart, ep = n.elsePart;
        var b = isBlock(tp) || isBlock(ep);
        if (!b) p += "{\n";
        p += (b ? pp(tp, d) : indent(4, pp(tp, d))) + "\n";
        if (ep) {
          if (!b) p += "} else {\n"; else p += " else ";
          p += (b ? pp(ep, d) : indent(4, pp(ep, d))) + "\n";
        }
        if (!b) p += "}";
        break;

       case SWITCH:
        p += "switch (" + pp(n.discriminant, d) + ") {\n";
        for (var i = 0, j = n.cases.length; i < j; i++) {
          var ca = n.cases[i];
          if (ca.type === CASE) p += "  case " + pp(ca.caseLabel, d) + ":\n"; else p += "  default:\n";
          var ps = pp(ca.statements, d);
          p += ps.slice(2, ps.length - 2) + "\n";
        }
        p += "}";
        break;

       case FOR:
        p += "for (" + pp(n.setup, d) + "; " + pp(n.condition, d) + "; " + pp(n.update, d) + ") ";
        var pb = pp(n.body, d);
        if (!isBlock(n.body)) p += "{\n" + indent(4, pb) + ";\n}"; else if (n.body) p += pb;
        break;

       case WHILE:
        p += "while (" + pp(n.condition, d) + ") ";
        var pb = pp(n.body, d);
        if (!isBlock(n.body)) p += "{\n" + indent(4, pb) + ";\n}"; else p += pb;
        break;

       case FOR_IN:
        var u = n.varDecl;
        p += "for (";
        p += (u ? pp(u, d) : pp(n.iterator, d)) + " in " + pp(n.object, d) + ") ";
        var pb = pp(n.body, d);
        if (!isBlock(n.body)) p += "{\n" + indent(4, pb) + ";\n}"; else if (n.body) p += pb;
        break;

       case DO:
        p += "do " + pp(n.body, d);
        p += " while (" + pp(n.condition, d) + ");";
        break;

       case BREAK:
        p += "break" + (n.label ? " " + n.label : "") + ";";
        break;

       case CONTINUE:
        p += "continue" + (n.label ? " " + n.label : "") + ";";
        break;

       case TRY:
        p += "try ";
        p += pp(n.tryBlock, d);
        for (var i = 0, j = n.catchClauses.length; i < j; i++) {
          var t = n.catchClauses[i];
          p += " catch (" + pp(t.varName, d) + (t.guard ? " if " + pp(t.guard, d) : "") + ") ";
          p += pp(t.block, d);
        }
        if (n.finallyBlock) {
          p += " finally ";
          p += pp(n.finallyBlock, d);
        }
        break;

       case THROW:
        p += "throw " + pp(n.exception, d);
        break;

       case RETURN:
        p += "return";
        if (n.value) p += " " + pp(n.value, d);
        break;

       case WITH:
        p += "with (" + pp(n.object, d) + ") ";
        p += pp(n.body, d);
        break;

       case VAR:
       case CONST:
        var nc = n.children;
        p += tokens[n.type] + " ";
        for (var i = 0, j = nc.length; i < j; i++) {
          if (i > 0) p += ", ";
          var u = nc[i];
          p += pp(u.name, d);
          if (u.initializer) p += " = " + pp(u.initializer, d);
        }
        break;

       case DEBUGGER:
        p += "debugger NYI\n";
        break;

       case SEMICOLON:
        if (n.expression) {
          p += pp(n.expression, d) + ";";
        }
        break;

       case LABEL:
        p += n.label + ":\n" + pp(n.statement, d);
        break;

       case COMMA:
       case LIST:
        var nc = n.children;
        for (var i = 0, j = nc.length; i < j; i++) {
          if (i > 0) p += ", ";
          p += pp(nc[i], d);
        }
        break;

       case ASSIGN:
        var nc = n.children;
        var t = n.assignOp;
        p += pp(nc[0], d) + " " + (t ? tokens[t] : "") + "=" + " " + pp(nc[1], d);
        break;

       case HOOK:
        var nc = n.children;
        p += "(" + pp(nc[0], d) + " ? " + pp(nc[1], d) + " : " + pp(nc[2], d);
        p += ")";
        break;

       case OR:
       case AND:
        var nc = n.children;
        p += "(" + pp(nc[0], d) + " " + tokens[n.type] + " " + pp(nc[1], d);
        p += ")";
        break;

       case BITWISE_OR:
       case BITWISE_XOR:
       case BITWISE_AND:
       case EQ:
       case NE:
       case STRICT_EQ:
       case STRICT_NE:
       case LT:
       case LE:
       case GE:
       case GT:
       case IN:
       case INSTANCEOF:
       case LSH:
       case RSH:
       case URSH:
       case PLUS:
       case MINUS:
       case MUL:
       case DIV:
       case MOD:
        var nc = n.children;
        p += "(" + pp(nc[0], d) + " " + tokens[n.type] + " " + pp(nc[1], d) + ")";
        break;

       case DELETE:
       case VOID:
       case TYPEOF:
        p += tokens[n.type] + " " + pp(n.children[0], d);
        break;

       case NOT:
       case BITWISE_NOT:
        p += tokens[n.type] + pp(n.children[0], d);
        break;

       case UNARY_PLUS:
        p += "+" + pp(n.children[0], d);
        break;

       case UNARY_MINUS:
        p += "-" + pp(n.children[0], d);
        break;

       case INCREMENT:
       case DECREMENT:
        if (n.postfix) {
          p += pp(n.children[0], d) + tokens[n.type];
        } else {
          p += tokens[n.type] + pp(n.children[0], d);
        }
        break;

       case DOT:
        var nc = n.children;
        p += pp(nc[0], d) + "." + pp(nc[1], d);
        break;

       case INDEX:
        var nc = n.children;
        p += pp(nc[0], d) + "[" + pp(nc[1], d) + "]";
        break;

       case CALL:
        var nc = n.children;
        p += pp(nc[0], d) + "(" + pp(nc[1], d) + ")";
        break;

       case NEW:
       case NEW_WITH_ARGS:
        var nc = n.children;
        p += "new " + pp(nc[0], d);
        if (nc[1]) p += "(" + pp(nc[1], d) + ")";
        break;

       case ARRAY_INIT:
        p += "[";
        var nc = n.children;
        for (var i = 0, j = nc.length; i < j; i++) {
          if (nc[i]) p += pp(nc[i], d);
          p += ",";
        }
        p += "]";
        break;

       case ARRAY_COMP:
        p += "[" + pp(n.expression, d) + " ";
        p += pp(n.tail, d);
        p += "]";
        break;

       case COMP_TAIL:
        var nc = n.children;
        for (var i = 0, j = nc.length; i < j; i++) {
          if (i > 0) p += " ";
          p += pp(nc[i], d);
        }
        if (n.guard) p += " if (" + pp(n.guard, d) + ")";
        break;

       case OBJECT_INIT:
        var nc = n.children;
        if (nc[0] && nc[0].type === PROPERTY_INIT) p += "{\n"; else p += "{";
        for (var i = 0, j = nc.length; i < j; i++) {
          if (i > 0) {
            p += ",\n";
          }
          var t = nc[i];
          if (t.type === PROPERTY_INIT) {
            var tc = t.children;
            var l;
            var propName = tc[0].value;
            if (typeof propName === "string" && !Tailspin.Lexer.isIdentifier(propName)) {
              l = nodeStr(tc[0]);
            } else {
              l = pp(tc[0], d);
            }
            p += indent(4, l) + ": " + indent(4, pp(tc[1], d)).substring(4);
          } else {
            p += indent(4, pp(t, d));
          }
        }
        p += "\n}";
        break;

       case NULL:
        p += "null";
        break;

       case THIS:
        p += "this";
        break;

       case TRUE:
        p += "true";
        break;

       case FALSE:
        p += "false";
        break;

       case IDENTIFIER:
       case NUMBER:
       case REGEXP:
        p += n.value;
        break;

       case STRING:
        p += nodeStr(n);
        break;

       case GROUP:
        p += "(" + pp(n.children[0], d) + ")";
        break;

       default:
        throw "PANIC: unknown operation " + tokens[n.type] + " " + n.toSource();
      }
      if (n.parenthesized) p += ")";
      return p;
    }
    var exports = {};
    exports.pp = pp;
    return exports;
  }();
  Tailspin.Sandbox = function(interpreter) {
    "use strict";
    var hasDirectProperty = Tailspin.Utility.hasDirectProperty;
    var functionInternals = {
      get: function(fn) {
        return fn["__tailspin_internal__"];
      },
      set: function(fn, internal) {
        return Object.defineProperty(fn, "__tailspin_internal__", {
          value: internal,
          configurable: true,
          enumerable: false,
          writable: true
        });
      },
      has: function(fn) {
        return hasDirectProperty(fn, "__tailspin_internal__");
      }
    };
    var nativeBase;
    var sandbox;
    var sandboxFns = 'nativeBase = (new Function("return this"))();\n\n// Creates a function in the sandbox from the string fnStr.\n// fnStr will reference continuationMarker, fint and x.\nnewFnFunction = function(continuationMarker, fint, x, fnStr) {\n    var newFn;\n    if (fint.node.body.strict) {\n        (function() {\n            "use strict"\n            newFn = eval(fnStr);\n        })();\n    }\n    else {\n        newFn = eval(fnStr);\n    }\n    return newFn;\n};\n\n// Creates an empty arguments object.\nmakeArguments = function() {\n    return (function(){return arguments})();\n};\n\n// Apply functions used in order to run functions in the sandbox.\napplyNew = function(f, a) {\n    return new (f.bind.apply(f, [,].concat(Array.prototype.slice.call(a))))();\n};\n\napply = function(f, t, a) {\n    return f.apply(t, a);\n};';
    if (typeof document === "object") {
      var iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      iframe.contentWindow.document.write('<script type="text/javascript">' + sandboxFns + "</scr" + "ipt>");
      nativeBase = new Function("return this")();
      sandbox = iframe.contentWindow;
    } else {
      var nonstrictEval = eval;
      nonstrictEval(sandboxFns);
      nativeBase = new Function("return this")();
      sandbox = nativeBase;
    }
    var globalBase = {
      NaN: sandbox.NaN,
      Infinity: sandbox.Infinity,
      undefined: sandbox.undefined,
      eval: sandbox.eval,
      Function: sandbox.Function,
      Array: sandbox.Array,
      Boolean: sandbox.Boolean,
      Date: sandbox.Date,
      Number: sandbox.Number,
      Object: sandbox.Object,
      RegExp: sandbox.RegExp,
      String: sandbox.String,
      Error: sandbox.Error,
      EvalError: sandbox.EvalError,
      RangeError: sandbox.RangeError,
      ReferenceError: sandbox.ReferenceError,
      SyntaxError: sandbox.SyntaxError,
      TypeError: sandbox.TypeError,
      URIError: sandbox.URIError,
      escape: sandbox.escape,
      unescape: sandbox.unescape,
      parseInt: sandbox.parseInt,
      parseFloat: sandbox.parseFloat,
      isNaN: sandbox.isNaN,
      isFinite: sandbox.isFinite,
      encodeURI: sandbox.encodeURI,
      decodeURI: sandbox.decodeURI,
      encodeURIComponent: sandbox.encodeURIComponent,
      decodeURIComponent: sandbox.decodeURIComponent,
      Math: sandbox.Math,
      JSON: sandbox.JSON
    };
    functionInternals.set(sandbox.eval, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev, options) {
        if (typeof a[0] !== "string") {
          return a[0];
        }
        var indirectEval = options && options.indirectEval;
        var calledFromStrictCode = indirectEval ? false : x.strict;
        var ast = Tailspin.Parser.parse(a[0], null, null, calledFromStrictCode, sandbox);
        var x2 = interpreter.createEvalExecutionContext(calledFromStrictCode);
        var isStrict = ast.strict;
        if (indirectEval) {
          x2.thisObject = global;
        } else if (isStrict) {
          x2.thisObject = t;
        } else if (t === null || t === undefined) {
          x2.thisObject = global;
        } else {
          x2.thisObject = toObject(t);
        }
        x2.functionInstance = this;
        x2.control = x.control;
        x2.asynchronous = x.asynchronous;
        if (!indirectEval) {
          x2.scope = x.scope;
        } else {
          x2.scope = {
            object: global,
            parent: null
          };
        }
        if (isStrict) {
          x2.scope = {
            object: new Object(),
            parent: x2.scope
          };
        }
        x2.execute(ast, function(v, prev) {
          next(x2.result, prev);
        }, null, null, null, thrw, prev);
      },
      construct: function() {}
    });
    functionInternals.set(sandbox.Function, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        this.construct(f, a, x, next, ret, cont, brk, thrw, prev);
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {
        var p = "", b = "", n = a.length;
        if (n) {
          var m = n - 1;
          if (m) {
            p += a[0];
            for (var k = 1; k < m; k++) {
              p += "," + a[k];
            }
          }
          b += a[m];
        }
        var f = Tailspin.Parser.parseFunction("anonymous(" + p + ") {" + b + "}", false, Tailspin.Parser.STATEMENT_FORM, null, null, sandbox);
        var x2 = {};
        x2.scope = {
          object: global,
          parent: null
        };
        x2.stack = [];
        next(newFunction(f, x2), prev);
      }
    });
    var oldToStr = sandbox.Function.prototype.toString;
    var newToStr = function() {
      var fint = functionInternals.get(this);
      return fint ? fint.toString() : oldToStr.call(this);
    };
    newToStr.prototype = undefined;
    Object.defineProperty(sandbox.Function.prototype, "toString", {
      value: newToStr,
      enumerable: false,
      writable: true
    });
    functionInternals.set(sandbox.Function.prototype.call, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var fint = functionInternals.get(t);
        if (fint) {
          if (typeof t !== "function") {
            thrw(new sandbox.TypeError("Call must be called on a function."));
          } else {
            var thisArg = fint.node && fint.node.body.strict ? a[0] : toObject(a[0]);
            var args = Array.prototype.splice.call(a, 1);
            fint.call(t, thisArg, args, x, next, ret, cont, brk, thrw, prev, {
              callViaFunctionApply: true
            });
          }
        } else {
          next(sandbox.apply(sandbox.Function.prototype.call, t, a), prev);
        }
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    functionInternals.set(sandbox.Function.prototype.apply, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var fint = functionInternals.get(t);
        if (fint) {
          if (typeof t !== "function") {
            thrw(new sandbox.TypeError("Apply must be called on a function."));
          } else {
            var thisArg = fint.node && fint.node.body.strict ? a[0] : toObject(a[0]);
            var args = a[1];
            if (args === null || args === undefined) {
              args = [];
            } else if (!isObject(args)) {
              thrw(new sandbox.TypeError("Apply arguments must be an object."));
              return;
            }
            fint.call(t, thisArg, args, x, next, ret, cont, brk, thrw, prev, {
              callViaFunctionApply: true
            });
          }
        } else {
          next(sandbox.apply(sandbox.Function.prototype.apply, t, a), prev);
        }
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    functionInternals.set(sandbox.Function.prototype.bind, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var fint = functionInternals.get(t);
        if (fint) {
          if (typeof t !== "function") {
            thrw(new sandbox.TypeError("Bind must be called on a function."));
          } else {
            var newFn = sandbox.Function.prototype.bind.apply(t, a);
            var newFint = new FunctionInternals();
            functionInternals.set(newFn, newFint);
            var newArgs = a.slice(1);
            var newThis = a[0];
            newFint.call = function(f, t, a, x, next, ret, cont, brk, thrw, prev, options) {
              t = newThis;
              a = a instanceof Array ? newArgs.concat(a) : newArgs;
              fint.call(f, t, a, x, next, ret, cont, brk, thrw, prev, {
                callViaFunctionApply: true
              });
            };
            newFint.construct = function(fn, a, x, next, ret, cont, brk, thrw, prev) {
              a = a instanceof Array ? newArgs.concat(a) : newArgs;
              fint.construct(fn, a, x, next, ret, cont, brk, thrw, prev);
            };
            next(newFn, prev);
          }
        } else {
          next(sandbox.apply(sandbox.Function.prototype.bind, t, a), prev);
        }
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    var popFn = sandbox.Array.prototype.pop;
    var pushFn = sandbox.Array.prototype.push;
    var shiftFn = sandbox.Array.prototype.shift;
    var unshiftFn = sandbox.Array.prototype.unshift;
    var spliceFn = sandbox.Array.prototype.splice;
    var reverseFn = sandbox.Array.prototype.reverse;
    var sortFn = sandbox.Array.prototype.sort;
    functionInternals.set(pushFn, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var originalLength = t.length;
        var newPrev = function() {
          sandbox.apply(spliceFn, t, [ originalLength, a.length ]);
          prev();
        };
        next(sandbox.apply(pushFn, t, a), newPrev);
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    functionInternals.set(popFn, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var oldLength = t.length;
        var popped = sandbox.apply(popFn, t, a);
        var newPrev = prev;
        if (t.length !== oldLength) {
          newPrev = function() {
            sandbox.apply(pushFn, t, [ popped ]);
            prev();
          };
        }
        next(popped, newPrev);
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    functionInternals.set(shiftFn, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var oldLength = t.length;
        var shifted = sandbox.apply(shiftFn, t, a);
        var newPrev = prev;
        if (t.length !== oldLength) {
          newPrev = function() {
            sandbox.apply(unshiftFn, t, [ shifted ]);
            prev();
          };
        }
        next(shifted, newPrev);
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    functionInternals.set(unshiftFn, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var newPrev = function() {
          sandbox.apply(spliceFn, t, [ 0, a.length ]);
          prev();
        };
        next(sandbox.apply(unshiftFn, t, a), newPrev);
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    functionInternals.set(spliceFn, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var newPrev;
        if (prev) {
          var oldItems = sandbox.Array.prototype.slice.apply(t);
          newPrev = function() {
            var c = oldItems.length;
            t.length = c;
            for (var i = 0; i < c; i++) {
              t[i] = oldItems[i];
            }
            prev();
          };
        }
        next(sandbox.apply(spliceFn, t, a), newPrev);
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    functionInternals.set(reverseFn, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var newPrev = function() {
          sandbox.apply(reverseFn, t);
          prev();
        };
        next(sandbox.apply(reverseFn, t), newPrev);
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    functionInternals.set(sortFn, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var newPrev;
        if (prev) {
          var oldItems = sandbox.Array.prototype.slice.apply(t);
          newPrev = function() {
            var c = oldItems.length;
            t.length = c;
            for (var i = 0; i < c; i++) {
              t[i] = oldItems[i];
            }
            prev();
          };
        }
        next(sandbox.apply(sortFn, t, a), newPrev);
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    var maxRnd = 4294967296;
    var rndSeed = Math.random() * maxRnd;
    functionInternals.set(sandbox.Math.random, {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
        var oldSeed = rndSeed;
        rndSeed = (1664525 * rndSeed + 1013904223) % maxRnd;
        var rndFloat = rndSeed / maxRnd;
        var newPrev = function() {
          rndSeed = oldSeed;
          prev();
        };
        next(rndFloat, newPrev);
      },
      construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
    });
    var nativeToSandboxErrors = [ Error, sandbox.Error, EvalError, sandbox.EvalError, RangeError, sandbox.RangeError, ReferenceError, sandbox.ReferenceError, SyntaxError, sandbox.SyntaxError, TypeError, sandbox.TypeError, URIError, sandbox.URIError ];
    function sandboxError(e, fileName, lineNumber) {
      var i = nativeToSandboxErrors.indexOf(e.constructor);
      if (i >= 0 && i % 2 === 0) {
        var newError = new nativeToSandboxErrors[i + 1](e.message);
        if (typeof fileName === "string" && typeof lineNumber === "number") {
          newError.sourceFile = fileName;
          newError.sourceLine = lineNumber;
        }
        return newError;
      }
      return e;
    }
    function sandboxArray(v) {
      return sandbox.apply(sandbox.Array.prototype.slice, v);
    }
    function newTypeError(msg, filename, lineNumber) {
      var error = new sandbox.TypeError(msg);
      error.sourceLine = lineNumber;
      error.sourceFile = filename;
      return error;
    }
    function newReferenceError(msg, filename, lineNumber) {
      var error = new sandbox.ReferenceError(msg);
      error.sourceLine = lineNumber;
      error.sourceFile = filename;
      return error;
    }
    var names = Object.getOwnPropertyNames(globalBase);
    for (var i = 0, n = names.length; i < n; i++) {
      var key = names[i];
      var propDesc = Object.getOwnPropertyDescriptor(nativeBase, names[i]);
      Object.defineProperty(globalBase, key, {
        configurable: propDesc.configurable,
        enumerable: propDesc.enumerable,
        writable: propDesc.writable
      });
    }
    var global = new sandbox.Object();
    function resetEnvironment() {
      var names = Object.getOwnPropertyNames(global);
      for (var i = 0, n = names.length; i < n; i++) {
        delete global[names[i]];
      }
      var names = Object.getOwnPropertyNames(globalBase);
      for (i = 0, n = names.length; i < n; i++) {
        var key = names[i];
        var val = globalBase[key];
        global[key] = val;
        Object.defineProperty(global, key, Object.getOwnPropertyDescriptor(globalBase, key));
      }
    }
    resetEnvironment();
    function argumentNames(fn) {
      var names = fn.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, "").replace(/\s+/g, "").split(",");
      return names.length == 1 && !names[0] ? [] : names;
    }
    function translate(value, depth) {
      depth = typeof depth === "number" ? depth : 0;
      if (typeof value === "function") {
        var fn = value;
        var argNames = argumentNames(fn);
        if (argNames[0] === "$ret" && argNames[1] === "$prev") {
          functionInternals.set(fn, {
            call: function(f, t, a, x, next, ret, cont, brk, thrw, prev) {
              var args = [ next, prev ];
              for (var i = 0, c = a.length; i < c; i++) {
                args[i + 2] = a[i];
              }
              f.apply(t, args);
            },
            construct: function(f, a, x, next, ret, cont, brk, thrw, prev) {}
          });
        }
      } else if (typeof value === "object" && depth < 1) {
        var obj = {};
        for (var k in value) {
          if (hasDirectProperty(k)) {
            obj[k] = translate(value[k], depth + 1);
          }
        }
        value = obj;
      }
      return value;
    }
    function isPrimitive(v) {
      var t = typeof v;
      return t === "object" ? v === null : t !== "function";
    }
    function isObject(v) {
      var t = typeof v;
      return t === "object" ? v !== null : t === "function";
    }
    function checkObjectCoercible(v, r, rn) {
      if (v === undefined || v === null) {
        var message = "'" + JSON.stringify(v) + "' is not an object (evaluating " + r + ")";
        throw rn ? newTypeError(message, rn.filename, rn.lineno) : newTypeError(message);
      }
    }
    function toObjectCheck(v, r, rn) {
      checkObjectCoercible(v, r, rn);
      return toObject(v);
    }
    function toObject(v) {
      switch (typeof v) {
       case "boolean":
        return new global.Boolean(v);

       case "number":
        return new global.Number(v);

       case "string":
        return new global.String(v);

       default:
        return v;
      }
    }
    function FunctionInternals(node, scope) {
      this.node = node;
      this.scope = scope;
      this.length = node ? node.params.length : 0;
    }
    function newFunction(n, x) {
      var fint = new FunctionInternals(n, x.scope);
      var args = fint.length > 0 ? "a0" : "";
      for (var i = 1; i < fint.length; i++) {
        args += ",a" + i;
      }
      var fnStr = "(function(" + args + "){\n        if (arguments[arguments.length-1] !== continuationMarker) {\n            var t = (this === nativeBase? undefined : this);\n            return fint.call(newFn, t, arguments, x);\n        }})";
      var newFn = sandbox.newFnFunction(continuationMarker, fint, x, fnStr);
      functionInternals.set(newFn, fint);
      return newFn;
    }
    function hasInstance(u, v) {
      if (isPrimitive(v)) return false;
      var p = u.prototype;
      if (isPrimitive(p)) {
        throw new sandbox.TypeError("'prototype' property is not an object.", this.node.filename, this.node.lineno);
      }
      var o;
      while (o = Object.getPrototypeOf(v)) {
        if (o === p) return true;
        v = o;
      }
      return false;
    }
    function constructFunction(fn, args, x, next, ret, cont, brk, thrw, prev) {
      var fint = functionInternals.get(fn);
      if (!fint) {
        try {
          var newFn = sandbox.applyNew(fn, args);
          next(newFn, prev);
        } catch (e) {
          thrw(sandboxError(e), prev);
        }
      } else {
        fint.construct(fn, args, x, next, ret, cont, brk, thrw, prev);
      }
    }
    function callFunction(f, t, a, x, next, ret, cont, brk, thrw, prev, options) {
      var fint = functionInternals.get(f);
      if (!fint) {
        try {
          var args = [];
          for (var i = 0, c = a.length; i < c; i++) {
            args[i] = a[i];
          }
          var r = sandbox.apply(f, t, args);
          next(r, prev);
        } catch (e) {
          thrw(sandboxError(e), prev);
        }
      } else {
        fint.call(f, t, a, x, next, ret, cont, brk, thrw, prev, options);
      }
    }
    var continuationMarker = {};
    var calleeCallerPoisonFn = sandbox.eval("'use strict'; Object.getOwnPropertyDescriptor(function() {}, 'caller').get");
    function Activation(f, a, callee) {
      if (f) {
        var safeParams = f.params.map(function(name) {
          return name === "arguments" ? "_" + f.params.join("_") : name;
        });
        var args = safeParams.join(", ");
        var accessors = safeParams.map(function(name) {
          return "{get:function(){return " + name + ";}, set:function(v){return " + name + " = v;}, configurable:false}";
        }).join(", ");
        var fnStr = "(function(" + args + "){\n" + "return {args:arguments, accessors:[" + accessors + "]};\n            })";
        var r = sandbox.eval(fnStr).apply(null, a);
        var paramNames = {};
        for (var i = f.params.length - 1; i >= 0; i--) {
          if (!Object.prototype.hasOwnProperty.call(this, f.params[i])) {
            if (!f.body.strict) {
              Object.defineProperty(this, f.params[i], r.accessors[i]);
              paramNames[f.params[i]] = true;
            } else if (a.length > i) {
              Object.defineProperty(this, f.params[i], {
                value: a[i],
                writable: true,
                enumerable: false,
                configurable: true
              });
            }
          }
        }
        if (!paramNames["arguments"]) {
          Object.defineProperty(this, "arguments", {
            value: r.args,
            writable: true,
            enumerable: false,
            configurable: false
          });
          if (!f.body.strict) {
            Object.defineProperty(r.args, "callee", {
              value: callee,
              writable: true,
              enumerable: false,
              configurable: true
            });
          } else {
            Object.defineProperty(r.args, "callee", {
              get: calleeCallerPoisonFn,
              set: calleeCallerPoisonFn,
              enumerable: false,
              configurable: false
            });
            Object.defineProperty(r.args, "caller", {
              get: calleeCallerPoisonFn,
              set: calleeCallerPoisonFn,
              enumerable: false,
              configurable: false
            });
          }
        }
      }
    }
    Activation.prototype = Object.create(null);
    var FIp = FunctionInternals.prototype = {
      call: function(f, t, a, x, next, ret, cont, brk, thrw, prev, options) {
        var n = this.node;
        var x2 = interpreter.createFunctionExecutionContext(n.body.strict);
        if (x2.strict && options && options.callViaFunctionApply) {
          x2.thisObject = t;
        } else if (x2.strict) {
          x2.thisObject = t !== global ? t : undefined;
        } else {
          x2.thisObject = toObject(t) || global;
        }
        x2.functionInstance = this;
        x2.control = x.control;
        x2.asynchronous = x.asynchronous;
        x2.stack = x.stack.slice();
        x2.stack.push({
          node: x.currentNode,
          executionContext: x
        });
        x2.scope = {
          object: new Activation(n, a, f),
          parent: this.scope
        };
        if (next) {
          x2.execute(n.body, function(result, prev) {
            next(undefined, prev);
          }, next, cont, brk, thrw, prev);
        } else {
          var returned = false;
          var hasException = false;
          var exception;
          x2.asynchronous = false;
          delete x2.control;
          x2.execute(n.body, function() {}, function() {
            returned = true;
          }, cont, brk, function(e) {
            hasException = true;
            exception = e;
          });
          if (hasException) {
            throw exception;
          } else if (returned) {
            return x2.result;
          } else {
            return undefined;
          }
        }
      },
      construct: function(fn, a, x, next, ret, cont, brk, thrw, prev) {
        var newObject = sandbox.applyNew(fn, [ continuationMarker ]);
        this.call(fn, newObject, a, x, function(r, prev) {
          if (typeof r === "object" || typeof r === "function") {
            next(r, prev);
          } else {
            next(newObject, prev);
          }
        }, ret, cont, brk, thrw, prev);
      },
      toString: function() {
        var parenthesized = this.node.parenthesized;
        this.node.parenthesized = false;
        var result = Tailspin.Decompiler.pp(this.node);
        this.node.parenthesized = parenthesized;
        return result;
      }
    };
    function ExecutionContext(type, strict) {
      this.type = type;
      this.strict = !!strict;
      this.stack = [];
    }
    ExecutionContext.prototype = {
      scope: {
        object: global,
        parent: null
      },
      thisObject: global,
      functionInstance: null,
      result: undefined,
      target: null,
      control: null,
      asynchronous: false,
      execute: function(n, next, ret, cont, brk, thrw, prev) {
        interpreter.execute(n, this, next, ret, cont, brk, thrw, prev);
      },
      newFunction: function(n) {
        return newFunction(n, this);
      },
      copy: function() {
        var cpy = new ExecutionContext(this.type, this.strict);
        cpy.scope = this.scope;
        cpy.thisObject = this.thisObject;
        cpy.functionInstance = this.functionInstance;
        cpy.result = this.result;
        cpy.target = this.target;
        cpy.control = this.control;
        cpy.asynchronous = this.asynchronous;
        cpy.stack = this.stack.slice();
        return cpy;
      },
      lookupInScope: function(a) {
        for (var s = this.scope; s; s = s.parent) {
          if (a in s.object) {
            return s.object[a];
          }
        }
        return undefined;
      }
    };
    var exports = {};
    exports.global = global;
    exports.globalBase = globalBase;
    exports.functionInternals = functionInternals;
    exports.translate = translate;
    exports.resetEnvironment = resetEnvironment;
    exports.sandbox = sandbox;
    exports.sandboxError = sandboxError;
    exports.sandboxArray = sandboxArray;
    exports.newTypeError = newTypeError;
    exports.newReferenceError = newReferenceError;
    exports.isPrimitive = isPrimitive;
    exports.isObject = isObject;
    exports.checkObjectCoercible = checkObjectCoercible;
    exports.toObjectCheck = toObjectCheck;
    exports.toObject = toObject;
    exports.Activation = Activation;
    exports.newFunction = newFunction;
    exports.hasInstance = hasInstance;
    exports.constructFunction = constructFunction;
    exports.callFunction = callFunction;
    exports.ExecutionContext = ExecutionContext;
    return exports;
  };
  function nonStrictGetValue(base, name) {
    return base[name];
  }
  function nonStrictPutValue(base, name, value) {
    return base[name] = value;
  }
  function nonStrictDeleteValue(base, name) {
    return delete base[name];
  }
  Tailspin.Interpreter = function() {
    "use strict";
    var Definitions = Tailspin.Definitions;
    var GLOBAL_CODE = 0, EVAL_CODE = 1, FUNCTION_CODE = 2;
    var exports = {};
    var sandboxExports = new Tailspin.Sandbox(exports);
    var sandbox = sandboxExports.sandbox;
    var global = sandboxExports.global;
    var functionInternals = sandboxExports.functionInternals;
    var sandboxError = sandboxExports.sandboxError;
    var sandboxArray = sandboxExports.sandboxArray;
    var newTypeError = sandboxExports.newTypeError;
    var newReferenceError = sandboxExports.newReferenceError;
    var ExecutionContext = sandboxExports.ExecutionContext;
    var isPrimitive = sandboxExports.isPrimitive;
    var isObject = sandboxExports.isObject;
    var checkObjectCoercible = sandboxExports.checkObjectCoercible;
    var toObjectCheck = sandboxExports.toObjectCheck;
    var toObject = sandboxExports.toObject;
    var Activation = sandboxExports.Activation;
    var newFunction = sandboxExports.newFunction;
    var hasInstance = sandboxExports.hasInstance;
    var constructFunction = sandboxExports.constructFunction;
    var callFunction = sandboxExports.callFunction;
    var hasDirectProperty = Tailspin.Utility.hasDirectProperty;
    function Reference(base, propertyName, node) {
      this.base = base;
      this.propertyName = propertyName;
      this.node = node;
    }
    Reference.prototype.toString = function() {
      return Tailspin.Decompiler.pp(this.node);
    };
    function ensureReferenceExists(v, thrw, prev) {
      if (v instanceof Reference) {
        if (!v.base) {
          thrw(newReferenceError(v.propertyName + " is not defined", v.node.filename, v.node.lineno), prev);
          return false;
        }
      } else {
        thrw(newReferenceError(v.propertyName + " is not a reference", v.node.filename, v.node.lineno), prev);
        return false;
      }
      return true;
    }
    function prevSaveValue(base, key, prev) {
      var newPrev = prev;
      if (prev) {
        var hadValue = hasDirectProperty(base, key);
        var oldValue = base[key];
        if (hadValue) {
          newPrev = function() {
            base[key] = oldValue;
            prev();
          };
        } else if (key !== "length" && hasDirectProperty(base, "length")) {
          var lenPrev = prevSaveValue(base, "length", prev);
          newPrev = function() {
            delete base[key];
            lenPrev();
          };
        } else {
          newPrev = function() {
            delete base[key];
            prev();
          };
        }
      }
      return newPrev;
    }
    function prevDeleteValue(base, key, prev) {
      var newPrev = prev;
      if (prev && base.hasOwnProperty(key)) {
        newPrev = prevSaveValue(base, key, prev);
        delete base[key];
      }
      return newPrev;
    }
    function getValue(x, ref, next, thrw, prev) {
      if (ref instanceof Reference) {
        if (ref.base === null || ref.base === undefined) {
          thrw(newReferenceError(ref.propertyName + " is not defined", ref.node.filename, ref.node.lineno), prev);
          return;
        } else if (typeof ref.base === "function" && ref.propertyName === "caller") {
          ref.base.caller;
          next(undefined, prev, ref);
        } else {
          var base = toObject(ref.base);
          var propDesc = Tailspin.Utility.getPropertyDescriptor(base, ref.propertyName);
          if (propDesc && propDesc.get) {
            var nextGV = function(value, prev) {
              next(value, prev, ref);
            };
            callFunction(propDesc.get, ref.base, [], x, nextGV, null, null, null, thrw, prev);
          } else {
            var value;
            if (x.strict) {
              value = base[ref.propertyName];
            } else {
              value = nonStrictGetValue(base, ref.propertyName);
            }
            next(value, prev, ref);
          }
        }
      } else {
        next(ref, prev, ref);
      }
    }
    function putValue(x, ref, value, refNode, strict, next, thrw, prev) {
      if (ref instanceof Reference) {
        var base = toObject(ref.base) || global;
        var propDesc = Tailspin.Utility.getPropertyDescriptor(base, ref.propertyName);
        if (propDesc && propDesc.set) {
          callFunction(propDesc.set, base, [ value ], x, next, null, null, null, thrw, prev);
        } else {
          var newPrev = prevSaveValue(base, ref.propertyName, prev);
          var result;
          if (strict) {
            result = base[ref.propertyName] = value;
          } else {
            result = nonStrictPutValue(base, ref.propertyName, value);
          }
          next(result, newPrev);
        }
      } else {
        thrw(newReferenceError("Invalid assignment left-hand side", refNode.filename, refNode.lineno), prev);
      }
    }
    function executeGV(n, x, next, ret, cont, brk, thrw, prev) {
      execute(n, x, function(r, prev) {
        getValue(x, r, next, thrw, prev);
      }, function(r, prev) {
        getValue(x, r, ret, thrw, prev);
      }, cont, brk, thrw, prev);
    }
    var counter = 0;
    var executeFunctions = [];
    executeFunctions[FUNCTION] = function exFunction(n, x, next, ret, cont, brk, thrw, prev) {
      var newFn;
      if (n.functionForm !== Tailspin.Parser.DECLARED_FORM) {
        if (!n.name || n.functionForm === Tailspin.Parser.STATEMENT_FORM) {
          newFn = newFunction(n, x);
          if (n.functionForm === Tailspin.Parser.STATEMENT_FORM) {
            Object.defineProperty(x.scope.object, n.name, {
              value: newFn,
              writable: true,
              configurable: false,
              enumerable: true
            });
          }
        } else {
          var t = new sandbox.Object();
          x.scope = {
            object: t,
            parent: x.scope
          };
          try {
            newFn = newFunction(n, x);
            Object.defineProperty(t, n.name, {
              value: newFn,
              writable: false,
              configurable: false,
              enumerable: true
            });
          } finally {
            x.scope = x.scope.parent;
          }
        }
      }
      next(newFn, prev);
    };
    executeFunctions[SCRIPT] = function exScript(n, x, next, ret, cont, brk, thrw, prev) {
      var delPrev = function(object, name, prev) {
        var newPrev = prev;
        if (prev) {
          newPrev = function() {
            delete object[name];
            prev();
          };
        }
        return newPrev;
      };
      var t = x.scope.object;
      var funDecls = n.funDecls;
      for (var i = 0, c = funDecls.length; i < c; i++) {
        var name = funDecls[i].name;
        var f = newFunction(funDecls[i], x);
        var deletable = prev || x.type === EVAL_CODE;
        if (hasDirectProperty(t, name)) {
          t[name] = f;
        } else {
          Object.defineProperty(t, name, {
            value: f,
            configurable: deletable,
            writable: true
          });
        }
        prev = delPrev(t, name, prev);
      }
      var varDecls = n.varDecls;
      for (var i = 0, c = varDecls.length; i < c; i++) {
        var v = varDecls[i];
        var name = v.name;
        if (v.readOnly && hasDirectProperty(t, name)) {
          thrw(newTypeError("Redeclaration of const " + name, v.filename, v.lineno), prev);
          return;
        }
        if (v.readOnly || !hasDirectProperty(t, name)) {
          var deletable = prev || x.type === EVAL_CODE;
          Object.defineProperty(t, name, {
            value: undefined,
            configurable: deletable,
            writable: true
          });
          prev = delPrev(t, name, prev);
        }
      }
      executeFunctions[BLOCK](n, x, next, ret, cont, brk, thrw, prev);
    };
    executeFunctions[BLOCK] = function exBlock(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      var forLoop = function(i, prev) {
        if (i < c.length) {
          execute(c[i], x, function(value, prev) {
            forLoop(i + 1, prev);
          }, ret, cont, brk, thrw, prev);
        } else {
          next(undefined, prev);
        }
      };
      forLoop(0, prev);
    };
    executeFunctions[IF] = function exIf(n, x, next, ret, cont, brk, thrw, prev) {
      var ifNext = function ifNext(conditionValue, prev) {
        if (conditionValue) {
          execute(n.thenPart, x, next, ret, cont, brk, thrw, prev);
        } else if (n.elsePart) {
          execute(n.elsePart, x, next, ret, cont, brk, thrw, prev);
        } else {
          next(conditionValue, prev);
        }
      };
      executeGV(n.condition, x, ifNext, ret, cont, brk, thrw, prev);
    };
    executeFunctions[SWITCH] = function exSwitch(n, x, next, ret, cont, brk, thrw, prev) {
      var switchBody = function(switchValue, prev) {
        var cases = n.cases;
        var caseEnd = function(i, prev) {
          if (i === cases.length) {
            next(undefined, prev);
          } else {
            caseBody(i, prev);
          }
        };
        var caseBody = function(i, prev) {
          var caseT = cases[i];
          if (caseT.statements.children.length) {
            var newBrk = function(target, prev) {
              if (target === n) {
                next(undefined, prev);
              } else {
                brk(target, prev);
              }
            };
            var newNext = function(ignored, prev) {
              caseEnd(i + 1, prev);
            };
            execute(caseT.statements, x, newNext, ret, cont, newBrk, thrw, prev);
          } else {
            caseEnd(i + 1, prev);
          }
        };
        var loopFn = function(i, prev) {
          if (i === cases.length) {
            if (n.defaultIndex >= 0) {
              caseBody(n.defaultIndex, prev);
            } else {
              next(undefined, prev);
            }
          } else {
            var theCase = cases[i];
            if (theCase.type === CASE) {
              executeGV(theCase.caseLabel, x, function(caseValue, prev) {
                if (caseValue === switchValue) {
                  caseBody(i, prev);
                } else {
                  loopFn(i + 1, prev);
                }
              }, ret, cont, brk, thrw, prev);
            } else {
              loopFn(i + 1, prev);
            }
          }
        };
        loopFn(0, prev);
      };
      executeGV(n.discriminant, x, switchBody, ret, cont, brk, thrw, prev);
    };
    executeFunctions[FOR] = function exFor(n, x, next, ret, cont, brk, thrw, prev) {
      var contFn = function(ignored, prev) {
        if (n.update) {
          executeGV(n.update, x, whileBodyCondition, ret, null, null, thrw, prev);
        } else {
          whileBodyCondition(null, prev);
        }
      };
      var whileBody = function(prev) {
        var newCont = function(target, prev) {
          if (target === n) {
            contFn(null, prev);
          } else {
            cont(target, prev);
          }
        };
        var newBrk = function(target, prev) {
          if (target === n) {
            next(undefined, prev);
          } else {
            brk(target, prev);
          }
        };
        execute(n.body, x, contFn, ret, newCont, newBrk, thrw, prev);
      };
      var whileBodyCondition = function(ignored, prev) {
        if (!n.condition) {
          whileBody(prev);
        } else {
          var nextFor = function(conditionValue, prev) {
            if (conditionValue) {
              whileBody(prev);
            } else {
              next(undefined, prev);
            }
          };
          executeGV(n.condition, x, nextFor, ret, cont, brk, thrw, prev);
        }
      };
      if (n.type === WHILE) {
        whileBodyCondition(null, prev);
      } else {
        if (n.setup) {
          executeGV(n.setup, x, whileBodyCondition, ret, cont, brk, thrw, prev);
        } else {
          whileBodyCondition(null, prev);
        }
      }
    };
    executeFunctions[WHILE] = executeFunctions[FOR];
    executeFunctions[FOR_IN] = function exForIn(n, x, next, ret, cont, brk, thrw, prev) {
      var body = function(ignored, prev) {
        var r = n.iterator;
        var a = [];
        var forLoop = function(i, prev) {
          if (i < a.length) {
            execute(r, x, function(pv) {
              var newCont = function(target, prev) {
                if (target === n) {
                  forLoop(i + 1, prev);
                } else {
                  cont(target, prev);
                }
              };
              var newBrk = function(target) {
                if (target === n) {
                  next(undefined, prev);
                } else {
                  brk(target, prev);
                }
              };
              putValue(x, pv, a[i], r, x.strict, function(r, prev) {
                execute(n.body, x, function(ignored, prev) {
                  forLoop(i + 1, prev);
                }, ret, newCont, newBrk, thrw, prev);
              }, thrw, prev);
            }, ret, cont, brk, thrw, prev);
          } else {
            next(undefined, prev);
          }
        };
        executeGV(n.object, x, function(objectIn, prev, ref) {
          var t = objectIn === null || objectIn === undefined ? objectIn : toObjectCheck(objectIn, ref, n.object);
          for (var i in objectIn) {
            a.push(i);
          }
          forLoop(0, prev);
        }, ret, cont, brk, thrw, prev);
      };
      if (n.varDecl) {
        execute(n.varDecl, x, body, ret, cont, brk, thrw, prev);
      } else {
        body(undefined, prev);
      }
    };
    executeFunctions[DO] = function exDo(n, x, next, ret, cont, brk, thrw, prev) {
      var doCondition = function(ignored, prev) {
        var nextLoop = function(conditionValue, prev) {
          if (conditionValue) {
            forLoop(prev);
          } else {
            next(undefined, prev);
          }
        };
        executeGV(n.condition, x, nextLoop, ret, null, null, thrw, prev);
      };
      var newCont = function(target, prev) {
        if (target === n) {
          forLoop(prev);
        } else {
          cont(target, prev);
        }
      };
      var newBrk = function(target, prev) {
        if (target === n) {
          next(undefined, prev);
        } else {
          brk(target, prev);
        }
      };
      var forLoop = function(prev) {
        execute(n.body, x, doCondition, ret, newCont, newBrk, thrw, prev);
      };
      forLoop(prev);
    };
    executeFunctions[BREAK] = function exBreak(n, x, next, ret, cont, brk, thrw, prev) {
      brk(n.target, prev);
    };
    executeFunctions[CONTINUE] = function exContinue(n, x, next, ret, cont, brk, thrw, prev) {
      cont(n.target, prev);
    };
    executeFunctions[TRY] = function exTry(n, x, next, ret, cont, brk, thrw, prev) {
      if (n.finallyBlock) {
        var finalWrap = function(fn, ret, cont, brk, thrw) {
          return function(r, prev) {
            var savedResult = x.result;
            var nextWrap = function(ignored, prev) {
              x.result = savedResult;
              fn(r, prev);
            };
            execute(n.finallyBlock, x, nextWrap, ret, cont, brk, thrw, prev);
          };
        };
        next = finalWrap(next, ret, cont, brk, thrw);
        ret = finalWrap(ret, ret, cont, brk, thrw);
        cont = finalWrap(cont, ret, cont, brk, thrw);
        brk = finalWrap(brk, ret, cont, brk, thrw);
        thrw = finalWrap(thrw, ret, cont, brk, thrw);
      }
      var exception = function(e, prev) {
        x.result = undefined;
        if (n.catchClauses.length === 1) {
          var t = n.catchClauses[0];
          x.scope = {
            object: new Activation(),
            parent: x.scope
          };
          Object.defineProperty(x.scope.object, t.varName, {
            value: e,
            writable: true,
            configurable: false,
            enumerable: true
          });
          execute(t.block, x, function(ignored, prev) {
            x.scope = x.scope.parent;
            next(undefined, prev);
          }, ret, cont, brk, thrw, prev);
        } else {
          thrw(e, prev);
        }
      };
      execute(n.tryBlock, x, next, ret, cont, brk, exception, prev);
    };
    executeFunctions[THROW] = function exThrow(n, x, next, ret, cont, brk, thrw, prev) {
      executeGV(n.exception, x, thrw, ret, cont, brk, thrw, prev);
    };
    executeFunctions[RETURN] = function exReturn(n, x, next, ret, cont, brk, thrw, prev) {
      if (n.value) {
        executeGV(n.value, x, function(r, prev) {
          x.result = r;
          ret(r, prev);
        }, ret, cont, brk, thrw, prev);
      } else {
        x.result = undefined;
        ret(undefined, prev);
      }
    };
    executeFunctions[WITH] = function exWith(n, x, next, ret, cont, brk, thrw, prev) {
      var withBody = function(inScope, prev, ref) {
        inScope = toObjectCheck(inScope, ref, n.object);
        var newX = x.copy();
        newX.scope = {
          object: inScope,
          parent: x.scope
        };
        execute(n.body, newX, next, ret, cont, brk, thrw, prev);
      };
      executeGV(n.object, x, withBody, ret, cont, brk, thrw, prev);
    };
    executeFunctions[VAR] = function exVar(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      var forLoop = function(i, prev) {
        if (i < c.length) {
          var u = c[i].initializer;
          if (!u) {
            forLoop(i + 1, prev);
          } else {
            var name = c[i].name;
            for (var s = x.scope; s; s = s.parent) {
              if (hasDirectProperty(s.object, name)) {
                break;
              }
            }
            executeGV(u, x, function(value, prev) {
              var newPrev = prevSaveValue(s.object, name, prev);
              nonStrictPutValue(s.object, name, value);
              forLoop(i + 1, newPrev);
            }, ret, cont, brk, thrw, prev);
          }
        } else {
          next(undefined, prev);
        }
      };
      forLoop(0, prev);
    };
    executeFunctions[SEMICOLON] = function exSemicolon(n, x, next, ret, cont, brk, thrw, prev) {
      if (n.expression) {
        executeGV(n.expression, x, function(r, prev) {
          x.result = r;
          next(undefined, prev);
        }, ret, cont, brk, thrw, prev);
      } else {
        next(undefined, prev);
      }
    };
    executeFunctions[LABEL] = function exLabel(n, x, next, ret, cont, brk, thrw, prev) {
      execute(n.statement, x, next, ret, cont, function(target, prev) {
        if (target === n.target) {
          next(undefined, prev);
        } else {
          brk(target, prev);
        }
      }, thrw, prev);
    };
    executeFunctions[COMMA] = function exComma(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      var forLoop = function(i, lastValue, prev) {
        if (i < c.length) {
          executeGV(c[i], x, function(v, prev) {
            forLoop(i + 1, v, prev);
          }, ret, cont, brk, thrw, prev);
        } else {
          next(lastValue, prev);
        }
      };
      forLoop(0, undefined, prev);
    };
    executeFunctions[ASSIGN] = function exAssign(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      var assignFn = function(r) {
        var t = n.assignOp;
        function assign(u, prev) {
          executeGV(c[1], x, function(v, prev) {
            if (t) {
              switch (t) {
               case BITWISE_OR:
                v = u | v;
                break;

               case BITWISE_XOR:
                v = u ^ v;
                break;

               case BITWISE_AND:
                v = u & v;
                break;

               case LSH:
                v = u << v;
                break;

               case RSH:
                v = u >> v;
                break;

               case URSH:
                v = u >>> v;
                break;

               case PLUS:
                v = u + v;
                break;

               case MINUS:
                v = u - v;
                break;

               case MUL:
                v = u * v;
                break;

               case DIV:
                v = u / v;
                break;

               case MOD:
                v = u % v;
                break;
              }
            }
            putValue(x, r, v, c[0], x.strict, next, thrw, prev);
          }, ret, cont, brk, thrw, prev);
        }
        if (t) {
          getValue(x, r, assign, thrw, prev);
        } else {
          if (!x.strict || ensureReferenceExists(r, thrw, prev)) {
            assign(undefined, prev);
          }
        }
      };
      execute(c[0], x, assignFn, ret, cont, brk, thrw, prev);
    };
    executeFunctions[HOOK] = function exHook(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      executeGV(c[0], x, function(conditionValue, prev) {
        executeGV(conditionValue ? c[1] : c[2], x, next, ret, cont, brk, thrw, prev);
      }, ret, cont, brk, thrw, prev);
    };
    executeFunctions[OR] = function exOr(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      var orFn = function(a, prev) {
        if (a) {
          next(a, prev);
        } else {
          executeGV(c[1], x, function(b, prev) {
            next(b, prev);
          }, ret, cont, brk, thrw, prev);
        }
      };
      executeGV(c[0], x, orFn, ret, cont, brk, thrw, prev);
    };
    executeFunctions[AND] = function exAnd(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      var andFn = function(a, prev) {
        if (!a) {
          next(a, prev);
        } else {
          executeGV(c[1], x, function(b, prev) {
            next(b, prev);
          }, ret, cont, brk, thrw, prev);
        }
      };
      executeGV(c[0], x, andFn, ret, cont, brk, thrw, prev);
    };
    function binaryOperator(fn) {
      return function(n, x, next, ret, cont, brk, thrw, prev) {
        var c = n.children;
        executeGV(c[0], x, function(a, prev) {
          executeGV(c[1], x, function(b, prev) {
            next(fn(a, b), prev);
          }, ret, cont, brk, thrw, prev);
        }, ret, cont, brk, thrw, prev);
      };
    }
    function unaryOperator(fn) {
      return function(n, x, next, ret, cont, brk, thrw, prev) {
        executeGV(n.children[0], x, function(a, prev) {
          next(fn(a), prev);
        }, ret, cont, brk, thrw, prev);
      };
    }
    executeFunctions[BITWISE_OR] = binaryOperator(function(a, b) {
      return a | b;
    });
    executeFunctions[BITWISE_XOR] = binaryOperator(function(a, b) {
      return a ^ b;
    });
    executeFunctions[BITWISE_AND] = binaryOperator(function(a, b) {
      return a & b;
    });
    executeFunctions[EQ] = binaryOperator(function(a, b) {
      return a == b;
    });
    executeFunctions[NE] = binaryOperator(function(a, b) {
      return a != b;
    });
    executeFunctions[STRICT_EQ] = binaryOperator(function(a, b) {
      return a === b;
    });
    executeFunctions[STRICT_NE] = binaryOperator(function(a, b) {
      return a !== b;
    });
    executeFunctions[LT] = binaryOperator(function(a, b) {
      return a < b;
    });
    executeFunctions[LE] = binaryOperator(function(a, b) {
      return a <= b;
    });
    executeFunctions[GT] = binaryOperator(function(a, b) {
      return a > b;
    });
    executeFunctions[GE] = binaryOperator(function(a, b) {
      return a >= b;
    });
    executeFunctions[IN] = binaryOperator(function(a, b) {
      return a in b;
    });
    executeFunctions[INSTANCEOF] = function exInstanceOf(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      executeGV(c[0], x, function(t, prev) {
        executeGV(c[1], x, function(u, prev) {
          var v;
          if (isObject(u) && functionInternals.has(u)) {
            v = hasInstance(u, t);
          } else {
            v = t instanceof u;
          }
          next(v, prev);
        }, ret, cont, brk, thrw, prev);
      }, ret, cont, brk, thrw, prev);
    };
    executeFunctions[LSH] = binaryOperator(function(a, b) {
      return a << b;
    });
    executeFunctions[RSH] = binaryOperator(function(a, b) {
      return a >> b;
    });
    executeFunctions[URSH] = binaryOperator(function(a, b) {
      return a >>> b;
    });
    executeFunctions[PLUS] = binaryOperator(function(a, b) {
      return a + b;
    });
    executeFunctions[MINUS] = binaryOperator(function(a, b) {
      return a - b;
    });
    executeFunctions[MUL] = binaryOperator(function(a, b) {
      return a * b;
    });
    executeFunctions[DIV] = binaryOperator(function(a, b) {
      return a / b;
    });
    executeFunctions[MOD] = binaryOperator(function(a, b) {
      return a % b;
    });
    executeFunctions[DELETE] = function exDelete(n, x, next, ret, cont, brk, thrw, prev) {
      execute(n.children[0], x, function(t, prev) {
        var v = !(t instanceof Reference) || !t.base;
        var newPrev = prev;
        if (!v) {
          newPrev = prevSaveValue(t.base, t.propertyName, prev);
          if (x.strict) {
            v = delete t.base[t.propertyName];
          } else {
            v = nonStrictDeleteValue(t.base, t.propertyName);
          }
        }
        next(v, newPrev);
      }, ret, cont, brk, thrw, prev);
    };
    executeFunctions[VOID] = function exVoid(n, x, next, ret, cont, brk, thrw, prev) {
      executeGV(n.children[0], x, function(v, prev) {
        next(undefined, prev);
      }, ret, cont, brk, thrw, prev);
    };
    executeFunctions[TYPEOF] = function exTypeof(n, x, next, ret, cont, brk, thrw, prev) {
      execute(n.children[0], x, function(t, prev) {
        if (t instanceof Reference) {
          if (t.base) {
            getValue(x, t, function(v, prev) {
              next(typeof v, prev);
            }, thrw, prev);
          } else {
            next("undefined", prev);
          }
        } else {
          next(typeof t, prev);
        }
      }, ret, cont, brk, thrw, prev);
    };
    executeFunctions[NOT] = unaryOperator(function(a) {
      return !a;
    });
    executeFunctions[BITWISE_NOT] = unaryOperator(function(a) {
      return ~a;
    });
    executeFunctions[UNARY_PLUS] = unaryOperator(function(a) {
      return +a;
    });
    executeFunctions[UNARY_MINUS] = unaryOperator(function(a) {
      return -a;
    });
    executeFunctions[INCREMENT] = function exIncrement(n, x, next, ret, cont, brk, thrw, prev) {
      executeGV(n.children[0], x, function(value, prev, ref) {
        var numValue = Number(value);
        var originalValue = numValue;
        var newValue = n.type === INCREMENT ? ++numValue : --numValue;
        putValue(x, ref, newValue, n.children[0], x.strict, function(result, prev) {
          next(n.postfix ? originalValue : numValue, prev);
        }, thrw, prev);
      }, ret, cont, brk, thrw, prev);
    };
    executeFunctions[DECREMENT] = executeFunctions[INCREMENT];
    executeFunctions[DOT] = function exDot(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      executeGV(c[0], x, function(t, prev, ref) {
        var propName = c[1].value;
        checkObjectCoercible(t, ref, c[0]);
        var newRef = new Reference(t, propName, n);
        next(newRef, prev);
      }, ret, cont, brk, thrw, prev);
    };
    executeFunctions[INDEX] = function exIndex(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      executeGV(c[0], x, function(t, prev, ref) {
        executeGV(c[1], x, function(u, prev) {
          checkObjectCoercible(t, ref, c[0]);
          var newRef = new Reference(t, String(u), n);
          next(newRef, prev);
        }, ret, cont, brk, thrw, prev);
      }, ret, cont, brk, thrw, prev);
    };
    executeFunctions[LIST] = function exList(n, x, next, ret, cont, brk, thrw, prev) {
      var v = [];
      var c = n.children;
      var forLoop = function(i, prev) {
        if (i < c.length) {
          executeGV(c[i], x, function(u, prev) {
            v[i] = u;
            forLoop(i + 1, prev);
          }, ret, cont, brk, thrw, prev);
        } else {
          next(v, prev);
        }
      };
      forLoop(0, prev);
    };
    executeFunctions[CALL] = function exCall(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      executeGV(c[0], x, function(f, prev, r) {
        execute(c[1], x, function(a, prev) {
          if (typeof f !== "function") {
            thrw(newTypeError(f + " is not callable", c[0].filename, c[0].lineno), prev);
          } else {
            var t;
            var options;
            if (f === sandbox.eval && (!(r instanceof Reference) || r.propertyName !== "eval" || r.base[r] !== sandbox.eval)) {
              options = {
                indirectEval: true
              };
            } else if (f === sandbox.eval) {
              t = x.thisObject;
            } else {
              t = r instanceof Reference ? r.base : undefined;
              if (t instanceof Activation) {
                t = undefined;
              }
            }
            if (x.control) {
              var next_o = next;
              next = function(v, prev) {
                var newPrev = prevSaveValue(x, "returnedValue", prev);
                x.returnedValue = v;
                x.control(n, x, function(prev) {
                  next_o(v, prev);
                }, newPrev);
              };
            }
            callFunction(f, t, a, x, next, ret, cont, brk, thrw, prev, options);
          }
        }, ret, cont, brk, thrw, prev);
      }, ret, cont, brk, thrw, prev);
    };
    executeFunctions[NEW] = function exNew(n, x, next, ret, cont, brk, thrw, prev) {
      var c = n.children;
      executeGV(c[0], x, function(f, prev, ref) {
        var constructFn = function(args, prev) {
          if (typeof f !== "function") {
            thrw(newTypeError(ref + " is not a constructor", c[0].filename, c[0].lineno), prev);
          } else {
            constructFunction(f, args, x, next, ret, cont, brk, thrw, prev);
          }
        };
        if (n.type === NEW) {
          var a = new sandbox.Object();
          Object.defineProperty(a, "length", {
            value: 0,
            writable: true,
            configurable: true,
            enumerable: false
          });
          constructFn(a, prev);
        } else {
          execute(c[1], x, constructFn, ret, cont, brk, thrw, prev);
        }
      }, ret, cont, brk, thrw, prev);
    };
    executeFunctions[NEW_WITH_ARGS] = executeFunctions[NEW];
    executeFunctions[ARRAY_INIT] = function exArrayInit(n, x, next, ret, cont, brk, thrw, prev) {
      var newArray = [];
      var forLoop = function(i, prev) {
        if (i < n.children.length) {
          if (n.children[i]) {
            executeGV(n.children[i], x, function(childValue, prev) {
              var newPrev = prevSaveValue(newArray, i, prev);
              newArray[i] = childValue;
              forLoop(i + 1, newPrev);
            }, ret, cont, brk, thrw, prev);
          } else {
            forLoop(i + 1, prev);
          }
        } else {
          var sandboxedArray = sandboxArray(newArray);
          sandboxedArray.length = n.children.length;
          next(sandboxedArray, prev);
        }
      };
      forLoop(0, prev);
    };
    executeFunctions[OBJECT_INIT] = function exObjectInit(n, x, next, ret, cont, brk, thrw, prev) {
      var newObject = new sandbox.Object();
      var c = n.children;
      var forLoop = function(i, prev) {
        if (i < c.length) {
          var property = c[i];
          if (property.type === PROPERTY_INIT) {
            executeGV(property.children[1], x, function(value, prev) {
              var key = property.children[0].value;
              var newPrev = prevSaveValue(newObject, key, prev);
              Object.defineProperty(newObject, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
              });
              forLoop(i + 1, newPrev);
            }, ret, cont, brk, thrw, prev);
          } else {
            var fn = newFunction(property, x);
            if (property.type === GETTER) {
              Object.defineProperty(newObject, property.name, {
                get: thunk(fn, x),
                enumerable: true,
                configurable: true
              });
            } else {
              Object.defineProperty(newObject, property.name, {
                set: thunk(fn, x),
                enumerable: true,
                configurable: true
              });
            }
            forLoop(i + 1, prev);
          }
        } else {
          next(newObject, prev);
        }
      };
      forLoop(0, prev);
    };
    executeFunctions[NULL] = function exNull(n, x, next, ret, cont, brk, thrw, prev) {
      next(null, prev);
    };
    executeFunctions[THIS] = function exThis(n, x, next, ret, cont, brk, thrw, prev) {
      next(x.thisObject, prev);
    };
    executeFunctions[TRUE] = function exTrue(n, x, next, ret, cont, brk, thrw, prev) {
      next(true, prev);
    };
    executeFunctions[FALSE] = function exFalse(n, x, next, ret, cont, brk, thrw, prev) {
      next(false, prev);
    };
    executeFunctions[IDENTIFIER] = function exIdentifier(n, x, next, ret, cont, brk, thrw, prev) {
      for (var s = x.scope; s; s = s.parent) {
        if (n.value in s.object) {
          break;
        }
      }
      next(new Reference(s && s.object, n.value, n), prev);
    };
    executeFunctions[NUMBER] = function exValue(n, x, next, ret, cont, brk, thrw, prev) {
      next(n.value, prev);
    };
    executeFunctions[STRING] = executeFunctions[NUMBER];
    executeFunctions[REGEXP] = executeFunctions[NUMBER];
    executeFunctions[GROUP] = function exGroup(n, x, next, ret, cont, brk, thrw, prev) {
      execute(n.children[0], x, next, ret, cont, brk, thrw, prev);
    };
    function execute(n, x, next, ret, cont, brk, thrw, prev) {
      var executeFn = function(prev) {
        try {
          var fn = executeFunctions[n.type];
          if (fn) {
            fn(n, x, next, ret, cont, brk, thrw, prev);
          } else {
            thrw("Not implemented: " + Definitions.tokens[n.type], prev);
          }
        } catch (e) {
          thrw(sandboxError(e, n.filename, n.lineno), prev);
        }
      };
      if (x.asynchronous) {
        var executeFnOriginal = executeFn;
        executeFn = function(prev) {
          counter++;
          if (counter > 200) {
            counter = 0;
            setTimeout(function() {
              executeFnOriginal(prev);
            }, 0);
          } else {
            executeFnOriginal(prev);
          }
        };
      }
      var newPrev = prevDeleteValue(x, "returnedValue", prev);
      x.currentNode = n;
      if (x.control) {
        x.control(n, x, executeFn, newPrev);
      } else {
        executeFn(newPrev);
      }
    }
    function thunk(f, x) {
      return function() {
        return functionInternals.get(f).call(f, this, arguments, x);
      };
    }
    function evaluate(s, f, l, ret, thrw, prev) {
      evaluateInContext(s, f, l, createExecutionContext(), ret, thrw, prev);
    }
    function evaluateInContext(s, f, l, x, ret, thrw, prev) {
      if (typeof s !== "string") {
        return s;
      }
      try {
        var ast = Tailspin.Parser.parse(s, f, l, false, sandbox);
        x.strict = !!ast.strict;
        x.execute(ast, function(v, prev) {
          ret(x.result, prev);
        }, ret, null, null, thrw, prev);
      } catch (e) {
        thrw(sandboxError(e), prev);
      }
    }
    function createExecutionContext() {
      return new ExecutionContext(GLOBAL_CODE);
    }
    function createEvalExecutionContext(strict) {
      return new ExecutionContext(EVAL_CODE, strict);
    }
    function createFunctionExecutionContext(strict) {
      return new ExecutionContext(FUNCTION_CODE, strict);
    }
    exports.global = global;
    exports.globalBase = sandboxExports.globalBase;
    exports.translate = sandboxExports.translate;
    exports.resetEnvironment = sandboxExports.resetEnvironment;
    exports.evaluate = evaluate;
    exports.evaluateInContext = evaluateInContext;
    exports.execute = execute;
    exports.createExecutionContext = createExecutionContext;
    exports.createEvalExecutionContext = createEvalExecutionContext;
    exports.createFunctionExecutionContext = createFunctionExecutionContext;
    return exports;
  };
}();