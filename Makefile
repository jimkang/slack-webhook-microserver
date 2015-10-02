test:
	node tests/integration/basic-tests.js

pushall:
	git push origin master && npm publish

