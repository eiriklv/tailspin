Tailspin
========

Tailspin is a fully reversible Javascript interpreter written in Javascript (meta-circular). It is almost fully standards-compliant and is written in continuation passing style which allows the interpretation of code to be paused and controlled.

Tailspin is based on the [Narcissus](https://github.com/mozilla/narcissus) Javascript interpreter.

It was built to provide the basis for interesting web-based programming explorations, visualisations and puzzles.

e.g.
http://will.thimbleby.net/js-problems/
http://will.thimbleby.net/algorithms/

ES5.1 Compliance
---------------

Tailspin currently passes 99% of the ECMAScript Language test262 test suite.

Reversibility
------------

Tailspin is able to run in a reversible mode, where state changes are recorded so that they can be undone, compared to the non-revsersible mode this is slightly slower and uses more memory.

In reversible mode almost all state changes can be undone. Some state changes such as Object.freeze() and Object.seal() are not reversible as Tailspin uses the host runtime's Javascript objects and the effect of these functions is permanent.

Sandboxing
----------

Tailspin utilises the host's Javascript object implementations and thus polluting the host environment is possible. However when running in a browser, tailspin creates an isolated iframe to provide sandboxed object implementations.

Usage
-----

Basic usage for creating an interpreter and running `source`:

```var tailspin = new Interpreter();

// Create an evaluation context that describes the how the code is to be executed.
var x = tailspin.createExecutionContext();

// Run the code.
tailspin.evaluateInContext(source, "console", 0, x, function(result) {
    console.log(result);
}, function(result) {
    console.log("ERROR "+ result);
}, null);
```