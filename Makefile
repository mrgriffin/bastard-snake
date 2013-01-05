all :

.PHONY : push
push : check
	scp -r www/* mgriffin_mgriffin@ssh.phx.nearlyfreespeech.net:/home/public/bastard-snake

check : check-makefile check-index check-fixtures check-canvas-renderer check-direction check-entity check-food check-game check-portal check-room check-snake check-wall

# Check that this makefile references all the test files in test.
check-makefile : test/*.js
	$(patsubst %,grep Makefile -qe "%" || exit 1;,$^)

# Check that index.html references all the javascript files in www/js.
check-index : www/js/*.js
	$(patsubst www/%,grep www/index.html -qe "%" || exit 1;,$^)

check-fixtures : test/unit-test.js test/fixtures.js
	js $(^:%=-f %)

# Check that CanvasRenderer handles each subclass of Entity.
check-canvas-renderer : www/js/*.js
	for E in `sed -nre 's/.*Entity.mixin\((.*)\).*/\1/p' $^`; do grep www/js/canvas-renderer.js -qe "$$E" || exit 1; done

check-direction : www/js/direction.js test/unit-test.js test/direction.js
	js $(^:%=-f %)

check-entity : www/js/action.js www/js/entity.js test/unit-test.js test/entity.js
	js $(^:%=-f %)

check-food : www/js/action.js www/js/direction.js www/js/entity.js www/js/food.js www/js/room.js www/js/snake.js test/unit-test.js test/food.js
	js $(^:%=-f %)

check-game : www/js/action.js www/js/direction.js www/js/entity.js www/js/food.js www/js/game.js www/js/portal.js www/js/room.js www/js/snake.js www/js/wall.js test/unit-test.js test/game.js
	js $(^:%=-f %)

check-portal : www/js/action.js www/js/entity.js www/js/portal.js www/js/room.js test/unit-test.js test/portal.js
	js $(^:%=-f %)

check-room : www/js/action.js www/js/entity.js www/js/room.js test/unit-test.js test/room.js
	js $(^:%=-f %)

check-snake : www/js/action.js www/js/direction.js www/js/entity.js www/js/room.js www/js/snake.js test/unit-test.js test/snake.js
	js $(^:%=-f %)

check-wall : www/js/direction.js www/js/entity.js www/js/room.js www/js/snake.js www/js/wall.js test/unit-test.js test/wall.js
	js $(^:%=-f %)
