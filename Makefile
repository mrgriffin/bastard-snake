all :

check : check-fixtures check-direction

check-fixtures : test/unit-test.js test/fixtures.js
	js $(^:%=-f %)

check-direction : www/js/direction.js test/unit-test.js test/direction.js
	js $(^:%=-f %)
