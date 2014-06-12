GENERATED_FILES = \
	tailspin.js \
	tailspin.min.js

all: $(GENERATED_FILES)

.PHONY: clean all test

tailspin.js:
	@rm -f $@
	bin/concat.js | uglifyjs - -b indent-level=2 -o $@
	@chmod a-w $@

tailspin.min.js:
	@rm -f $@
	bin/concat.js | bin/uglify.js > $@
	@chmod a-w $@

clean:
	rm -f -- $(GENERATED_FILES)
