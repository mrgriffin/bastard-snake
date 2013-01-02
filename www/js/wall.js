/*!
 * \file wall.js
 * \brief Wall that prevents other entities from moving into a space.
 */

/*!
 * \class Wall
 * \brief  Wall that prevents other entities from moving into a space.
 */
/*!
 * \fn Wall(x, y)
 * \memberof Wall
 * \brief Constructs a wall at \p x, \p y.
 */
function Wall(x, y) {
	this.x = x;
	this.y = y;
}
Entity.mixin(Wall);
