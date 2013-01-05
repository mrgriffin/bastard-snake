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
		/*!
		 * \property int Portal::x
		 * \memberof Portal
		 * \protected
		 * \brief The X coordinate of this portal.
		 */
		this.x = x;
		/*!
		 * \property int Portal::y
		 * \memberof Portal
		 * \protected
		 * \brief The Y coordinate of this portal.
		 */
		this.y = y;
		/*!
		 * \property Portal Portal::pair
		 * \memberof Portal
		 * \private
		 * \brief The portal that this portal teleports entities to.
		 */
	}
	Entity.mixin(Portal);

	Portal.prototype.onCollide = {
		/*!
		 * \fn Action | Action[] Portal::onCollide(Entity else)
		 * \memberof Portal
		 * \protected
		 * \brief Teleports \p else to the position of \c pair.
		 */
		else: function (that) {
			return new Entity.MoveAction(that, this.pair.x, this.pair.y);
		}
	};	

	/*!
	 * \fn Portal[] Portal::makePortals(x1, y1, x2, y2)
	 * \memberof Portal
	 * \public
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
