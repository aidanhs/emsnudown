this['snudown'] = (function () {

  var root = {
    emscript: function () {
      // Prevent emscripten detecting nodejs, as otherwise it breaks?
      var module = undefined;
      var Module = {
        'noInitialRun': true,
        'noExitRuntime': true,
        'preRun': [],
        'postRun': []
      };
