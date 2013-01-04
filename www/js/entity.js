/*!
 * \file entity.js
 * \brief Mixin class that allows other classes to become game entities.
 */

/*!
 * \class Entity
 * \brief Mixin class that allows other classes to become a game entities that can be added to a \c Room.
 * \detail The Entity class is mixed in to another class by calling \c mixin with the other class as a parameter.
 *         \c mixin defines properties \c onX that provide hooks for the mixing class to react to game events.
 * \sa Entity::mixin
 * \sa Entity::onAdd
 * \sa Entity::onCollide
 * \sa Entity::onUpdate
 * \sa Room
 */
var Entity = (function () {
	/*!
	 * \fn T Entity::assertAction(T action, String method)
	 * \memberof Entity
	 * \private
	 * \brief Returns action if is of type \c Action, \c Action[] or \c undefined; throws \c TypeError otherwise.
	 */
	function assertAction(action, method) {
		var fail = function () { throw new TypeError(method + ": return type of handler is not Action, Action[] or undefined"); };

		if (action === undefined) {
			return action;
		} else if (Action.isAction(action)) {
			return action;
		} else if ('length' in action) {
			Array.prototype.forEach.call(action, function (a) { if (!Action.isAction(a)) fail(method); });
			return action;
		} else {
			fail(method);
		}
	}

	var entityPrototype = {
		/*!
		 * \fn Action | Action[] Entity::collide(Entity that)
		 * \memberof Entity
		 * \private
		 * \brief Executes the \c onCollide handler matching the type of \p that; or the \c else handler if none matched.
		 * \return the result of the executed handler; or \c undefined if none matched.
		 * \exception TypeError the type of \p that does not mixin \c Entity.
		 * \exception TypeError the return type of the executed handler was not one of an \c Action, \c Action[] or \c undefined.
		 * \sa Entity::onCollide
		 */
		collide: function (that) {
			if (!Entity.isEntity(that))
				throw new TypeError("Entity.collide: type of that does not mixin Entity");
			// TODO: Throw a TypeError if any of the onCollide handlers use an undefined Entity type.
			for (var i in this.onCollide)
				if (that._entity_name === i)
					return assertAction(this.onCollide[i].call(this, that), "Entity.collide");
			if ('else' in this.onCollide)
				return assertAction(this.onCollide['else'].call(this, that), "Entity.collide");
		/*!
		 * \property Action | Action[] (Entity)[] Entity::onCollide
		 * \memberof Entity
		 * \protected
		 * \brief Associative-array of type names to handler functions to execute when this entity collides with an entity of that type.
		 * \return one of an \c Action, \c Action[] or \c undefined.
		 * \snippet test/entity.js collide
		 * \sa Entity::collide
		 */
		}, onCollide: {
		/*!
		 * \fn Action | Action[] Entity::update()
		 * \memberof Entity
		 * \private
		 * \brief Updates this entity.
		 * \detail calls \c onUpdate.  if \c vx and/or \c vy are defined they will be added to \c x and \c y respectively.
		 * \return the result of \c onUpdate.
		 * \exception TypeError the return type of \c onUpdate was not one of an \c Action, \c Action[] or \c undefined.
		 * \sa Entity::onUpdate
		 */
		}, update: function () {
			var actions = assertAction(this.onUpdate(), "Entity.update");
			if (this.vx !== undefined)
				this.x += this.vx;
			if (this.vy !== undefined)
				this.y += this.vy;
			return actions;
		/*!
		 * \fn Action | Action[] Entity::onUpdate()
		 * \memberof Entity
		 * \protected
		 * \brief Called before this entity is updated.
		 * \return one of an \c Action, \c Action[] or \c undefined.
		 * \snippet test/entity.js update
		 * \sa Entity::collide
		 */
		}, onUpdate: function () {
		/*!
		 * \fn Action | Action[] Entity::onAdd()
		 * \memberof Entity
		 * \protected
		 * \brief Called after this entity is added to a \c Room.
		 * \return one of an \c Action, \c Action[] or \c undefined.
		 * \snippet test/room.js add
		 * \sa Room::add
		 */
		}, onAdd: function () {
		}
		/*!
		 * \property int Entity::x
		 * \memberof Entity
		 * \protected
		 * \brief The X coordinate of this entity.
		 * \detail Should be defined by a class that mixes \c Entity.
		 */
		/*!
		 * \property int Entity::y
		 * \memberof Entity
		 * \protected
		 * \brief The Y coordinate of this entity.
		 * \detail Should be defined by a class that mixes \c Entity.
		 */
		/*!
		 * \property int Entity::vx
		 * \memberof Entity
		 * \protected
		 * \brief The X velocity of this entity.
		 * \detail May be defined by a class that mixes \c Entity; if defined \c update will increase \c x by \c vx.
		 * \sa Entity::update
		 */
		/*!
		 * \property int Entity::vy
		 * \memberof Entity
		 * \protected
		 * \brief The Y velocity of this entity.
		 * \detail May be defined by a class that mixes \c Entity; if defined \c update will increase \c y by \c vy.
		 * \sa Entity::update
		 */
	};

	/*!
	 * \class Entity::MoveAction
	 * \implements Action
	 * \brief Moves an \c Entity to an x, y position.
	 */
	/*!
	 * \fn Entity::MoveAction::MoveAction(Entity entity, int x, int y)
	 * \memberof Entity::MoveAction
	 * \public
	 * \brief Constructs an action that moves \p entity to \p x, \p y.
	 */
	function MoveAction(entity, x, y) {
		this.entity = entity;
		this.x = x;
		this.y = y;
	}

	/*!
	 * \fn void Entity::MoveAction::apply()
	 * \memberof Entity::MoveAction
	 * \protected
	 * \brief Moves the entity.
	 */
	MoveAction.prototype.apply = function () {
		this.entity.x = this.x;
		this.entity.y = this.y;
	};

	return {
		MoveAction: MoveAction,
		/*!
		 * \fn bool Entity::isEntity(Object object)
		 * \memberof Entity
		 * \public
		 * \brief Returns \c true if the type of \p object mixes \c Entity; \c false otherwise.
		 * \sa Entity::mixin
		 */
		isEntity: function (object) {
			return '_entity_name' in object;
		/*!
		 * \fn void Entity::mixin(Function klass)
		 * \memberof Entity
		 * \public
		 * \brief Mixes \c Entity into \p klass.
		 * \detail \p klass should be a function that defines the constructor of a class.
		 *         The name \c "else" is reserved and cannot be the name of \p klass.
		 *         \p klass should define \c x and \c y properties so that it can be added to a \c Room.
		 *         \p klass may define \c vx and \c vx properties so that it can be automatically moved when updated.
		 * \exception RangeError \p the name of \p klass is reserved.
		 * \snippet test/entity.js mixin
		 */
		}, mixin: function (klass) {
			if (klass.name === 'else')
				throw new RangeError("Entity.mixin: klass name is reserved (" + klass.name + ")");
			klass.prototype._entity_name = klass.name;
			for (var property in entityPrototype)
				klass.prototype[property] = entityPrototype[property];
		}
		
	};
}());
