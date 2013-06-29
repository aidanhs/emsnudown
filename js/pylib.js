mergeInto(LibraryManager.library, {
  // emscripten issue 704 - minfies calls to stringify if not object strings
  PyModule_AddIntConstant: function (m, name, value) {
    root[Module["Pointer_stringify"](name)] = value;
  },
  PyModule_AddStringConstant: function (m, name, value) {
    root[Module["Pointer_stringify"](name)] = Module["Pointer_stringify"](value);
  }
});
