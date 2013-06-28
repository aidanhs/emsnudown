PREFIX=emsd
FILES=snudown/snudown.c snudown/src/*.c snudown/html/*.c
INC=-Isnudown/html -Isnudown/src -Iinclude
EMCC=../emscripten/emcc
EMFLAGS=-s EXPORTED_FUNCTIONS="['_main','_convert']" --pre-js js/preJs.js --post-js js/postJs.js
# TODO: chk: -s CHECK_SIGNS=1, opt: -s CORRECT_SIGNS=0
# -s CORRECT_OVERFLOWS=0 overridden by asm.js generation
OPTFLAGS=\
          -O2\
          --llvm-opts 3\
          --llvm-lto 1\
          --closure 1\
          -s PRECISE_I32_MUL=0\
          -s DOUBLE_MODE=0\
          -s PRECISE_I64_MATH=0\
          -s FORCE_ALIGNED_MEMORY=1\
          -s CLOSURE_ANNOTATIONS=1\
          -s RELOOP=1\
          -s CORRECT_ROUNDINGS=0
CHKFLAGS=
          -s ASSSERTIONS=2\
          -s SAFE_HEAP=1\
          -s CHECK_HEAP_ALIGN=1\
          -s CHECK_OVERFLOWS=1\
          -s CHECK_SIGNED_OVERFLOWS=1

.PHONY: all clean js html chk.js chk.html opt.js opt.html

all: js html chk.js chk.html opt.js opt.html

.SECONDEXPANSION:
js html chk.js chk.html opt.js opt.html: build/$(PREFIX).$$@

clean:
	rm -f build/*

build/$(PREFIX).html build/$(PREFIX).js: $(FILES)
	$(EMCC) $(FILES) $(INC) $(EMFLAGS) -o $@
build/$(PREFIX).chk.html build/$(PREFIX).chk.js: $(FILES)
	$(EMCC) $(FILES) $(INC) $(EMFLAGS) $(CHKFLAGS) -o $@
build/$(PREFIX).opt.js build/$(PREFIX).opt.html: $(FILES)
	$(EMCC) $(FILES) $(INC) $(EMFLAGS) $(OPTFLAGS) -o $@

# I don't think I should have to touch the file to make this work
snudown/snudown.c: include/Python.h js/*.js
	touch snudown/snudown.c

