/*!
 * \file wall.js
 * \brief Wall that occupies a cell.
 */

/*!
 * \class Wall
 * \implements Entity
 * \brief  Wall that occupies a cell.
 */
/*!
 * \fn Wall::Wall(int x, int y)
 * \public
 * \brief Constructs a wall at \p x, \p y.
 */
function Wall(x, y) {
	/*!
	 * \property int Wall::x
	 * \protected
	 * \brief The X coordinate of this wall.
	 */
	this.x = x;
	/*!
	 * \property int Wall::y
	 * \protected
	 * \brief The Y coordinate of this wall.
	 */
	this.y = y;
}

Entity.mixin(Wall);
