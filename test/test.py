# Get data for this from
# http://www.reddit.com/r/redditdev/comments/1h1wqu/anonymous_ftp_access_for_reddit_comment_data_is/
# Need to build the snudown module

import sys
sys.path.append("../snudown/build/lib.linux-i686-2.7")

# Some functions we need from reddit
def _force_unicode(text):
    if text == None:
        return u''

    if isinstance(text, unicode):
        return text

    try:
        text = unicode(text, 'utf-8')
    except UnicodeDecodeError:
        text = unicode(text, 'latin1')
    except TypeError:
        text = unicode(text)
    return text

def _force_utf8(text):
      return str(_force_unicode(text).encode('utf8'))

import tempfile
import json
import snudown
from subprocess import PIPE, Popen

# Utility functions
def check_equal(body_utf8):
    snudown_out = snudown.markdown(body_utf8)
    emsnudown = Popen([
        "node", "-p",
        "require('../build/emsd.opt.js').snudown.render(" +
          "require('fs').readFileSync('/dev/stdin').toString()" +
        ");"
        ], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    emsnudown_out, err = emsnudown.communicate(body_utf8)
    emsnudown_out = emsnudown_out[:-1] # Get rid of trailing newline
    snuownd = Popen([
        "node", "-p",
        "require('./snuownd/snuownd.js').getParser().render(" +
          "require('fs').readFileSync('/dev/stdin').toString()" +
        ");"
        ], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    snuownd_out, err = snuownd.communicate(body_utf8)
    snuownd_out = snuownd_out[:-1] # Get rid of trailing newline
    try:
      assert snudown_out == emsnudown_out == snuownd_out
      return (True, snudown_out)
    except:
      print "============"
      print "=== BODY:"
      print body_utf8
      print "=== SNUDOWN:"
      print snudown_out
      print "=== EMSNUDOWN:"
      print emsnudown_out
      print "=== SNUOWND:"
      print snuownd_out
      print "============"
      return (False, None)

# ============
# Sanity tests
# ============
def sanity_test():
  print "SANITY"
  fail = 0
  success = 0
  sys.path.append("../snudown")
  import test_snudown
  for key in test_snudown.cases:
    equal, result = check_equal(key)
    if equal:
      assert result == test_snudown.cases[key]
      success += 1
    else:
      fail += 1

  print "FAIL: " + str(fail)
  print "SUCCESS: " + str(success)
  if fail > 0:
    print "FAILED SANITY TESTS"

# ============
# Test a real set of comments
# ============
def comments_test():
  print "COMMENTS"
  fail = 0
  success = 0
  skip = 0
  filename = "commentdata/2013-06-27_HOUR-21"
  num_lines = sum(1 for line in open(filename))
  with open(filename) as f:
    for i, line in enumerate(f.readlines()):
      if (i < skip): continue
      print "PROCESSING COMMENT " + str(i) + " OF " + str(num_lines)
      body_utf8 = _force_utf8(json.loads(line)["body"])
      equal, result = check_equal(body_utf8)
      if equal:
        success += 1
      else:
        fail += 1
        break

# ============
# Benchmarking
# ============
import timeit
def benchmark_test():
  print "BENCHMARK"
  max_num = 10000000
  filename = "commentdata/2013-06-27_HOUR-21"
  num_lines = sum(1 for line in open(filename))
  if num_lines < max_num: max_num = num_lines
  cases = []

  print "PREPARING"
  with open(filename) as f:
    for i, line in enumerate(f.readlines()):
      if (i > max_num): break
      cases.append(_force_utf8(json.loads(line)["body"]))

  boiler_bench = """
    var cases = JSON.parse(require('fs').readFileSync('/dev/stdin').toString());
    var x = []; x.length = cases.length;
    for (var i = 0, l = cases.length; i++; i < l) {
      x[i] = render(cases[i]);
    }
    console.log("done");
    """
  def bench_snuownd(cases_json):
    snuownd = Popen([
      "node", "-e",
      "var render = require('./snuownd/snuownd.js').getParser().render;" + boiler_bench
    ], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    out, err = snuownd.communicate(cases_json)
    assert out == "done\n"
    assert err == ""

  def bench_emsnudown(cases_json):
    emsnudown = Popen([
      "node", "-e",
      "var render = require('../build/emsd.opt.js').render;" + boiler_bench
    ], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    out, err = emsnudown.communicate(cases_json)
    assert out == "done\n"
    assert err == ""

  benches = [
      { "desc": "Initialisation speed",     "data": [],            "num": 100 },
      { "desc": "Medium number of renders", "data": cases[:600],   "num": 70  },
      { "desc": "Large number of renders",  "data": cases[:30000], "num": 20  }
  ]
  print "RUNNING"
  for bench in benches:
    print bench["desc"]
    json_data = json.dumps(bench["data"])
    print "SnuOwnd " + str(timeit.timeit(
      lambda: bench_snuownd(json_data), number=bench["num"]))
    print "EmSnudown " + str(timeit.timeit(
      lambda: bench_emsnudown(json_data), number=bench["num"]))


if __name__ == '__main__':
  options = {
    "sanity": sanity_test,
    "comments": comments_test,
    "benchmark": benchmark_test
  }
  if sys.argv[1] in options:
    options[sys.argv[1]]()
  else:
    print "Operation not recognised"
