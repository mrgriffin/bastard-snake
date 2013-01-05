/*!
 * \file food.js
 * \brief Food that causes a snake to grow when collided with.
 */

/*!
 * \class Food
 * \implements Entity
 * \brief Food that causes a snake to grow when collided with.
 */
/*!
 * \fn Food::Food(int x, int y)
 * \public
 * \brief Constructs a piece of food at \p x, \p y.
 */
function Food(x, y) {
	/*!
	 * \property int Food::x
	 * \protected
	 * \brief The X coordinate of this piece of food.
	 */
	this.x = x;
	/*!
	 * \property int Food::y
	 * \protected
	 * \brief The Y coordinate of this piece of food.
	 */
	this.y = y;
}
Entity.mixin(Food);

Food.prototype.onAdd = function (room) {
	/*!
	 * \property Room Food::room
	 * \private
	 * \brief The \c Room that this food is in.
	 */
	this.room = room;
};

Food.prototype.onCollide = {
	/*!
	 * \fn Action | Action[] Food::onCollide(Snake snake)
	 * \protected
	 * \brief Removes this piece of food.
	 * \sa Snake::onCollide(Food food)
	 */
	Snake: function (snake) {
		return new Room.RemoveEntityAction(this.room, this);
	}
};
