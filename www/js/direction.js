/*!
 * \file direction.js
 * \brief Axis-aligned Cartesian directions.
 */

/*!
 * \enum Direction
 * \brief Axis-aligned Cartesian directions.
 * \var Direction Direction::UP
 * \var Direction Direction::RIGHT
 * \var Direction Direction::DOWN
 * \var Direction Direction::LEFT
 */
var Direction = (function () {
	function Direction(x, y) { this.x = x; this.y = y; }
	var directions = [ new Direction(0, -1), new Direction(1, 0), new Direction(0, 1), new Direction(-1, 0) ];

	/*!
	 * \fn Direction Direction::cw()
	 * \public
	 * \brief Returns the direction clockwise of this direction.
	 */
	Direction.prototype.cw = function () {
		return directions[(directions.indexOf(this) + 1) % 4];
	};

	/*!
	 * \fn Direction Direction::ccw()
	 * \public
	 * \brief Returns the direction counterclockwise of this direction.
	 */
	Direction.prototype.ccw = function () {
		return directions[(directions.indexOf(this) + 3) % 4];
	};

	return { UP: directions[0], RIGHT: directions[1], DOWN: directions[2], LEFT: directions[3] };
}());
