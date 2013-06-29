mergeInto(LibraryManager.library, {
  PyModule_AddIntConstant: function (m, name, value) {
    root[Module.Pointer_stringify(name)] = value;
  },
  PyModule_AddStringConstant: function (m, name, value) {
    root[Module.Pointer_stringify(name)] = Module.Pointer_stringify(value);
  }
});
