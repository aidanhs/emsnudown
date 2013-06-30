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
  root['render'] = function (text, options) {
    if (options === undefined) { options = {}; }
    return renderWrap(text,
      options.nofollow      !== undefined ? 1 : 0, options.nofollow,
      options.target        !== undefined ? 1 : 0, options.target,
      options.toc_id_prefix !== undefined ? 1 : 0, options.toc_id_prefix,
      options.renderer      !== undefined ? 1 : 0, options.renderer,
      options.enable_toc    !== undefined ? 1 : 0, options.enable_toc);
  };
  return root;

  // The below doesn't work closure compiled, see emscripten issue 704
  //root.Module.run();
  //root.Module.callMain();
  //return root.Module.cwrap('sdify', 'string', ['string']);

})();
