# Need to build the snudown module

from __future__ import print_function

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
import traceback
import sys
import os
import json
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
noderenderers = {
      "emsnudown":
        "var rndr = require('../build/emsd.opt.js').emsnudown.render;"
        + noderender,
      "snuownd":
        "var prsr = require('./snuownd/snuownd.js').getParser();" +
        "var rndr = function (t) { return prsr.render(t); };" +
        noderender
    }

snudown = emsnudown = snuownd = None
sys.path.append("../snudown/build/lib.linux-i686-2.7")
import snudown

def preprenderers(src=noderenderers):

    emsnudown = Popen(["node", "-e", src["emsnudown"]
        ], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    snuownd = Popen(["node", "-e", src["snuownd"]
        ], stdin=PIPE, stdout=PIPE, stderr=PIPE)

    return { "emsnudown": emsnudown, "snuownd": snuownd }

def killrenderers(renderers):
    for renderer in renderers:
        try:
            renderer.kill()
        except:
            pass

def nodesend(renderer, txt):
    renderer.stdin.write(txt + "\n")
    renderer.stdin.flush()
def nodereceive(renderer):
    length = int(renderer.stdout.read(8))
    return renderer.stdout.read(length)

def renderwith(renderer, body):
    body_utf8 = _force_utf8(body)
    if renderer is snudown:
        return snudown.markdown(body_utf8)
    nodesend(renderer, body_utf8)
    return nodereceive(renderer)

# Check that the output of rendering
def check_equal(body):
    # SNUDOWN
    snudown_out = renderwith(snudown, body)
    # EMSNUDOWN
    emsnudown_out = renderwith(emsnudown, body)
    # SNUOWND
    snuownd_out = renderwith(snuownd, body)
    try:
        assert snudown_out == emsnudown_out == snuownd_out
        return (True, snudown_out)
    except:
        err = ""
        err += "================\n"
        err += "=== BODY:\n"
        err += _force_utf8(body) + "\n"
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
# Minimal differing examples
# ============
def differing_test():
    print("DIFFERING\n")
    fail = 0
    success = 0
    differs = json.load(open("differing.test"))
    for key in differs.values():
        equal, result = check_equal(key)
        if equal:
            success += 1
        else:
            print(result)
            fail += 1

    print("FAIL: " + str(fail))
    print("SUCCESS: " + str(success))
    if success > 0:
        print("SUCCESSES IN DIFFERING TESTS")

# ============
# Real comment tests
# ============
def comments_test():
    print("COMMENTS\n")
    fail = 0
    success = 0
    skip = 0
    filename = "emsnudown_tests/2013-06-27_HOUR-21"
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
                log.write(result)
                log.write("\n")
            sys.stdout.flush()
    log.close()
    print("")
    print("FAIL: " + str(fail))
    print("SUCCESS: " + str(success))
    print("")

# ============
# Benchmark tests
# ============
# TODO: restore the 'batched' test from commit 0a664c4?
import timeit
def benchmark_test(requested_benches=None):
    print("BENCHMARK\n")

    # Benchmark rendering a set of full comments
    def bench_comments(renderer, cases):
        x = None
        for case in cases:
            x = renderwith(renderer, case)

    # Benchmark a single comment
    def bench_comment(renderer, case, number=500):
        x = None
        for i in range(0, number):
            x = renderwith(renderer, case)

    nodeinit = """
        var rndr;
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function (d) {
          var num = parseInt(d);
          var txt = 'done';
          for (var i = 0; i < num; i++) { init(); }
          var pre = ('        ' + Buffer.byteLength(txt, 'utf8')).slice(-8);
          process.stdout.write(pre + txt);
        });
        """
    nodeinits = {
          "emsnudown": """
            function init () {
                rndr = require('../build/emsd.opt.js').emsnudown.render;
            }""" + nodeinit,
          "snuownd": """
            function init () {
                rndr = require('./snuownd/snuownd.js').getParser().render;
            }""" + nodeinit
        }
    def bench_init(renderer, num):
        nodesend(renderer, str(num))
        assert nodereceive(renderer) == "done"

    def format_results(results, iterations):
        results = { k: float(v) for k, v in results.items() }
        result_str = ""
        if "snudown" in results:
            result_str += " - Snudown   " + str(results["snudown"])[:8]
            result_str += " - " + str(results["snudown"]/iterations) + "\n"
        result_str += " - EmSnudown " + str(results["emsnudown"])[:8]
        result_str += " - " + str(results["emsnudown"]/iterations) + "\n"
        result_str += " - SnuOwnd   " + str(results["snuownd"])[:8]
        result_str += " - " + str(results["snuownd"]/iterations) + "\n"
        return result_str


    def initialisation_benchmark(num=200000):
        print("= Initialisation =")
        print(str(num) + " iterations")

        results = dict()
        inittest = preprenderers(nodeinits)
        print("Performing benchmark")
        try:
            results["emsnudown"] = timeit.timeit(
                lambda: bench_init(inittest["emsnudown"], num), number=1)
            results["snuownd"] = timeit.timeit(
                lambda: bench_init(inittest["snuownd"], num), number=1)
            print(format_results(results, num))
        finally:
            killrenderers(inittest.values())

    def real_comments_benchmark(num=100000):
        print("= Real comments =")

        filename = "emsnudown_tests/2013-06-27_HOUR-21"
        num_lines = sum(1 for line in open(filename))
        if num_lines < num:
            print("Warning: unable to find " + str(num) + " testcases,")
            print("         using " + str(num_lines) + " instead")
            num = num_lines
        print(str(num) + " iterations")
        cases = []

        print("Preparing comment test cases")
        with open(filename) as f:
            for i, line in enumerate(f.readlines()):
                if (i > num): break
                cases.append(json.loads(line)["body"])

        print("Performing benchmark")
        results = dict()
        results["snudown"] = timeit.timeit(
            lambda: bench_comments(snudown, cases), number=1)
        results["snuownd"] = timeit.timeit(
            lambda: bench_comments(snuownd, cases), number=1)
        results["emsnudown"] = timeit.timeit(
            lambda: bench_comments(emsnudown, cases), number=1)
        print(format_results(results, num))

    def custom_comments_benchmark(num=50000):
        print("= Custom cases =")
        print(str(num) + " iterations")

        custom_cases = [
            { "desc": "Short comment", "data": "hi" },
            { "desc": "Basic comment",
                "data": "This is a short comment\n\nAnd another line." },
            # 160 chars for the two below, joined 20 times = 3200 + 38
            { "desc": "Long comment", "data": "\n\n".join(
                [("\n\n".join(["aword qwer" for i in range(0, 16)]))
                  for i in range(0,20)]) },
            { "desc": "Complex comment", "data": "\n\n".join(
                [("*A* **more** __com_plex__ `comment`\n\n" +
                  " - abc\n - bcd\n - cde\n\ngap ln\n\n    code" +
                  "\n    cdln\n\n1. nu\n2. mb\n3. er\n\n" +
                  "[and now](http://forsome.thing/completely) /r/different")
                  for i in range(0,20)]) }
        ]

        results = dict()
        print("Performing benchmark")
        for case in custom_cases:
            print(case["desc"])
            results["snudown"] = timeit.timeit(
                lambda: bench_comment(snudown,   case["data"], num), number=1)
            results["emsnudown"] = timeit.timeit(
                lambda: bench_comment(emsnudown, case["data"], num), number=1)
            results["snuownd"] = timeit.timeit(
                lambda: bench_comment(snuownd,   case["data"], num), number=1)
            print(format_results(results, num))

    benches = {
        "initialisation": initialisation_benchmark,
        "real_comments": real_comments_benchmark,
        "custom_comments": custom_comments_benchmark
    }
    error = False
    to_bench = dict()
    if requested_benches is None:
        error = True
    else:
        for bench in requested_benches:
            bench = bench.split("=")
            if bench[0] not in benches:
                error = True
                print("Unrecognised bench - " + bench[0])
            elif len(bench) > 2 or (len(bench) == 2 and not bench[1].isdigit()):
                error = True
                print("Invalid arguments for bench")
            else:
                num = int((len(bench) == 2 and bench[1])) or None
                to_bench[bench[0]] = num
    if error:
        print("Need to specify a combination of valid benches")
        print("Try one or more of " + ", ".join(benches.keys()))
        print("You may choose the number of iterations with 'bench=1234'")
    else:

        print("=== Preparing ===")
        if "real_comments" in to_bench or "custom_comments" in to_bench:
            print("Warming up renderers")

            devnull = open(os.devnull, 'w')
            tmpstdout = sys.stdout
            try:
                sys.stdout = devnull
                real_comments_benchmark(5000)
            except:
                sys.stdout = tmpstdout
                print(traceback.format_exc())
            finally:
                sys.stdout = tmpstdout
            devnull.close()

        print("")
        print("=== Benchmarking ===")
        for bench, num in to_bench.items():
            if num is None:
                benches[bench]()
            else:
                benches[bench](num)
    return

# ============
# Execute tests if called from command line
# ============
if __name__ == '__main__':
    options = {
        "sanity": sanity_test,
        "differing": differing_test,
        "comments": comments_test,
        "benchmark": benchmark_test
    }
    if len(sys.argv) > 2 and sys.argv[1] == "benchmark":
        try:
            renderers = preprenderers()
            emsnudown = renderers["emsnudown"]
            snuownd = renderers["snuownd"]
            options["benchmark"](sys.argv[2:])
        except:
            print(traceback.format_exc())
        finally:
            killrenderers([emsnudown, snuownd])
    elif len(sys.argv) == 2 and sys.argv[1] in options:
        try:
            renderers = preprenderers()
            emsnudown = renderers["emsnudown"]
            snuownd = renderers["snuownd"]
            options[sys.argv[1]]()
        except:
            print(traceback.format_exc())
        finally:
            killrenderers([emsnudown, snuownd])
    else:
        if (len(sys.argv) == 2):
            print("Operation not recognised")
        else:
            print("No operation specified or unrecognised arguments")
        print("Try one of " + ", ".join(options.keys()))

