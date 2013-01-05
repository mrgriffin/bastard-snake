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
 * \brief Constructs a snake at \p x, \p y facing direction \p direction of length \p length.
 * \exception RangeError \p length is <= 0.
 */
function Snake(x, y, direction, length) {
	if (length <= 0)
		throw new RangeError("Snake.constructor: length must be > 0");

	/*!
	 * \property int Snake::x
	 * \protected
	 * \brief The X coordinate of this snake.
	 */
	/*!
	 * \property int Snake::prevX
	 * \private
	 * \brief The previous X coordinate of this snake; used by \c onUpdate to move \c tail.
	 * \sa Snake::onUpdate
	 */
	this.x = this.prevX = x;
	/*!
	 * \property int Snake::y
	 * \protected
	 * \brief The Y coordinate of this snake.
	 */
	/*!
	 * \property int Snake::prevY
	 * \private
	 * \brief The previous Y coordinate of this snake; used by \c onUpdate to move \c tail.
	 * \sa Snake::onUpdate
	 */
	this.y = this.prevY = y;
	/*!
	 * \property Direction Snake::direction
	 * \private
	 * \brief The direction that this snake is facing; used by \c onUpdate to set \c vx and \c vy.
	 */
	/*!
	 * \property Direction Snake::newDirection
	 * \private
	 * \brief The direction that this snake will be facing next frame.
	 */
	this.direction = this.newDirection = direction;
	/*!
	 * \property Tail Snake::tail
	 * \private
	 * \brief The next segment of this snake; or \c undefined if this is the final section.
	 */
	if (length > 1)
		this.tail = new Tail(x, y, this, length - 1);
	/*!
	 * \property bool Snake::crashed
	 * \private
	 * \brief Whether this snake has crashed into an obstacle.
	 */
	this.crashed = false;
}
Entity.mixin(Snake);

/*!
 * \fn Action | Action[] Snake::onAdd()
 * \protected
 * \brief Adds the tail of this snake, if it has one.
 * \detail Pseudo-recursively adds the entire tail via \c Tail::onAdd.
 * \sa Tail::onAdd
 */
Snake.prototype.onAdd = function (room) {
	/*!
	 * \property Room Snake::room
	 * \private
	 * \brief The \c Room that this snake is in.
	 */
	this.room = room;
	if (this.tail)
		return new Room.AddEntityAction(room, this.tail);
}

/*!
 * \fn Action | Action[] Snake::onUpdate()
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
	 * \protected
	 * \brief Grows this snake.
	 * \sa Food::onCollide(Snake snake)
	 */
	Food: function () {
		return new Room.AddEntityAction(this.room, this.grow());
	/*!
	 * \fn Action | Action[] Snake::onCollide(Tail tail)
	 * \protected
	 * \brief Sets \c crashed to \c true.
	 */
	}, Tail: function () {
		this.crashed = true;
	/*!
	 * \fn Action | Action[] Snake::onCollide(Wall wall)
	 * \protected
	 * \brief Sets \c crashed to \c true.
	 */
	}, Wall: function () {
		this.crashed = true;
	}
};

/*!
 * \fn Tail Snake::grow()
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
 * \private
 * \brief Constructs a segment of a snake's tail at \p x, \p y that is a child of \p head of length \p length.
 * \exception RangeError \p length is <= 0.
 */
function Tail(x, y, head, length) {
	if (length <= 0)
		throw new RangeError("Tail.constructor: length must be > 0");

	/*!
	 * \property int Tail::x
	 * \protected
	 * \brief The X coordinate of this tail segment.
	 */
	/*!
	 * \property int Tail::prevX
	 * \private
	 * \brief The previous X coordinate of this tail segment; used by \c onUpdate to move \c tail.
	 * \sa Tail::onUpdate
	 */
	this.x = this.prevX = x;
	/*!
	 * \property int Tail::y
	 * \protected
	 * \brief The Y coordinate of this tail segment.
	 */
	/*!
	 * \property int Tail::prevY
	 * \private
	 * \brief The previous Y coordinate of this tail segment; used by \c onUpdate to move \c tail.
	 * \sa Tail::onUpdate
	 */
	this.y = this.prevY = y;
	/*!
	 * \property Snake | Tail Tail::head
	 * \private
	 * \brief The parent section of this tail segment.
	 */
	this.head = head;
	/*!
	 * \property Tail Tail::tail
	 * \private
	 * \brief The next segment of this tail segment; or \c undefined if this is the final section.
	 */
	if (length > 1)
		this.tail = new Tail(x, y, this, length - 1);
}
Entity.mixin(Tail);

/*!
 * \fn Action | Action[] Tail::onAdd(Room room)
 * \protected
 * \brief Adds the tail of this tail segment, if it has one.
 * \detail Pseudo-recursively adds the entire tail via \c Tail::onAdd.
 * \sa Snake::onAdd
 */
Tail.prototype.onAdd = Snake.prototype.onAdd;

/*!
 * \fn Action | Action[] Tail::onUpdate()
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
 * \brief Grows this tail segment by adding another segment to the end of the tail.
 * \return the new segment.
 * \sa Snake::grow
 */
Tail.prototype.grow = Snake.prototype.grow;
