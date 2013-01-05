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
	var width = 19, height = 19;

	/*!
	 * \property Room Game::room
	 * \private
	 * \brief The room \c snake is currently in.
	 */
	this.room = new Room(width, height);

	/*!
	 * \property Snake Game::Snake
	 * \private
	 * \brief The snake that is the protagonist of this game.
	 */
	this.snake = new Snake(Math.floor(width / 2), Math.floor(height / 2), Direction.RIGHT, 3);
	this.room.add(this.snake);

	for (var x = 0; x < width; ++x) {
		this.room.add(new Wall(x, 0));
		this.room.add(new Wall(x, height - 1));
	}

	for (var y = 0; y < height; ++y) {
		this.room.add(new Wall(0, y));
		this.room.add(new Wall(width - 1, y));
	}

	this.room.addAll(this.makePortals());

	/*!
	 * \property Food Game::Food
	 * \private
	 * \brief The current piece of food.
	 */
	this.food = this.makeFood();
	this.room.add(this.food);
}

/*!
 * \fn Cell Game::getEmptyCell()
 * \private
 * \brief Returns a random empty cell in \c room.
 */
Game.prototype.getEmptyCell = function () {
	var emptyCells = this.room.getCells(function (cell) { return cell.entities.length === 0; });
	return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

/*!
 * \fn Food Game::makeFood()
 * \private
 * \brief Creates and returns a \c Food object in an empty cell.
 */
Game.prototype.makeFood = function () {
	var emptyCell = this.getEmptyCell();
	return new Food(emptyCell.x, emptyCell.y);
};

/*!
 * \fn Portal[] Game::makePortals()
 * \private
 * \brief Creates and returns an array of linked \c Portal objects in empty cells.
 */
Game.prototype.makePortals = function () {
	var emptyCell1 = this.getEmptyCell();
	var emptyCell2 = this.getEmptyCell();
	return Portal.makePortals(emptyCell1.x, emptyCell1.y, emptyCell2.x, emptyCell2.y);
};

/*!
 * \fn void Game::update()
 * \public
 * \brief Updates this game by one frame.
 * \return \c false if this game is over; \c true otherwise.
 */
Game.prototype.update = function () {
	if (!this.snake.crashed) {
		this.room.update();
		if (!this.room.contains(this.food)) {
			this.food = this.makeFood();
			this.room.add(this.food);
		}
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
	this.room.entities.forEach(function (entity) { renderer.draw(entity); });
	renderer.end();
};
