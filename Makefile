all :

check : check-fixtures check-direction check-entity check-room check-snake

check-fixtures : test/unit-test.js test/fixtures.js
	js $(^:%=-f %)

check-direction : www/js/direction.js test/unit-test.js test/direction.js
	js $(^:%=-f %)

check-entity : www/js/entity.js test/unit-test.js test/entity.js
	js $(^:%=-f %)

check-room : www/js/entity.js www/js/room.js test/unit-test.js test/room.js
	js $(^:%=-f %)

check-snake : www/js/direction.js www/js/entity.js www/js/room.js www/js/snake.js test/unit-test.js test/snake.js
	js $(^:%=-f %)
