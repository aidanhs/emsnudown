    }
  };
  root.emscript();
  // TODO: call this lazily - won't use markdown on every page
  root['Module']['run']();
  root['convert'] = root['Module']['cwrap']('convert', 'string', ['string']);
  return root;

  // The below doesn't work closure compiled, see emscripten issue 704
  //root.Module.run();
  //return root.Module.cwrap('sdify', 'string', ['string']);

})();
