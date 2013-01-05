/*!
 * \file snake.js
 * \brief Snake that travels one cell in any direction per frame.
 */

/*!
 * \class Snake
 * \implements Entity
 * \brief The head of a snake.
 */
/*!
 * \fn Snake::Snake(int x, int y, Direction direction, int length)
 * \memberof Snake
 * \brief Constructs a snake at \p x, \p y facing direction \p direction of length \p length.
 * \exception RangeError \p length is <= 0.
 */
function Snake(x, y, direction, length) {
	if (length <= 0)
		throw new RangeError("Snake.constructor: length must be > 0");

	/*!
	 * \property int Snake::x
	 * \memberof Snake
	 * \protected
	 * \brief The X coordinate of this snake.
	 */
	/*!
	 * \property int Snake::prevX
	 * \memberof Snake
	 * \private
	 * \brief The previous X coordinate of this snake; used by \c onUpdate to move \c tail.
	 * \sa Snake::onUpdate
	 */
	this.x = this.prevX = x;
	/*!
	 * \property int Snake::y
	 * \memberof Snake
	 * \protected
	 * \brief The Y coordinate of this snake.
	 */
	/*!
	 * \property int Snake::prevY
	 * \memberof Snake
	 * \private
	 * \brief The previous Y coordinate of this snake; used by \c onUpdate to move \c tail.
	 * \sa Snake::onUpdate
	 */
	this.y = this.prevY = y;
	/*!
	 * \property Direction Snake::direction
	 * \memberof Snake
	 * \private
	 * \brief The direction that this snake is facing; used by \c onUpdate to set \c vx and \c vy.
	 */
	/*!
	 * \property Direction Snake::newDirection
	 * \memberof Snake
	 * \private
	 * \brief The direction that this snake will be facing next frame.
	 */
	this.direction = this.newDirection = direction;
	/*!
	 * \property Tail Snake::tail
	 * \memberof Snake
	 * \private
	 * \brief The next segment of this snake; or \c undefined if this is the final section.
	 */
	if (length > 1)
		this.tail = new Tail(x, y, this, length - 1);
	/*!
	 * \property bool Snake::crashed
	 * \memberof Snake
	 * \private
	 * \brief Whether this snake has crashed into an obstacle.
	 */
	this.crashed = false;
}
Entity.mixin(Snake);

/*!
 * \fn Action | Action[] Snake::onAdd()
 * \memberof Snake
 * \protected
 * \brief Adds the tail of this snake, if it has one.
 * \detail Pseudo-recursively adds the entire tail via \c Tail::onAdd.
 * \sa Tail::onAdd
 */
Snake.prototype.onAdd = function () {
	if (this.tail)
		return new Room.AddEntityAction(this.tail);
}

/*!
 * \fn Action | Action[] Snake::onUpdate()
 * \memberof Snake
 * \protected
 * \brief Updates this snake.
 */
Snake.prototype.onUpdate = function () {
	this.prevX = this.x;
	this.prevY = this.y;
	this.direction = this.newDirection;
	this.vx = this.direction.x;
	this.vy = this.direction.y;
};

Snake.prototype.onCollide = {
	/*!
	 * \fn Action | Action[] Snake::onCollide(Food food)
	 * \memberof Snake
	 * \protected
	 * \brief Grows this snake.
	 */
	Food: function () {
		return new Room.AddEntityAction(this.grow());
	/*!
	 * \fn Action | Action[] Snake::onCollide(Tail tail)
	 * \memberof Snake
	 * \protected
	 * \brief Sets \c crashed to \c true.
	 */
	}, Tail: function () {
		this.crashed = true;
	/*!
	 * \fn Action | Action[] Snake::onCollide(Wall wall)
	 * \memberof Snake
	 * \protected
	 * \brief Sets \c crashed to \c true.
	 */
	}, Wall: function () {
		this.crashed = true;
	}
};

/*!
 * \fn Tail Snake::grow()
 * \memberof Snake
 * \public
 * \brief Grows this snake by adding another segment to the end of the tail.
 * \return the new segment.
 * \sa Tail::grow
 */
Snake.prototype.grow = function () {
	if (this.tail)
		return this.tail.grow();
	else
		return this.tail = new Tail(this.x, this.y, this, 1);
};

/*!
 * \class Tail
 * \implements Entity
 * \brief Segment of the tail of a snake.
 */
/*!
 * \fn Tail::Tail(int x, int y, Snake | Tail head, int length)
 * \memberof Tail
 * \private
 * \brief Constructs a segment of a snake's tail at \p x, \p y that is a child of \p head of length \p length.
 * \exception RangeError \p length is <= 0.
 */
function Tail(x, y, head, length) {
	if (length <= 0)
		throw new RangeError("Tail.constructor: length must be > 0");

	/*!
	 * \property int Tail::x
	 * \memberof Tail
	 * \protected
	 * \brief The X coordinate of this tail segment.
	 */
	/*!
	 * \property int Tail::prevX
	 * \memberof Tail
	 * \private
	 * \brief The previous X coordinate of this tail segment; used by \c onUpdate to move \c tail.
	 * \sa Tail::onUpdate
	 */
	this.x = this.prevX = x;
	/*!
	 * \property int Tail::y
	 * \memberof Tail
	 * \protected
	 * \brief The Y coordinate of this tail segment.
	 */
	/*!
	 * \property int Tail::prevY
	 * \memberof Tail
	 * \private
	 * \brief The previous Y coordinate of this tail segment; used by \c onUpdate to move \c tail.
	 * \sa Tail::onUpdate
	 */
	this.y = this.prevY = y;
	/*!
	 * \property Snake | Tail Tail::head
	 * \memberof Tail
	 * \private
	 * \brief The parent section of this tail segment.
	 */
	this.head = head;
	/*!
	 * \property Tail Tail::tail
	 * \memberof Tail
	 * \private
	 * \brief The next segment of this tail segment; or \c undefined if this is the final section.
	 */
	if (length > 1)
		this.tail = new Tail(x, y, this, length - 1);
}
Entity.mixin(Tail);

/*!
 * \fn Action | Action[] Tail::onAdd()
 * \memberof Tail
 * \protected
 * \brief Adds the tail of this tail segment, if it has one.
 * \detail Pseudo-recursively adds the entire tail via \c Tail::onAdd.
 * \sa Snake::onAdd
 */
Tail.prototype.onAdd = Snake.prototype.onAdd;

/*!
 * \fn Action | Action[] Tail::onUpdate()
 * \memberof Tail
 * \protected
 * \brief Updates this tail segment.
 */
Tail.prototype.onUpdate = function () {
	this.prevX = this.x;
	this.prevY = this.y;
	this.x = this.head.prevX;
	this.y = this.head.prevY;
};

/*!
 * \fn Tail Tail::grow()
 * \memberof Tail
 * \brief Grows this tail segment by adding another segment to the end of the tail.
 * \return the new segment.
 * \sa Snake::grow
 */
Tail.prototype.grow = Snake.prototype.grow;
