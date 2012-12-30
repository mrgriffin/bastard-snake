/*!
 * \file snake.js
 * \brief Snake that travels one cell in any direction per frame.
 */

/*!
 * \class Snake
 * \brief The head of a snake.
 */
/*!
 * \fn Snake(x, y, direction, length)
 * \memberof Snake
 * \brief Constructs a snake at \p x, \p y facing direction \p direction of length \p length.
 */
function Snake(x, y, direction, length) {
	this.x = x;
	this.y = y;
	this.direction = direction;
	this.length = length;
	if (length > 1)
		this.tail = new Tail(x, y, this, length - 1);
}
Entity.mixin(Snake);
Snake.prototype.onUpdate = function () {
	var actions = [];
	if (this.tail) {
		var tailActions = this.tail.update();
		if (tailActions !== undefined)
			actions = actions.concat(tailActions);
	}
	this.vx = this.direction.x;
	this.vy = this.direction.y;
	return actions;
};

/*!
 * \class Tail
 * \brief Part of the tail of a snake.
 */
/*!
 * \fn Tail(x, y, head, length)
 * \memberof Tail
 * \brief Constructs a segment of a snake's tail at \p x, \p y that is a child of \p head of length \p length.
 */
function Tail(x, y, head, length) {
	this.x = x;
	this.y = y;
	this.head = head;
	if (length > 1)
		this.tail = new Tail(x, y, this, length - 1);
}
Entity.mixin(Tail);
Tail.prototype.onUpdate = function () {
	var actions = [];
	if (this.tail) {
		var tailActions = this.tail.update();
		if (tailActions !== undefined)
			actions = actions.concat(tailActions);
	}
	this.x = this.head.x;
	this.y = this.head.y;
	return actions;
};
