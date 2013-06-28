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
def test_equal(body_utf8):
    snudown_out = snudown.markdown(body_utf8)
    emsnudown = Popen([
        "node", "-p",
        "require('../build/emsd.opt.js').snudown.convert(" +
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
print "SANITY"
fail = 0
success = 0
sys.path.append("../snudown")
import test_snudown
for key in test_snudown.cases:
  equal, result = test_equal(key)
  if equal:
    assert result == test_snudown.cases[key]
    success += 1
  else:
    fail += 1

print "FAIL: " + str(fail)
print "SUCCESS: " + str(success)
if fail > 0:
  print "FAILED SANITY TESTS"
  #exit(1)

# ============
# Test a real set of comments
# ============
print "COMMENTS"
fail = 0
success = 0
#skip = 3300
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

