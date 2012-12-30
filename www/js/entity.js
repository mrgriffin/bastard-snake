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
		 * \fn Action collide(Entity that)
		 * \memberof Entity
		 * \brief Executes the \c onCollide handler matching \p that's type.
		 * \detail \p that must be of a type that has had \c Entity.mixin called on it.
		 * \return the result of the executed handler or \c undefined if none matched.
		 */
		collide: function (that) {
			// TODO: Throw a TypeError if that is not an Entity (i.e. no name property).
			for (var i in this.onCollide)
				if (that.name === i)
					return this.onCollide[i].call(this, that);
		/*!
		 * \property Action (Entity)[] onCollide
		 * \memberof Entity
		 * \brief Associative-array of Entity class names to callbacks to execute when this entity collides with an entity of that type.
		 * \detail the Entity class must have had \c Entity.mixin called on it.
		 * \return an \c Action or an array of \c Action.
		 * \sa Entity.mixin
		 */
		}, onCollide: {
		/*!
		 * \fn Action update()
		 * \memberof Entity
		 * \brief Update this entity.
		 * \return the result of onUpdate.
		 */
		}, update: function () {
			var actions = this.onUpdate();
			if (this.vx !== undefined)
				this.x += this.vx;
			if (this.vy !== undefined)
				this.y += this.vy;
			return actions;
		/*!
		 * \fn Action onUpdate()
		 * \memberof Entity
		 * \brief Called before this entity is updated.
		 * \return an \c Action or an array of \c Action.
		 */
		}, onUpdate: function () {
		}
	};

	return {
		/*!
		 * \fn void mixin(Function klass)
		 * \memberof Entity
		 * \brief Sets \p klass to inherit from Entity.
		 */
		mixin: function (klass) {
			klass.prototype.name = klass.name;
			for (var property in prototype)
				klass.prototype[property] = prototype[property];
		}
	};
}());
