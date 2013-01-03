/*!
 * \file portal.js
 * \brief Portal that causes an entity to teleport when collided with.
 */

/*!
 * \class Portal
 * \implements Entity
 * \brief Portal that causes an entity to teleport when collided with.
 */
var Portal = (function () {
	function Portal(x, y) {
		this.x = x;
		this.y = y;
	}
	Entity.mixin(Portal);
	Portal.prototype.onCollide = {
		else: function (that) {
			return Entity.move(that, this.pair.x, this.pair.y);
		}
	};	

	/*!
	 * \fn Portal[] makePortals(x1, y1, x2, y2)
	 * \memberof Portal
	 * \brief Returns an array of two connected portals at \p x1, \p y1 and \p x2, \p y2.
	 */
	function makePortals(x1, y1, x2, y2) {
		var portal1 = new Portal(x1, y1);
		var portal2 = new Portal(x2, y2);
		portal1.pair = portal2;
		portal2.pair = portal1;
		return [ portal1, portal2 ];
	}

	return {
		makePortals: makePortals
	};
}());
