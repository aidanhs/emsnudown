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
        #break

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

  def bench_snuownd(cases_json):
    snuownd = Popen([
      "node", "-e",
      """
      var md = require('./snuownd/snuownd.js').getParser();
      var cases = JSON.parse(require('fs').readFileSync('/dev/stdin').toString());
      for (var i = 0, l = cases.length; i++; i < l) {
        md.render(cases[i]);
      }
      """
    ], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    snuownd.communicate(cases_json)

  def bench_emsnudown(cases_json):
    emsnudown = Popen([
      "node", "-e",
      """
      var md = require('../build/emsd.opt.js');
      var cases = JSON.parse(require('fs').readFileSync('/dev/stdin').toString());
      for (var i = 0, l = cases.length; i++; i < l) {
        md.convert(cases[i]);
      }
      """
    ], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    emsnudown.communicate(cases_json)

  print "RUNNING"
  print "Testing initialisation speed"
  print "SnuOwnd ",
  print timeit.timeit(lambda: bench_snuownd(json.dumps([])), number=100)
  print "EmSnudown ",
  print timeit.timeit(lambda: bench_emsnudown(json.dumps([])), number=100)
  print "Testing medium number of renders"
  print "SnuOwnd ",
  print timeit.timeit(lambda: bench_snuownd(json.dumps(cases[:600])), number=70)
  print "EmSnudown ",
  print timeit.timeit(lambda: bench_emsnudown(json.dumps(cases[:600])), number=70)
  print "Testing large number of renders"
  print "SnuOwnd ",
  print timeit.timeit(lambda: bench_snuownd(json.dumps(cases[:30000])), number=20)
  print "EmSnudown ",
  print timeit.timeit(lambda: bench_emsnudown(json.dumps(cases[:30000])), number=20)
  pass


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
