/*
 * Tailspin - Reversible JS implemented in JS.
 * Will Thimbleby <will@thimbleby.net>
 *
 * Utility functions, Dict, and Stack implementations.
 */

/*
 * Based on the Narcissus JavaScript engine.
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
 */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


Tailspin.Utility = (function () {
"use strict";

function applyNew(f, a) {
    return new (f.bind.apply(f, [,].concat(Array.prototype.slice.call(a))))();
}

// Helper to avoid Object.prototype.hasOwnProperty polluting scope objects.
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
    has: function(x) { return hasDirectProperty(this.table, x); },
    set: function(x, v) {
        if (!hasDirectProperty(this.table, x))
            this.size++;
        this.table[x] = v;
    },
    get: function(x) { return this.table[x]; },
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
        return this.mapObject(function(val) { return val; });
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
    toString: function() { return "[object Dict]"; }
};

// non-destructive stack
function Stack(elts) {
    this.elts = elts || null;
}

Stack.prototype = {
    push: function(x) {
        return new Stack({ top: x, rest: this.elts });
    },
    top: function() {
        if (!this.elts)
            throw new Error("empty stack");
        return this.elts.top;
    },
    isEmpty: function() {
        return this.top === null;
    },
    find: function(test) {
        for (var elts = this.elts; elts; elts = elts.rest) {
            if (test(elts.top))
                return elts.top;
        }
        return null;
    },
    has: function(x) {
        return Boolean(this.find(function(elt) { return elt === x; }));
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
})();
