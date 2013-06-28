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

# Actual test
import json
import snudown
import subprocess

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
    snudown_out = snudown.markdown(body_utf8)
    emsnudown_out = subprocess.check_output([
        "node", "-p",
        "require('../build/emsd.opt.js').snudown.convert(process.argv[1]);",
        body_utf8
        ])[:-1] # Get rid of trailing newline
    try:
      assert snudown_out == emsnudown_out
      success += 1
    except:
      print "============"
      print "=== BODY:"
      print body_utf8
      print "=== SNUDOWN:"
      print snudown_out
      print "=== EMSNUDOWN:"
      print emsnudown_out
      print "============"
      fail += 1

print "FAIL: " + str(fail)
print "SUCCESS: " + str(success)
