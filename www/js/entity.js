/*!
 * \file entity.js
 * \brief Base-class of entities in the game.
 */

/*!
 * \class Entity
 * \brief Base-class of entities in the game.
 */
var Entity = (function () {
	var prototype = {
		/*!
		 * \fn T onCollide(Entity that)
		 * \memberof Entity
		 * \brief Executes the \c collisionHandler matching \p that's type.
		 * \detail \p that must be of a type that has had \c Entity.mixin called on it.
		 * \return the result of the executed handler or \c undefined if none matched.
		 */
		onCollide: function (that) {
			if (this.collisionHandlers)
				for (var i in this.collisionHandlers)
					if (that.name === i)
						return this.collisionHandlers[i].call(this, that);
		}
	};

	return {
		/*!
		 * \fn void mixin(Function klass)
		 * \memberof Entity
		 * \brief Sets \p klass to inherit from Entity.
		 */
		mixin: function (klass) {
			klass.prototype = {};
			klass.prototype.name = klass.name;
			for (var property in prototype)
				klass.prototype[property] = prototype[property];
		}
	};
}());
