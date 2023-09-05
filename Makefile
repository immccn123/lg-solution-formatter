all:
	@cp lib/lg-solution-formatter.cjs lg-solution-formatter.cjs
	@uglifyjs --comments '/\*[^\0]+?Copyright[^\0]+?\*/' -o lg-solution-formatter.min.js lib/lg-solution-formatter.cjs

clean:
	@rm lg-solution-formatter.cjs
	@rm lg-solution-formatter.min.js

bench:
	@node test --bench

man/lg-solution-formatter.1.txt:
	groff -man -Tascii man/lg-solution-formatter.1 | col -b > man/lg-solution-formatter.1.txt

.PHONY: clean all
