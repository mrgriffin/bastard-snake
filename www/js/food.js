/*!
 * \file food.js
 * \brief Food that causes a Snake to grow when eaten.
 */

/*!
 * \class Food
 * \implements Entity
 * \brief Food that causes a Snake to grow when eaten.
 */
/*!
 * \fn Food(x, y)
 * \memberof Food
 * \brief Constructs a piece of food at \p x, \p y.
 */
function Food(x, y) {
	this.x = x;
	this.y = y;
}
Entity.mixin(Food);
Food.prototype.onCollide = {
	Snake: function (snake) {
		return Room.removeEntity(this);
	}
};
