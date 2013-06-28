this['snudown'] = (function () {

  var root = {
    emscript: function () {
      var module = undefined;
      var Module = {
        'noInitialRun': true,
        'noExitRuntime': true,
        'preRun': [],
        'postRun': []
      };
