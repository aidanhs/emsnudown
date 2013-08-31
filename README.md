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
make this the case. Tests have been performed with *commit 1cc28b8e9e9* of
emscripten - while the emscripten project asserts that main is always stable,
that doesn't guarantee there will be no breaking changes.

Run `make`.

Open your browser and visit `build/emsd.opt.html` in your browser.

You can now play around by entering
```
snudown.render("> Some\n\n[markdown](http://www.example.com)");
```
into your javascript console.

You can also use the optional keyword arguments from the python module by
passing an object as the second argument, e.g.
```
snudown.render(
  "Title\n=====\n\n" +
  "[a link](http://example.com)" +
  "<table><tbody><tr><td>a</td></tr><tr><td>b</td></tr></tbody></table>",
  { renderer: snudown.RENDERER_WIKI, enable_toc: true, toc_id_prefix: "abcd" }
);
```

See snudown documentation for information on optional arguments.

Run the tests
-------------

Emsnudown comes with an extensive test suite. To run it you must be in the
`test` directory and run `python test.py`. Available suites are:
 - `sanity` - directly uses the snudown test suite
 - `comments` - uses a set of real comments from reddit from the `commentdata`
   directory. Failures are logged to `comments.test.log` so you can inspect them.
 - `differing` - a manually curated set of minimal failing comments
   (see the `differing.test` file)
 - `benchmark` - for benchmarking snudown implementations. It provides:
   - `initialisation` - to see how fast the implementations are to start
   - `real_comments` - a set of real comments, as per the `comments` test
   - `custom_comments` - a manually created set of comments for testing the
     implementations in different scenarios

Build information
-----------------

`make` will generate six files by default.

`emsd.opt.*` files have optimisations
enabled so should be significantly smaller and faster than the other four. If
something is broken, it's possibly worth checking if it's an optimisation by
running with the non-optimised version.

`emsd.chk.*` files have additional checks and assertions enabled and should
be useful for debugging (maybe).

emsd.* (i.e. not chk or opt) are produced by the default emscripten options.

`*.js` files are the core of the EmSnudown offer. In particular, you probably
want emsd.opt.js if you want to use EmSnudown in a project.
You should be able to try these files out in node.

`*.html` files are a wrapper around the `*.js` files, provided by Emscripten.
Only useful if you want to play around immediately with a build.

Plans
-----

 - A fuzzer tester would be cool.
 - Test page (+ in browser benchmarking).
