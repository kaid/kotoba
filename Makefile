MOCHA = ./node_modules/mocha/bin/mocha

test:
	@$(MOCHA) --reporter dot --ui tdd test.js

.PHONY: test
