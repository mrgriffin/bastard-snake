all :

check : check-direction

check-direction : www/js/direction.js www/js/unit-test.js www/js/test-direction.js
	js $(^:%=-f %)
