
#ifndef EMSNUDOWN_SHIM
#define EMSNUDOWN_SHIM

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "buffer.h"

typedef void *PyCFunction;

/*
 * ============
 * Lift some defs verbatim from official Python.h
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

// Global struct to hold the arguments passed to the render call
// TODO: js is single threaded so global is fine
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
#define PyErr_SetString(type,str) printf("ERR: %s\n",str)

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

// Get all the arguments from the python (kw)args object. We shim this by
// putting all arguments into a global renderargs object and completely ignoring
// the args and kwargs arguments.
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

// Things from the sanitised we need to forward declate
static void init_sanitiser(void);

// EXPORTS

// Initialisation call
int main(void) {
  // Set up some global buffers to hold the in and out strings
  renderargs.text = bufnew(128);
  outstring = bufnew(128);
  // Get snudown to initialise renderers etc
  initsnudown();
  init_sanitiser();
  return 0;
}

// Actual rendering call
// arg_* indicate whether the argument value is present
const char *render(
    char *text,
    int arg_nofollow,      int nofollow,
    int arg_target,        char *target,
    int arg_toc_id_prefix, char *toc_id_prefix,
    int arg_renderer,      int renderer,
    int arg_enable_toc,    int enable_toc) {

  // Wipe the in and out string buffers
  outstring->size = 0;
  renderargs.text->size = 0;

  bufputs(renderargs.text, text);

  renderargs.arg_nofollow =      arg_nofollow;      renderargs.nofollow =      nofollow;
  renderargs.arg_target =        arg_target;        renderargs.target =        target;
  renderargs.arg_toc_id_prefix = arg_toc_id_prefix; renderargs.toc_id_prefix = toc_id_prefix;
  renderargs.arg_renderer =      arg_renderer;      renderargs.renderer =      renderer;
  renderargs.arg_enable_toc =    arg_enable_toc;    renderargs.enable_toc =    enable_toc;

  snudown_md(&self, &args, &kwargs);

  // TODO: find out how this works, does it ever get deallocated? Is it even
  // safe to do this?
  return bufcstr(outstring);
}

/*
 * HACKERY
 */

// Below here is a truly horrific level of hackery. Because snudown does not
// expose the tools we need to make a custom renderer without performing source
// modifications...we perform source modifications by including C files here
// and throwing the custom renderer onto the end. Note the files listed below
// must therefore NOT be passed to the compiler or we get duplicate symbols...
// Unfortunately it therefore stomps on the good intention of having a thin
// shim file that would 'just work' with significant snudown upgrades.

#include "snudown.c"
#include "html.c"
#include "html_smartypants.c"
#include "houdini_href_e.c"
#include "houdini_html_e.c"

/*
 * ============
 * Section specifically for RES, provides a HTML sanitiser
 * ============
 */
static struct sd_markdown *sanitiser;
static struct module_state sanit_state;
static char* sanit_html_element_whitelist[] = {
  "h1", "h2", "h3", "h4", "h5", "h6", "span", "div", "code",
  "br", "hr", "p", "a", "img", "pre", "blockquote", "table",
  "thead", "tbody", "tfoot", "tr", "th", "td", "strong", "em",
  "i", "b", "u", "ul", "ol", "li", "dl", "dt", "dd",
  "font", "center", "small", "s", "q", "sub", "sup", "del"
};
static char* sanit_html_attr_whitelist[] = {
  "href", "title", "src", "alt", "colspan",
  "rowspan", "cellspacing", "cellpadding", "scope",
  "face", "color", "size", "bgcolor", "align"
};
static void sanit_rndr_paragraph(struct buf *ob, const struct buf *text, void *opaque) {
  if (text->size != 0) { bufput(ob, text->data, text->size); }
}
// This function works like make_custom_renderer, but with tweaks and inlining
// of called functions to tweak them as well
static void init_sanitiser(void) {

  // This bit is inlined and adapted from from sdhtml_renderer in html.c

  static const struct sd_callbacks cb_default = {
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    sanit_rndr_paragraph,
    NULL,
    NULL,
    NULL,

    rndr_autolink,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    rndr_raw_html,
    NULL,
    NULL,
    NULL,

    NULL,
    NULL,

    NULL,
    NULL,
  };

  struct html_renderopt *options   = (struct html_renderopt *)&sanit_state.options;
  struct sd_callbacks   *callbacks = &sanit_state.callbacks;

  /* Prepare the options pointer */
  memset(options, 0x0, sizeof(struct html_renderopt));
  options->flags = snudown_wiki_render_flags;

  memcpy(callbacks, &cb_default, sizeof(struct sd_callbacks));

  // Resuming make_custom_renderer

  sanit_state.options.html.link_attributes = &snudown_link_attr;
  sanit_state.options.html.html_element_whitelist = sanit_html_element_whitelist;
  sanit_state.options.html.html_attr_whitelist = sanit_html_attr_whitelist;

  sanitiser = sd_markdown_new(
    snudown_default_md_flags,
    16,
    &sanit_state.callbacks,
    &sanit_state.options
  );

}
const char *sanitise(char *text) {

  // Wipe the in and out string buffers
  outstring->size = 0;
  renderargs.text->size = 0;

  bufputs(renderargs.text, text);

  renderargs.arg_nofollow =      0;
  renderargs.arg_target =        0;
  renderargs.arg_toc_id_prefix = 0;
  renderargs.arg_renderer =      0;
  renderargs.arg_enable_toc =    0;

  struct sd_markdown  *usertext;
  struct module_state *usertext_state;
  usertext       = sundown[RENDERER_USERTEXT].main_renderer;
  usertext_state = sundown[RENDERER_USERTEXT].state;
  sundown[RENDERER_USERTEXT].main_renderer = sanitiser;
  sundown[RENDERER_USERTEXT].state         = &sanit_state;

  snudown_md(&self, &args, &kwargs);

  sundown[RENDERER_USERTEXT].main_renderer = usertext;
  sundown[RENDERER_USERTEXT].state         = usertext_state;

  // TODO: find out how this works, does it ever get deallocated? Is it even
  // safe to do this?
  return bufcstr(outstring);
}

#endif
