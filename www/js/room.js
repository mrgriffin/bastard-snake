/*!
 * \file room.js
 * \brief Contains a set of entities.
 */

/*!
 * \class Room
 * \brief Contains a set of entities.
 */
var Room = (function () {
	function Room(width, height) {
		this.width = width;
		this.height = height;
		this.entities = [];
	}

	function AddEntity(entity) {
		this.entity = entity;
	}

	AddEntity.prototype.apply = function (room) {
		room.add(this.entity);
	};

	/*!
	 * \fn Action addEntity(entity)
	 * \memberof Room
	 * \brief Returns an Action that adds an entity to a room.
	 */
	Room.addEntity = function (entity) {
		return new AddEntity(entity);
	};

	function RemoveEntity(entity) {
		this.entity = entity;
	}

	RemoveEntity.prototype.apply = function (room) {
		room.remove(this.entity);
	};

	/*!
	 * \fn Action removeEntity(entity)
	 * \memberof Room
	 * \brief Returns an Action that removes an entity from a room.
	 */
	Room.removeEntity = function (entity) {
		return new RemoveEntity(entity);
	};

	Room.prototype.add = function (entity) {
		this.entities.push(entity);
	};

	Room.prototype.remove = function (entity) {
		this.entities = this.entities.filter(function (otherEntity) { return entity !== otherEntity; });
	};

	Room.prototype.contains = function (predicate) {
		if (typeof(predicate) === "function")
			return this.entities.some(predicate);
		else
			return this.entities.some(function (entity) { return entity === predicate; });
	};

	Room.prototype.update = function () {
		var updateActions = [];
		this.entities.forEach(function (entity) {
			var actions = entity.onUpdate();
			if (actions !== undefined)
				updateActions = updateActions.concat(actions);
			entity.x += entity.vx;
			entity.y += entity.vy;
		});
		updateActions.forEach(function (action) { action.apply(this) }, this);

		var collideActions = [];
		for (var i = 0; i < this.entities.length; ++i) {
			for (var j = i + 1; j < this.entities.length; ++j) {
				if (this.entities[i].x === this.entities[j].x && this.entities[i].y === this.entities[j].y) {
					var iAction = this.entities[i].onCollide(this.entities[j]);
					if (iAction !== undefined)
						collideActions = collideActions.concat(iAction);
					var jAction = this.entities[j].onCollide(this.entities[i]);
					if (jAction !== undefined)
						collideActions = collideActions.concat(jAction);
				}
			}
		}
		collideActions.forEach(function (action) { action.apply(this) }, this);
	};

	return Room;
}());
