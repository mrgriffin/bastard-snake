all :

check : check-direction

check-direction : www/js/direction.js test/unit-test.js test/direction.js
	js $(^:%=-f %)
