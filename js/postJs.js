    }
  };
  root.emscript();
  // TODO: call this lazily - won't use markdown on every page
  root['Module']['run']();
  root['Module']['callMain']();
  var renderWrap = root['Module']['cwrap']('render', 'string', [
    'string',          // text
    'number','number', // nofollow
    'number','string', // target
    'number','string', // toc_id_prefix
    'number','number', // renderer
    'number','number'  // enable_toc
  ]);
  root['render'] = function (text, opts) {
    if (opts === undefined) { opts = {}; }
    return renderWrap(text,
      opts['nofollow']      !== void 0 ? 1 : 0, opts['nofollow'],
      opts['target']        !== void 0 ? 1 : 0, opts['target'],
      opts['toc_id_prefix'] !== void 0 ? 1 : 0, opts['toc_id_prefix'],
      opts['renderer']      !== void 0 ? 1 : 0, opts['renderer'],
      opts['enable_toc']    !== void 0 ? 1 : 0, opts['enable_toc']);
  };
  return root;

  // The below doesn't work closure compiled, see emscripten issue 704
  //root.Module.run();
  //root.Module.callMain();
  //return root.Module.cwrap('sdify', 'string', ['string']);

})();
