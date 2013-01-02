/*!
 * \file room.js
 * \brief Contains a set of entities.
 */

/*!
 * \class Room
 * \brief Contains a set of entities.
 */
var Room = (function () {
	/*!
	 * \fn Room(width, height)
	 * \memberof Room
	 * \brief Constructs a room of size \p width by \p height.
	 */
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
	 * \brief Returns an \c Action that adds an entity to a room.
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
	 * \brief Returns an \c Action that removes an entity from a room.
	 */
	Room.removeEntity = function (entity) {
		return new RemoveEntity(entity);
	};

	/*!
	 * \fn void remove(entity)
	 * \memberof Room
	 * \brief Adds \p entity to this room.
	 */
	Room.prototype.add = function (entity) {
		this.entities.push(entity);
		var addActions = [];
		var actions = entity.onAdd();
		if (actions !== undefined)
			addActions = addActions.concat(actions);
		addActions.forEach(function (action) { action.apply(this) }, this);
	};

	/*!
	 * \fn void remove(entity)
	 * \memberof Room
	 * \brief Removes \p entity from this room.
	 */
	Room.prototype.remove = function (entity) {
		this.entities = this.entities.filter(function (otherEntity) { return entity !== otherEntity; });
	};

	/*!
	 * \fn bool contains(entity | predicate)
	 * \memberof Room
	 * \brief Returns \c true if this room contains \p entity or \p predicate returns \c true for an entity in the room; \c false otherwise.
	 */
	Room.prototype.contains = function (predicate) {
		if (typeof(predicate) === "function")
			return this.entities.some(predicate);
		else
			return this.entities.some(function (entity) { return entity === predicate; });
	};

	/*!
	 * \class Cell
	 * \memberof Room
	 * \brief Single cell in a room.
	 * \sa getCells
	 */
	function Cell(x, y, entities) {
		this.x = x;
		this.y = y;
		this.entities = entities;
	}

	/*!
	 * \fn Cell[] getCells(predicate)
	 * \memberof Room
	 * \brief Returns all the cells for which \p predicate returns \c true.
	 * \note Note that changes to the returned cells will not alter this room.
	 */
	Room.prototype.getCells = function (predicate) {
		var cells = [];
		for (var x = 0; x < this.width; ++x) {
			for (var y = 0; y < this.height; ++y) {
				var entities = [];
				this.entities.forEach(function (entity) { if (entity.x == x && entity.y == y) entities.push(entity); });
				var cell = new Cell(x, y, entities);
				if (predicate(cell))
					cells.push(cell);
			}
		}
		return cells;
	};

	/*!
	 * \fn void update()
	 * \memberof Room
	 * \brief Updates all entities in this room.
	 */
	Room.prototype.update = function () {
		var updateActions = [];
		this.entities.forEach(function (entity) {
			var actions = entity.update();
			if (actions !== undefined)
				updateActions = updateActions.concat(actions);
		});
		updateActions.forEach(function (action) { action.apply(this) }, this);

		var collideActions = [];
		for (var i = 0; i < this.entities.length; ++i) {
			for (var j = i + 1; j < this.entities.length; ++j) {
				if (this.entities[i].x === this.entities[j].x && this.entities[i].y === this.entities[j].y) {
					var iAction = this.entities[i].collide(this.entities[j]);
					if (iAction !== undefined)
						collideActions = collideActions.concat(iAction);
					var jAction = this.entities[j].collide(this.entities[i]);
					if (jAction !== undefined)
						collideActions = collideActions.concat(jAction);
				}
			}
		}
		collideActions.forEach(function (action) { action.apply(this) }, this);
	};

	return Room;
}());
