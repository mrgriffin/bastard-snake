/*!
 * \file touch-controller.js
 * \brief Controls a \c Snake via the mouse in a way suitable for touch-screen devices.
 */

/*!
 * \class TouchController
 * \brief Controls a \c Snake via the mouse in a way suitable for touch-screen devices.
 */
/*!
 * \fn TouchController::TouchController(Snake snake, HTMLElement element)
 * \public
 * \brief Constructs a touch controller that controls \p snake via touching \p element.
 * \detail Touches on the left half of \p element rotate \c snake counterclockwise, and touches on the right half clockwise.
 * \warning Sets the \c position css property of \p element to \c relative.
 */
function TouchController(snake, element) {
	/*!
	 * \property HTMLElement TouchController::element
	 * \private
	 * \brief The element that controls the snake when touched.
	 */
	this.element = element;

	element.style.position = 'relative';

	/*!
	 * \property HTMLElement TouchController::left
	 * \private
	 * \brief The element on the left half of \p element that rotates the snake counterclockwise when touched.
	 */
	this.left = document.createElement('div');
	this.left.style.position = 'absolute';
	this.left.style.top = '0';
	this.left.style.left = '0';
	this.left.style.width = '50%';
	this.left.style.height = '100%';
	element.appendChild(this.left);
	this.left.addEventListener('mouseup', function () {
		snake.newDirection = snake.direction.ccw();
	});

	/*!
	 * \property HTMLElement TouchController::right
	 * \private
	 * \brief The element on the right half of \p element that rotates the snake clockwise when touched.
	 */
	this.right = document.createElement('div');
	this.right.style.position = 'absolute';
	this.right.style.top = '0';
	this.right.style.right = '0';
	this.right.style.width = '50%';
	this.right.style.height = '100%';
	element.appendChild(this.right);
	this.right.addEventListener('mouseup', function () {
		snake.newDirection = snake.direction.cw();
	});
}

/*!
 * \fn TouchController::remove()
 * \public
 * \brief Removes this touch controller from \c element.
 */
TouchController.prototype.remove = function () {
	this.element.removeChild(this.left);
	this.element.removeChild(this.right);
};
