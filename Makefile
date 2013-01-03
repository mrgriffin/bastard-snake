all :

check : check-fixtures check-canvas-renderer check-direction check-entity check-food check-game check-portal check-room check-snake check-wall

check-fixtures : test/unit-test.js test/fixtures.js
	js $(^:%=-f %)

# Check that CanvasRenderer handle each subclass of Entity.
check-canvas-renderer : www/js/*.js
	for E in `sed -nre 's/.*Entity.mixin\((.*)\).*/\1/p' $^`; do grep www/js/canvas-renderer.js -qe "$$E"; done

check-direction : www/js/direction.js test/unit-test.js test/direction.js
	js $(^:%=-f %)

check-entity : www/js/entity.js test/unit-test.js test/entity.js
	js $(^:%=-f %)

check-food : www/js/direction.js www/js/entity.js www/js/food.js www/js/room.js www/js/snake.js test/unit-test.js test/food.js
	js $(^:%=-f %)

check-game : www/js/direction.js www/js/entity.js www/js/food.js www/js/game.js www/js/portal.js www/js/room.js www/js/snake.js www/js/wall.js test/unit-test.js test/game.js
	js $(^:%=-f %)

check-portal : www/js/entity.js www/js/portal.js www/js/room.js test/unit-test.js test/portal.js
	js $(^:%=-f %)

check-room : www/js/entity.js www/js/room.js test/unit-test.js test/room.js
	js $(^:%=-f %)

check-snake : www/js/direction.js www/js/entity.js www/js/room.js www/js/snake.js test/unit-test.js test/snake.js
	js $(^:%=-f %)

check-wall : www/js/direction.js www/js/entity.js www/js/room.js www/js/snake.js www/js/wall.js test/unit-test.js test/wall.js
	js $(^:%=-f %)
