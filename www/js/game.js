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
	 * \property Room Game::currentRoom
	 * \private
	 * \brief The room \c snake is currently in.
	 */
	this.currentRoom = this.makeRoom();

	/*!
	 * \property Snake Game::Snake
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
}

/*!
 * \fs Room Game::makeRoom()
 * \private
 * \brief Creates and returns a \c Room.
 */
Game.prototype.makeRoom = function () {
	var width = 19, height = 19;
	var room = new Room(width, height);

	for (var x = 0; x < width; ++x) {
		room.add(new Wall(x, 0));
		room.add(new Wall(x, height - 1));
	}

	for (var y = 0; y < height; ++y) {
		room.add(new Wall(0, y));
		room.add(new Wall(width - 1, y));
	}

	// WARNING: The portals could share a cell.
	room.addAll(this.makePortals(this.getEmptyCell(room), this.getEmptyCell(room)));

	return room;
};

/*!
 * \fn Cell Game::getEmptyCell(Room room)
 * \private
 * \brief Returns a random empty cell in \p room.
 */
// TODO: This can be a free function.
Game.prototype.getEmptyCell = function (room) {
	var emptyCells = room.getCells(function (cell) { return cell.entities.length === 0; });
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
		this.currentRoom.update();
		if (!this.currentRoom.contains(this.food))
			this.currentRoom.add(this.food = this.makeFood(this.getEmptyCell(this.currentRoom)));
	}

	return !this.snake.crashed;
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
