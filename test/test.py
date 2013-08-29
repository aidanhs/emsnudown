# Get data for this from
# http://www.reddit.com/r/redditdev/comments/1h1wqu/anonymous_ftp_access_for_reddit_comment_data_is/
# Need to build the snudown module

from __future__ import print_function

import sys
sys.path.append("../snudown/build/lib.linux-i686-2.7")

# ============
# Functions needed from reddit to load comment JSON
# ============
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

# ============
# Utility functions
# ============


noderender = """
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (d) {
      var txt = rndr(d);
      var pre = ('        ' + Buffer.byteLength(txt, 'utf8')).slice(-8);
      process.stdout.write(pre + txt);
    });
    """

emsnudown = snuownd = None

def preprenderers():
    global emsnudown
    global snuownd
    emsnudown = Popen(["node", "-e",
        "var rndr = require('../build/emsd.opt.js').snudown.render;" +
        noderender
        ], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    snuownd = Popen(["node", "-e",
        "var prsr = require('./snuownd/snuownd.js').getParser();" +
        "var rndr = function (t) { return prsr.render(t); };" +
        noderender
        ], stdin=PIPE, stdout=PIPE, stderr=PIPE)

def killrenderers():
    emsnudown.kill()
    snuownd.kill()

def renderwith(process, body):
    process.stdin.write(body + "\n")
    process.stdin.flush()
    length = int(process.stdout.read(8))
    return process.stdout.read(length)

# Check that the output of rendering
def check_equal(body):
    body_utf8 = _force_utf8(body)
    # SNUDOWN
    snudown_out = snudown.markdown(body_utf8)
    # EMSNUDOWN
    emsnudown_out = renderwith(emsnudown, body_utf8)
    # SNUOWND
    snuownd_out = renderwith(snuownd, body_utf8)
    try:
        assert snudown_out == emsnudown_out == snuownd_out
        return (True, snudown_out)
    except:
        err = ""
        err += "================\n"
        err += "=== BODY:\n"
        err += body_utf8 + "\n"
        err += "=== SNUDOWN:\n"
        err += snudown_out + "\n"
        err += "=== EMSNUDOWN:\n"
        err += emsnudown_out + "\n"
        err += "=== SNUOWND:\n"
        err += snuownd_out + "\n"
        err += "================\n"
        return (False, err)

# ============
# Sanity tests
# ============
def sanity_test():
    print("SANITY\n")
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
            print(result)
            fail += 1

    print("FAIL: " + str(fail))
    print("SUCCESS: " + str(success))
    if fail > 0:
        print("ERRORS IN SANITY TESTS")

# ============
# Real comment tests
# ============
def comments_test():
    print("COMMENTS\n")
    fail = 0
    success = 0
    skip = 0
    filename = "commentdata/2013-06-27_HOUR-21"
    log = open("comments.test.log", "w")
    with open(filename) as f:
        for i, line in enumerate(f.readlines()):
            if (i < skip): continue
            body = json.loads(line)["body"]
            equal, result = check_equal(body)
            if equal:
                print(".", end="")
                success += 1
            else:
                print("F", end="")
                fail += 1
                log.write("Comment " + str(i) + "\n")
                log.write(err)
                log.write("\n")
            sys.stdout.flush()
    log.close()
    print("FAIL: " + str(fail))
    print("SUCCESS: " + str(success))
    print("")

# ============
# Benchmark tests
# ============
# TODO: update to use long running processes
import timeit
def benchmark_test():
    print("BENCHMARK\n")
    max_num = 10000000
    filename = "commentdata/2013-06-27_HOUR-21"
    num_lines = sum(1 for line in open(filename))
    if num_lines < max_num: max_num = num_lines
    cases = []

    print("PREPARING")
    with open(filename) as f:
        for i, line in enumerate(f.readlines()):
            if (i > max_num): break
            cases.append(json.loads(line)["body"])

    # Boilerplate we execute in all cases
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
            "var render = require('./snuownd/snuownd.js').getParser().render;" +
            boiler_bench
        ], stdin=PIPE, stdout=PIPE, stderr=PIPE)
        out, err = snuownd.communicate(cases_json)
        assert out == "done\n"
        assert err == ""

    def bench_emsnudown(cases_json):
        emsnudown = Popen([
            "node", "-e",
            "var render = require('../build/emsd.opt.js').render;" +
            boiler_bench
        ], stdin=PIPE, stdout=PIPE, stderr=PIPE)
        out, err = emsnudown.communicate(cases_json)
        assert out == "done\n"
        assert err == ""

    benches = [
        { "desc": "Initialisation speed",     "data": [],            "num": 100 },
        { "desc": "Medium number of renders", "data": cases[:600],   "num": 70  },
        { "desc": "Large number of renders",  "data": cases[:30000], "num": 20  }
    ]
    print("RUNNING")
    for bench in benches:
        print(bench["desc"])
        json_data = json.dumps(bench["data"])
        print("SnuOwnd " + str(timeit.timeit(
            lambda: bench_snuownd(json_data), number=bench["num"])))
        print("EmSnudown " + str(timeit.timeit(
            lambda: bench_emsnudown(json_data), number=bench["num"])))

# ============
# Execute tests if called from command line
# ============
if __name__ == '__main__':
    options = {
        "sanity": sanity_test,
        "comments": comments_test,
        "benchmark": benchmark_test
    }
    if len(sys.argv) == 2 and sys.argv[1] in options:
        try:
            preprenderers()
            options[sys.argv[1]]()
        finally:
            killrenderers()
    else:
        if (len(sys.argv) == 2):
            print("Operation not recognised")
        else:
            print("Need to specify an operation")
        print("Try one of " + ", ".join(options.keys()))

