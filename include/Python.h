#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "buffer.h"

typedef void *PyCFunction;

/*
 * ============
 * Lift some defs from official Python.h
 * ============
 */
#define PyDoc_STRVAR(name,str) static char name[] = str
#define METH_VARARGS  0x0001
#define METH_KEYWORDS 0x0002
struct PyMethodDef {
    const char  *ml_name; /* The name of the built-in function/method */
    PyCFunction  ml_meth; /* The C function that implements it */
    int    ml_flags;  /* Combination of METH_xxx flags, which mostly
           describe the args expected by the C func */
    const char  *ml_doc;  /* The __doc__ attribute, or NULL */
};
typedef struct PyMethodDef PyMethodDef;

/*
 * ============
 * Shims for Python.h types and variables and globals for making shims simpler
 * ============
 */
// TODO: need to call this on initialisation of emscript automatically
typedef void PyMODINIT_FUNC;

// 'Empty' datatype to represent a PyObject. This is because we don't actually
// do anything with them in our shims, but they do get passed around so we make
// them really simple.
typedef const int PyObject;
// As we dont do anything with them, may as well only initialise once.
static PyObject emscript_module = 0;
static PyObject outobj = 0;
static PyObject self = 0;
static PyObject args = 0;
static PyObject kwargs = 0;

// TODO: don't use globals, but fine for now because typing a comment
// is single threaded (need to make sure we only have one call going on at a time).
static struct {
  struct buf *text;
  int arg_nofollow;      int nofollow;
  int arg_target;        char *target;
  int arg_toc_id_prefix; char *toc_id_prefix;
  int arg_renderer;      int renderer;
  int arg_enable_toc;    int enable_toc;
} renderargs;

static struct buf *outstring;

/*
 * ============
 * Shims around Python.h methods
 * ============
 */
// This represents the initialisation of the snudown module. Since we're
// shimming most things there's very little point properly initialising all
// the metadata.
// TODO: export function(s) listed in PyMethodDef automatically
static PyObject *Py_InitModule3(char *name, PyMethodDef *methods, char *doc) {
  return &emscript_module;
}

// TODO: print type as well
#define PyErr_SetString(type,str) printf(str)

// The following two methods do add items to the module object as some
// information is important (i.e. renderers). The functions are implemented in
// js/pylib.js.
extern void PyModule_AddIntConstant(PyObject *o, char *name, int value);
extern void PyModule_AddStringConstant(PyObject *o, char *name, char *value);

// BuildValue should create a python object. In snudown it's only used to build
// the string to return. We can skip all that by just putting it in our global
// variable and return it from there.
// TODO: check valid fmt string at compile time, for now just assume s#
// http://stackoverflow.com/questions/11632219/c-preprocessor-macro-specialisation-based-on-an-argument
static PyObject *Py_BuildValue(const char *fmt, const char *str, int size) {
  if (strcmp("s#", fmt) != 0) { exit(1); }
  bufput(outstring, str, size);
  return &outobj;
}

// Get all the arguments from the python (kw)args object. For now, just leave
// options as default so we just render the actual text, no fussing.
// TODO: actually might need different arguments, but we definitely don't want
// to do it properly. Maybe a global struct to hold the arguments?
static int PyArg_ParseTupleAndKeywords(PyObject *args, PyObject *kwargs, char *fmt, char *kwlist[], uint8_t **data, size_t *size, int *nofollow, char **target, char **toc_id_prefix, int *renderer, int *enable_toc) {
  *data = renderargs.text->data;
  *size = renderargs.text->size;
  if (renderargs.arg_nofollow)      { *nofollow = renderargs.nofollow; }
  if (renderargs.arg_target)        { *target = renderargs.target; }
  if (renderargs.arg_toc_id_prefix) { *toc_id_prefix = renderargs.toc_id_prefix; }
  if (renderargs.arg_renderer)      { *renderer = renderargs.renderer; }
  if (renderargs.arg_enable_toc)    { *enable_toc = renderargs.enable_toc; }
  return 1;
}

/*
 * ============
 * Custom functions, including the actual wrappers
 * ============
 */
// Functions needed for exports

void initsnudown(void);
static PyObject *snudown_md(PyObject *self, PyObject *args, PyObject *kwargs);

// EXPORTS

int main(void) {
  renderargs.text = bufnew(128);
  outstring = bufnew(128);
  initsnudown();
  return 0;
}

const char *render(
    char *text,
    int arg_nofollow,      int nofollow,
    int arg_target,        char *target,
    int arg_toc_id_prefix, char *toc_id_prefix,
    int arg_renderer,      int renderer,
    int arg_enable_toc,    int enable_toc) {

  outstring->size = 0;

  renderargs.text->size = 0;
  bufputs(renderargs.text, text);
  renderargs.arg_nofollow =      arg_nofollow;      renderargs.nofollow =      nofollow;
  renderargs.arg_target =        arg_target;        renderargs.target =        target;
  renderargs.arg_toc_id_prefix = arg_toc_id_prefix; renderargs.toc_id_prefix = toc_id_prefix;
  renderargs.arg_renderer =      arg_renderer;      renderargs.renderer =      renderer;
  renderargs.arg_enable_toc =    arg_enable_toc;    renderargs.enable_toc =    enable_toc;

  snudown_md(&self, &args, &kwargs);

  return bufcstr(outstring);
}




