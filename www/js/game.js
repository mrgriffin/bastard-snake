/*!
 * \file game.js
 * \brief Class that contains the game state.
 */

/*!
 * \class Game
 * \brief The game state.
 */
/*!
 * \fn Game::Game()
 * \public
 * \brief Constructs a new game.
 * \detail Creates a snake in a room surrounded by walls containing 2 portals and a piece of food.
 */
function Game() {
	/*!
	 * \property int Game::width
	 * \private
	 * \brief The maximum width of this game in rooms.
	 */
	this.width = 5;

	/*!
	 * \property int Game::height
	 * \private
	 * \brief The maximum height of this game in rooms.
	 */
	this.height = 5;

	/*!
	 * \property Room[] Game::rooms
	 * \private
	 * \brief All the rooms in this game.
	 */
	this.rooms = this.makeRooms(this.width, this.height);

	/*!
	 * \property Room Game::currentRoom
	 * \private
	 * \brief The room \c snake is currently in.
	 */
	this.currentRoom = this.getRoom(Math.floor(this.width / 2), Math.floor(this.height / 2));

	/*!
	 * \property Snake Game::snake
	 * \private
	 * \brief The snake that is the protagonist of this game.
	 */
	this.currentRoom.add(this.snake = new Snake(Math.floor(this.currentRoom.width / 2), Math.floor(this.currentRoom.height / 2), Direction.RIGHT, 3));

	/*!
	 * \property Food Game::Food
	 * \private
	 * \brief The current piece of food.
	 */
	this.currentRoom.add(this.food = this.makeFood(this.getEmptyCell(this.currentRoom)));

	/*!
	 * \property bool Game::gameover
	 * \private
	 * \brief Whether this game is over.
	 */
	this.gameover = false;
}

/*!
 * \fn Room Game::getRoom(int x, int y)
 * \private
 * \brief Returns the room at \p x, \y if it exists; \c undefined otherwise.
 */
Game.prototype.getRoom = function (x, y) {
	return this.rooms[y * this.width + x];
};

/*!
 * \fn Room[] Game::makeRooms(int width, int height)
 * \private
 * \brief Creates and returns an array of \c Room.
 * \detail The array contains up to \p width * \p height rooms, centered on the midpoint.
 */
Game.prototype.makeRooms = function (width, height) {
	var rooms = new Array(width * height);

	var roomWidth = 15, roomHeight = 15;
	var roomMidX = Math.floor(roomWidth / 2), roomMidY = Math.floor(roomHeight / 2);

	// Ensure the midpoint contains a room.
	rooms[Math.floor(height / 2) * width + Math.floor(width / 2)] = this.makeRoom(roomWidth, roomHeight);

	// TODO: Improve the room placement algorithm.
	for (var i = 0; i < rooms.length; ++i) {
		if (!rooms[i] && Math.random() > 0.5)
			rooms[i] = this.makeRoom(roomWidth, roomHeight);
	}

	// Create doorways.
	function joinRooms(room, adjacentRoom, direction) {
		var cells = [];

		switch (direction) {
			case Direction.UP:
				cells = [ { x: roomMidX - 1, y: 0 }, { x: roomMidX, y: 0 }, { x: roomMidX + 1, y: 0 } ];
				break;
			case Direction.RIGHT:
				cells = [ { x: roomWidth - 1, y: roomMidY - 1 }, { x: roomWidth - 1, y: roomMidY }, { x: roomWidth - 1, y: roomMidY + 1 } ];
				break;
			case Direction.DOWN:
				cells = [ { x: roomMidX - 1, y: roomHeight - 1 }, { x: roomMidX, y: roomHeight - 1 }, { x: roomMidX + 1, y: roomHeight - 1 } ];
				break;
			case Direction.LEFT:
				cells = [ { x: 0, y: roomMidY - 1 }, { x: 0, y: roomMidY }, { x: 0, y: roomMidY + 1 } ];
				break;
		}

		cells.forEach(function (cell) {
			if (!adjacentRoom)
				room.add(new Wall(cell.x, cell.y));
		});
	}

	for (var i = 0; i < rooms.length; ++i) {
		if (rooms[i]) {
			joinRooms(rooms[i], rooms[i - height], Direction.UP);
			joinRooms(rooms[i], rooms[i + 1], Direction.RIGHT);
			joinRooms(rooms[i], rooms[i + height], Direction.DOWN);
			joinRooms(rooms[i], rooms[i - 1], Direction.LEFT);
		}
	}

	return rooms;
};

