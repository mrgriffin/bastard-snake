/*!
 * \file room.js
 * \brief Collection of entities that can interact with each other.
 */

/*!
 * \class Room
 * \brief Collection of entities that can interact with each other.
 */
var Room = (function () {
	/*!
	 * \fn Room::Room(int width, int height)
	 * \public
	 * \brief Constructs an empty room width \p width by height \p height cells.
	 */
	function Room(width, height) {
		/*!
		 * \property const int Room::width
		 * \public
		 * \brief The width of this room in cells.
		 */
		this.width = width;
		/*!
		 * \property const int Room::height
		 * \public
		 * \brief The height of this room in cells.
		 */
		this.height = height;
		/*!
		 * \property Entity[] Room::entities
		 * \private
		 * \brief The entities contained within this room.
		 */
		this.entities = [];
	}

	/*!
	 * \class Room::AddEntityAction
	 * \implements Action
	 * \brief Adds an \c Entity to a \c Room.
	 */
	/*!
	 * \fn Room::AddEntityAction::AddEntityAction(Room room, Entity entity)
	 * \public
	 * \brief Constructs an action that adds \p entity to \p room.
	 */
	Room.AddEntityAction = function (room, entity) {
		this.room = room;
		this.entity = entity;
	};

	/*!
	 * \fn void Room::AddEntityAction::apply()
	 * \protected
	 * \brief Adds \p entity to \p room.
	 * \sa Room::AddEntityAction::AddEntityAction
	 */
	Room.AddEntityAction.prototype.apply = function () {
		this.room.add(this.entity);
	};

	/*!
	 * \class Room::RemoveEntityAction
	 * \implements Action
	 * \brief Removes an \c Entity from a \c Room.
	 */
	/*!
	 * \fn Room::RemoveEntityAction::RemoveEntityAction(Room room, Entity entity)
	 * \public
	 * \brief Constructs an action that removes \p entity from \p room.
	 * \detail If \p room does not contain \p entity (e.g. because it was already removed) this action has no effect.
	 */
	Room.RemoveEntityAction = function (room, entity) {
		this.room = room;
		this.entity = entity;
	};

	/*!
	 * \fn Room::RemoveEntityAction::apply()
	 * \protected
	 * \brief Removes \p entity from \p room.
	 * \sa Room::RemoveEntityAction::RemoveEntityAction
	 */
	Room.RemoveEntityAction.prototype.apply = function () {
		this.room.remove(this.entity);
	};

	/*!
	 * \fn T Room::assertAction(T action, String method)
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

	/*!
	 * \fn void Room::add(Entity entity)
	 * \public
	 * \brief Adds \p entity to this room.
	 * \detail Calls \c entity.onAdd and applies the returned actions after adding \p entity.
	 * \exception TypeError the type of \p entity does not mixin \c Entity.
	 * \exception TypeError the return type of \c entity.onAdd was not one of an \c Action, \c Action[] or \c undefined.
	 */
	Room.prototype.add = function (entity) {
		if (!Entity.isEntity(entity))
			throw new TypeError("Room.add: type of entity does not mixin Entity");
		this.entities.push(entity);
		var addActions = [];
		var actions = assertAction(entity.onAdd(this), "Room.add");
		if (actions !== undefined)
			addActions = addActions.concat(actions);
		addActions.forEach(function (action) { action.apply(this) }, this);
	};

	/*!
	 * \fn void Room::addAll(Entity[] entities)
	 * \public
	 * \brief Adds all the entities in \p entities to this room.
	 * \exception TypeError the type of an entity does not mixin \c Entity.
	 * \exception TypeError the return type of any entity's \c onAdd method was not one of an \c Action, \c Action[] or \c undefined.
	 * \sa Room::add
	 */
	Room.prototype.addAll = function (entities) {
		entities.forEach(function (entity) { this.add(entity); }, this);
	};

	/*!
	 * \fn void Room::remove(Entity entity)
	 * \public
	 * \brief Removes \p entity from this room.
	 * \detail If this room does not contain \p entity this method has no effect.
	 */
	Room.prototype.remove = function (entity) {
		this.entities = this.entities.filter(function (otherEntity) { return entity !== otherEntity; });
	};

	/*!
	 * \fn bool Room::contains(Entity entity | bool (Entity) predicate)
	 * \public
	 * \brief Returns \c true if this room contains \p entity or \p predicate returns \c true for an entity in the room; \c false otherwise.
	 */
	Room.prototype.contains = function (predicate) {
		if (typeof(predicate) === "function")
			return this.entities.some(predicate);
		else
			return this.entities.some(function (entity) { return entity === predicate; });
	};

	/*!
	 * \class Room::Cell
	 * \public
	 * \brief Single cell in a room.
	 * \sa Room::getCells
	 */
	/*!
	 * \fn Room::Cell::Cell(int x, int y, Entity[] entities)
	 * \private
	 * \brief Constructs a cell at \p x, \p y containing the entities \p entities.
	 */
	function Cell(x, y, entities) {
		/*!
		 * \property int Room::Cell::x
		 * \brief The X coordinate of this cell.
		 */
		this.x = x;
		/*!
		 * \property int Room::Cell::y
		 * \brief The Y coordinate of this cell.
		 */
		this.y = y;
		/*!
		 * \property Entity[] Room::Cell::entities
		 * \brief The entities that are located within this cell.
		 */
		this.entities = entities;
	}

	/*!
	 * \fn const Room::Cell[] Room::getCells(bool (Cell) predicate)
	 * \public
	 * \brief Returns all the cells for which \p predicate returns \c true.
	 * \sa Room::Cell
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
	 * \fn void Room::update()
	 * \public
	 * \brief Updates all entities in this room.
	 * \exception TypeError the return type of any entity's \c onUpdate or \c onCollide method was not one of an \c Action, \c Action[] or \c undefined.
	 */
	Room.prototype.update = function () {
		var updateActions = [];
		this.entities.forEach(function (entity) {
			var actions = assertAction(entity.update(), "Room.update");
			if (actions !== undefined)
				updateActions = updateActions.concat(actions);
		});
		updateActions.forEach(function (action) { action.apply() });

		var collideActions = [];
		for (var i = 0; i < this.entities.length; ++i) {
			for (var j = i + 1; j < this.entities.length; ++j) {
				if (this.entities[i].x === this.entities[j].x && this.entities[i].y === this.entities[j].y) {
					var iAction = assertAction(this.entities[i].collide(this.entities[j]), "Room.update");
					if (iAction !== undefined)
						collideActions = collideActions.concat(iAction);
					var jAction = assertAction(this.entities[j].collide(this.entities[i]), "Room.update");
					if (jAction !== undefined)
						collideActions = collideActions.concat(jAction);
				}
			}
		}
		collideActions.forEach(function (action) { action.apply() });
	};

	return Room;
}());
