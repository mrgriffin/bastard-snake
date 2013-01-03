/*!
 * \file keyboard-controller.js
 * \brief Controls a \c Snake via the keyboard.
 */

/*!
 * \class KeyboardController
 * \implements Controller
 * \brief Controls a \c Snake via the keyboard.
 */
function KeyboardController(snake) {
	// TODO: Take the element to listen on as a parameter.
	document.addEventListener('keydown', this.eventListener = function (e) {
		var newDirection;

		switch (e.keyCode) {
			case 38: case 87: newDirection = Direction.UP; break;    // Up/W.
			case 39: case 68: newDirection = Direction.RIGHT; break; // Right/D.
			case 40: case 83: newDirection = Direction.DOWN; break;  // Down/S.
			case 37: case 65: newDirection = Direction.LEFT; break;  // Left/A.
		}

		// Prevent the snake from turning back on itself.
		if (newDirection && newDirection !== snake.direction.cw().cw())
			snake.newDirection = newDirection;
	});
}

KeyboardController.prototype.remove = function () {
	document.removeEventListener('keydown', this.eventListener);
};