/*!
 * \fn Room Game::makeRoom(int width, int height)
 * \private
 * \brief Creates and returns a \c Room of \p width by \p height cells.
 * \detail The returned room is surrounded by walls except where doorways could be located and contains two portals.
 */
Game.prototype.makeRoom = function (width, height) {
	var room = new Room(width, height);

	for (var x = 0; x < width; ++x) {
		if (x < Math.floor(width / 2) - 1 || x > Math.floor(width / 2) + 1) {
			room.add(new Wall(x, 0));
			room.add(new Wall(x, height - 1));
		}
	}

	for (var y = 0; y < height; ++y) {
		if (y < Math.floor(height / 2) - 1 || y > Math.floor(height / 2) + 1) {
			room.add(new Wall(0, y));
			room.add(new Wall(width - 1, y));
		}
	}

	// HINT: These templates are defined clockwise around the room, starting with up or top left.
	var W = width - 1, H = height - 1, w = Math.floor(width / 2), h = Math.floor(height / 2);
	var templates = [
		[
		],[
			{x:2,y:4}, {x:3,y:4}, {x:4,y:4}, {x:4,y:3}, {x:4,y:2},
			{x:W-2,y:4}, {x:W-3,y:4}, {x:W-4,y:4}, {x:W-4,y:3}, {x:W-4,y:2},
			{x:W-2,y:H-4}, {x:W-3,y:H-4}, {x:W-4,y:H-4}, {x:W-4,y:H-3}, {x:W-4,y:H-2},
			{x:2,y:H-4}, {x:3,y:H-4}, {x:4,y:H-4}, {x:4,y:H-3}, {x:4,y:H-2}
		], [
			{x:w-2,y:1}, {x:w-2,y:2}, {x:w-2,y:3}, {x:w+2,y:1}, {x:w+2,y:2}, {x:w+2,y:3},
			{x:W-1,y:h-2}, {x:W-2,y:h-2}, {x:W-3,y:h-2}, {x:W-1,y:h+2}, {x:W-2,y:h+2}, {x:W-3,y:h+2},
			{x:w-2,y:H-1}, {x:w-2,y:H-2}, {x:w-2,y:H-3}, {x:w+2,y:H-1}, {x:w+2,y:H-2}, {x:w+2,y:H-3},
			{x:1,y:h-2}, {x:2,y:h-2}, {x:3,y:h-2}, {x:1,y:h+2}, {x:2,y:h+2}, {x:3,y:h+2}
		], [
			{x:w-1,y:h-4}, {x:w-2,y:h-4}, {x:w-3,y:h-3}, {x:w-4,y:h-2}, {x:w-4,y:h-1},
			{x:w+1,y:h-4}, {x:w+2,y:h-4}, {x:w+3,y:h-3}, {x:w+4,y:h-2}, {x:w+4,y:h-1},
			{x:w+1,y:h+4}, {x:w+2,y:h+4}, {x:w+3,y:h+3}, {x:w+4,y:h+2}, {x:w+4,y:h+1},
			{x:w-1,y:h+4}, {x:w-2,y:h+4}, {x:w-3,y:h+3}, {x:w-4,y:h+2}, {x:w-4,y:h+1}
		], [
			{x:w-4,y:h-4}, {x:w-3,y:h-4}, {x:w-2,y:h-4}, {x:w-1,y:h-4}, {x:w+1,y:h-4}, {x:w+2,y:h-4}, {x:w+3,y:h-4}, {x:w+4,y:h-4},
			{x:w-4,y:h-2}, {x:w-3,y:h-2}, {x:w-1,y:h-2}, {x:w,y:h-2}, {x:w+1,y:h-2}, {x:w+3,y:h-2}, {x:w+4,y:h-2},
			{x:w-4,y:h+2}, {x:w-3,y:h+2}, {x:w-1,y:h+2}, {x:w,y:h+2}, {x:w+1,y:h+2}, {x:w+3,y:h+2}, {x:w+4,y:h+2},
			{x:w-4,y:h+4}, {x:w-3,y:h+4}, {x:w-2,y:h+4}, {x:w-1,y:h+4}, {x:w+1,y:h+4}, {x:w+2,y:h+4}, {x:w+3,y:h+4}, {x:w+4,y:h+4}
		]
	];

	templates[Math.floor(Math.random() * templates.length)].forEach(function (pos) { room.add(new Wall(pos.x, pos.y)); });

	// WARNING: The portals may overlap.
	room.addAll(this.makePortals(this.getEmptyCell(room), this.getEmptyCell(room)));

	return room;
};

