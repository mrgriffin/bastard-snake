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
	this.x = this.prevX = x;
	this.y = this.prevY = y;
	this.direction = direction;
	this.length = length;
	if (length > 1)
		this.tail = new Tail(x, y, this, length - 1);
}
Entity.mixin(Snake);
Snake.prototype.onAdd = function () {
	if (this.tail)
		return Room.addEntity(this.tail);
}
Snake.prototype.onUpdate = function () {
	this.prevX = this.x;
	this.prevY = this.y;
	this.vx = this.direction.x;
	this.vy = this.direction.y;
};
Snake.prototype.onCollide = {
	Tail: function () {
		this.crashed = true;
	}
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
	this.x = this.prevX = x;
	this.y = this.prevY = y;
	this.head = head;
	if (length > 1)
		this.tail = new Tail(x, y, this, length - 1);
}
Entity.mixin(Tail);
Tail.prototype.onAdd = function () {
	if (this.tail)
		return Room.addEntity(this.tail);
}
Tail.prototype.onUpdate = function () {
	this.prevX = this.x;
	this.prevY = this.y;
	this.x = this.head.prevX;
	this.y = this.head.prevY;
};
