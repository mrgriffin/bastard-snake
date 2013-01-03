/*!
 * \file touch-controller.js
 * \brief Controls a \c Snake via the mouse in a way suitable for touch-screen devices.
 */

/*!
 * \class TouchController
 * \brief Controls a \c Snake via the mouse in a way suitable for touch-screen devices.
 * \warning Sets the \c position css property of \p element to \c relative.
 */
function TouchController(snake, element) {
	element.style.position = 'relative';

	var left = document.createElement('div');
	left.style.position = 'absolute';
	left.style.top = '0';
	left.style.left = '0';
	left.style.width = '50%';
	left.style.height = '100%';
	element.appendChild(left);
	left.addEventListener('mouseup', function () {
		snake.newDirection = snake.direction.ccw();
	});

	var right = document.createElement('div');
	right.style.position = 'absolute';
	right.style.top = '0';
	right.style.right = '0';
	right.style.width = '50%';
	right.style.height = '100%';
	element.appendChild(right);
	right.addEventListener('mouseup', function () {
		snake.newDirection = snake.direction.cw();
	});
}
