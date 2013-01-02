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

	this.food = this.makeFood();
	this.room.add(this.food);
}

/*!
 * \fn Food makeFood()
 * \memberof Game
 * \brief Returns a new Food object in an empty cell.
 */
Game.prototype.makeFood = function () {
	var emptyCells = this.room.getCells(function (cell) { return cell.entities.length === 0; });
	var emptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
	return new Food(emptyCell.x, emptyCell.y);
};
