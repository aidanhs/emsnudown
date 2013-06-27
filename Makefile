PREFIX=emsd
FILES=snudown/snudown.c snudown/src/*.c snudown/html/*.c
INC=-Isnudown/html -Isnudown/src -Iinclude
EMCC=../emscripten/emcc
EMFLAGS=-s EXPORTED_FUNCTIONS="['_main','_convert']" --pre-js js/preJs.js --post-js js/postJs.js
OPTFLAGS=-O2 --llvm-opts 3 --llvm-lto 1 --closure 1 -s CLOSURE_ANNOTATIONS=1 -s RELOOP=1

.PHONY: all clean js html opt.js opt.html

all: js html opt.js opt.html

.SECONDEXPANSION:
js html opt.js opt.html: build/$(PREFIX).$$@

clean:
	rm -f build/*

build/$(PREFIX).html build/$(PREFIX).js: $(FILES)
	$(EMCC) $(FILES) $(INC) $(EMFLAGS) -o $@
build/$(PREFIX).opt.js build/$(PREFIX).opt.html: $(FILES)
	$(EMCC) $(FILES) $(INC) $(EMFLAGS) $(OPTFLAGS) -o $@

# I don't think I should have to touch the file to make this work
snudown/snudown.c: include/Python.h js/*.js
	touch snudown/snudown.c

