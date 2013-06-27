EmSnudown
=========

EmSnudown is a collection of shims, wrappers and other bits and pieces to allow
[Snudown](http://github.com/reddit/snudown) to be compiled to JS by
[Emscripten](https://github.com/kripken/emscripten).

It is licensed under the same license (the ISC license) as Snudown.

Trying it out
-------------

Set up Emscripten as per
[these instructions](https://github.com/kripken/emscripten/wiki/Tutorial) to
the point where node runs the hello world program.

The makefile expects emcc to be accessible at `../emcc`, so edit the makefile or
make this the case.

Run `make`.

Open your browser and visit `build/emsd.opt.html` in your browser.

You can now play around by entering
```
snudown.convert("> Some\n\n[markdown](http://www.example.com)");
```
into your javascript console.

Build information
-----------------

`make` will generate four files by default.

`emsd.opt.*` files have optimisations
enabled so should be significantly smaller and faster than the other two. If
something is broken, it's possibly worth checking if it's an optimisation by
running with the non-optimised version.

`*.js` files are the core of the EmSnudown offer. In particular, you probably
want emsd.opt.js if you want to use EmSnudown in a project.
You should be able to try these files out in node.

`*.html` files are a wrapper around the `*.js` files, provided by Emscripten.
Only useful if you want to play around immediately with a build.