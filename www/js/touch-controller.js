/*!
 * \file touch-controller.js
 * \brief Controls a \c Snake via the mouse in a way suitable for touch-screen devices.
 */

/*!
 * \class TouchController
 * \implements Controller
 * \brief Controls a \c Snake via the mouse in a way suitable for touch-screen devices.
 * \warning Sets the \c position css property of \p element to \c relative.
 */
function TouchController(snake, element) {
	this.element = element;

	element.style.position = 'relative';

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

TouchController.prototype.remove = function () {
	this.element.removeChild(this.left);
	this.element.removeChild(this.right);
};
