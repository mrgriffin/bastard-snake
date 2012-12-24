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
		/*!
		 * \fn void onUpdate()
		 * \memberof Entity
		 * \brief Called before this entity is updated.
		 */
		}, onUpdate: function () {
		// TODO: Bring onCollide and update in line with eachother's naming scheme.
		}, update: function () {
			if (this.onUpdate !== undefined)
				this.onUpdate();
			this.x += this.vx;
			this.y += this.vy;
		}, vx: 0
		 , vy: 0
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