/*!
 * \fn Cell Game::getEmptyCell(Room room)
 * \private
 * \brief Returns a random empty cell in \p room.
 */
// TODO: This can be a free function.
// TODO: This must not return cells in the doorways.
Game.prototype.getEmptyCell = function (room) {
	var emptyCells = room.getCells(function (cell) {
		return cell.x > 0 && cell.x < room.width - 1 && cell.y > 0 && cell.y < room.height - 1 && cell.entities.length === 0;
	});
	return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

/*!
 * \fn Food Game::makeFood(Cell cell)
 * \private
 * \brief Creates and returns a \c Food object in cell \p cell.
 */
// TODO: This can be a free function.
Game.prototype.makeFood = function (cell) {
	return new Food(cell.x, cell.y);
};

/*!
 * \fn Portal[] Game::makePortals(cell1, cell2)
 * \private
 * \brief Creates and returns an array of linked \c Portal objects in cells \p cell1 and \p cell2.
 */
// TODO: This can be a free function.
Game.prototype.makePortals = function (cell1, cell2) {
	return Portal.makePortals(cell1.x, cell1.y, cell2.x, cell2.y);
};

/*!
 * \fn void Game::update()
 * \public
 * \brief Updates this game by one frame.
 * \return \c false if this game is over; \c true otherwise.
 */
Game.prototype.update = function () {
	if (!this.snake.crashed) {
		this.rooms.forEach(function (room) {
			room.update();
			// Remove any "ghost" snake tails that are entirely out of bounds.
			room.entities.filter(function (entity) {
				return entity instanceof Snake && (entity.x < 0 || entity.x >= room.width || entity.y < 0 || entity.y >= room.height);
			}).forEach(function (snake) {
				function inBounds(snake) {
					return (snake.x > 0 && snake.x < room.width && snake.y > 0 && snake.y < room.height) || (snake.tail && inBounds(snake.tail));
				}

				function remove(snake) {
					room.remove(snake);
					if (snake.tail)
						remove(snake.tail);
				}

				if (!inBounds(snake))
					remove(snake);
			});
		});

		// Move between rooms.
		// TODO: Only if !this.snake.crashed.
		var nextRoom = undefined;
		var nextX = this.snake.x, nextY = this.snake.y;

		if (this.snake.y === -1) {
			nextRoom = this.rooms[this.rooms.indexOf(this.currentRoom) - this.width];
			nextY = nextRoom.height - 1;
		}

		if (this.snake.x === this.currentRoom.width) {
			nextRoom = this.rooms[this.rooms.indexOf(this.currentRoom) + 1];
			nextX = 0;
		}

		if (this.snake.y === this.currentRoom.height) {
			nextRoom = this.rooms[this.rooms.indexOf(this.currentRoom) + this.width];
			nextY = 0;
		}

		if (this.snake.x === -1) {
			nextRoom = this.rooms[this.rooms.indexOf(this.currentRoom) - 1];
			nextX = nextRoom.width - 1;
		}

		if (nextRoom) {
			function moveTo(snake, x, y) {
				snake.x = x;
				snake.y = y;
				if (snake.tail)
					moveTo(snake.tail, x, y);
			}

			function removeSnake(room, snake) {
				room.remove(snake);
				if (snake.tail)
					removeSnake(room, snake.tail);
			}

			function cloneSnake(snake) {
				var cloneHead = new Snake(snake.x, snake.y, snake.direction, 1);
				var tail = snake.tail, clone = cloneHead;

				while (tail) {
					clone.grow();
					clone.tail.x = tail.x;
					clone.tail.y = tail.y;
					tail = tail.tail;
					clone = clone.tail;
				}

				return cloneHead;
			}

			removeSnake(this.currentRoom, this.snake);
			this.currentRoom.add(cloneSnake(this.snake));
			moveTo(this.snake, nextX, nextY);
			this.currentRoom = nextRoom;
			this.currentRoom.add(this.snake);

		}

		// Spawn food if it has been eaten.
		if (!this.currentRoom.contains(function (entity) { return entity instanceof Food; }))
			this.currentRoom.add(this.food = this.makeFood(this.getEmptyCell(this.currentRoom)));
	}

	return !(this.gameover = this.snake.crashed);
};

/*!
 * \fn void Game::drawOn(Renderer renderer)
 * \public
 * \brief Draws the state of this game on \p renderer.
 */
Game.prototype.drawOn = function (renderer) {
	renderer.begin();
	// TODO: Add a drawOn method to room?
	this.currentRoom.entities.forEach(function (entity) { renderer.draw(entity); });
	renderer.end();
};
