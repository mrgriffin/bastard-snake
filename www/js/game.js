/*!
 * \file game.js
 * \brief Class that contains the game state.
 */

/*!
 * \class Game
 * \brief The game state.
 */
/*!
 * \fn Game()
 * \memberof Game
 * \brief Constructs a new game.
 */
function Game() {
	var width = 9, height = 9;

	this.room = new Room(width, height);

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

	this.food = this.makeFood();
	this.room.add(this.food);
}

/*!
 * \fn Cell getEmptyCell()
 * \memberof Game
 * \brief Returns a random empty cell.
 */
Game.prototype.getEmptyCell = function () {
	var emptyCells = this.room.getCells(function (cell) { return cell.entities.length === 0; });
	return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

/*!
 * \fn Food makeFood()
 * \memberof Game
 * \brief Returns a new Food object in an empty cell.
 */
Game.prototype.makeFood = function () {
	var emptyCell = this.getEmptyCell();
	return new Food(emptyCell.x, emptyCell.y);
};

/*!
 * \fn Portal[] makePortals()
 * \memberof Game
 * \brief Returns an array of new Portal objects in empty cells.
 */
Game.prototype.makePortals = function () {
	var emptyCell1 = this.getEmptyCell();
	var emptyCell2 = this.getEmptyCell();
	return Portal.makePortals(emptyCell1.x, emptyCell1.y, emptyCell2.x, emptyCell2.y);
};

/*!
 * \fn void update()
 * \memberof Game
 * \brief Updates this game by one frame.
 * \return \c false if the game is over; \c true otherwise.
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
 * \fn void drawOn(renderer)
 * \memberof Game
 * \brief Draws this game state on \p renderer.
 */
Game.prototype.drawOn = function (renderer) {
	renderer.begin();
	// TODO: Add a drawOn method to room?
	this.room.entities.forEach(function (entity) { renderer.draw(entity); });
	renderer.end();
};
