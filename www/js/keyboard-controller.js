/*!
 * \file keyboard-controller.js
 * \brief Controls a \c Snake via the keyboard.
 */

/*!
 * \class KeyboardController
 * \brief Controls a \c Snake via the keyboard.
 */
/*!
 * \fn KeyboardController::KeyboardController(Snake snake)
 * \memberof KeyboardController
 * \public
 * \brief Constructs a controller that controls \p snake via the keyboard.
 * \detail The direction of \p snake can be changed by pressing the cursor keys or WASD.
 */
function KeyboardController(snake) {
	/*!
	 * \property void (Event) KeyboardController::eventListener
	 * \memberof KeyboardController
	 * \private
	 * \brief The event listener responsible for controlling the snake.
	 */
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

/*!
 * \fn KeyboardController::remove()
 * \memberof KeyboardContoller
 * \public
 * \brief Removes this keyboard controller from the page.
 */
KeyboardController.prototype.remove = function () {
	document.removeEventListener('keydown', this.eventListener);
};
