#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "buffer.h"

typedef void *PyCFunction;

// Lift some defs from official Python.h
// TODO: export function(s) listed in PyMethodDef automatically
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

// TODO: print type as well
#define PyErr_SetString(type,str) printf(str)

// TODO: need to call this on initialisation of emscript automatically
typedef void PyMODINIT_FUNC;

// TODO: pure js implementation, this is just a js object
// TODO: don't statically size arrays...though if moving to js object
//       it possibly doesn't matter
static const int STR_SIZE = 20;
static const int OBJ_SIZE = 5;
enum h_type {
  INT = 0,
  STR
};
struct h_tuple {
  char name[STR_SIZE];
  int type;

  union {
    int int_v;
    struct buf *str_v;
  } value;
};
struct h_dict {
  struct h_tuple keyvals[OBJ_SIZE];
  int keyval_length;
};
typedef struct h_dict PyObject;

// TODO: shouldn't really have one global, but speed?
static PyObject emscript_module = { .keyval_length = 0 };
static PyObject *Py_InitModule3(char *name, PyMethodDef *methods, char *doc) {
  return &emscript_module;
}
static void PyModule_AddIntConstant(PyObject *o, char *name, int value) {
  strcpy(o->keyvals[o->keyval_length].name, name);
  o->keyvals[o->keyval_length].value.int_v = value;
  o->keyvals[o->keyval_length].type = INT;
  o->keyval_length++;
}
static void PyModule_AddStringConstant(PyObject *o, char *name, char *value) {
  strcpy(o->keyvals[o->keyval_length].name, name);
  o->keyvals[o->keyval_length].value.str_v = bufnew(strlen(value));
  bufputs(o->keyvals[o->keyval_length].value.str_v, value);
  o->keyvals[o->keyval_length].type = STR;
  o->keyval_length++;
}

// TODO: don't use globals, but fine for now because single threaded
static struct buf *instring;
static struct buf *outstring;

// Ideally would check valid fmt string at compile time, for now just assume s#
// http://stackoverflow.com/questions/11632219/c-preprocessor-macro-specialisation-based-on-an-argument
static PyObject *Py_BuildValue(const char *fmt, const char *str, int size) {
  if (strcmp("s#", fmt) != 0) { exit(1); }

  bufput(outstring, str, size);

  PyObject *obj = malloc(sizeof(PyObject));
  return obj;
}

static int PyArg_ParseTupleAndKeywords(PyObject *args, PyObject *kwargs, char *fmt, char *kwlist[], uint8_t **data, size_t *size, int *nofollow, char **target, char **toc_id_prefix, int *renderer, int *enable_toc) {
  *data = instring->data;
  *size = instring->size;
  return 1;
}

// Functions needed for exports

void initsnudown(void);
static PyObject *snudown_md(PyObject *self, PyObject *args, PyObject *kwargs);

// EXPORTS

int main(void) {
  instring = bufnew(128);
  outstring = bufnew(128);
  initsnudown();
  return 0;
}

const char *convert(char *text) {
  instring->size = 0;
  outstring->size = 0;
  bufputs(instring, text);
  PyObject self;
  PyObject args;
  PyObject kwargs;

  PyObject *res = snudown_md(&self, &args, &kwargs);
  free(res);

  return bufcstr(outstring);
}




