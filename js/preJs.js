this['snudown'] = (function () {

  var root = {
    emscript: function () {
      // Cripple emscripten's attempts to pollute global namespace
      // under nodejs
      var module = {};
      var Module = {
        'noInitialRun': true,
        'noExitRuntime': true,
        'preRun': [],
        'postRun': []
      };
