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
 * \memberof Food
 * \public
 * \brief Constructs a piece of food at \p x, \p y.
 */
function Food(x, y) {
	/*!
	 * \property int Food::x
	 * \memberof Food
	 * \protected
	 * \brief The X coordinate of this piece of food.
	 */
	this.x = x;
	/*!
	 * \property int Food::y
	 * \memberof Food
	 * \protected
	 * \brief The Y coordinate of this piece of food.
	 */
	this.y = y;
}
Entity.mixin(Food);

Food.prototype.onCollide = {
	/*!
	 * \fn Action | Action[] Food::onCollide(Snake snake)
	 * \memberof Food
	 * \protected
	 * \brief Removes this piece of food.
	 * \sa Snake::onCollide(Food food)
	 */
	Snake: function (snake) {
		return new Room.RemoveEntityAction(this);
	}
};
