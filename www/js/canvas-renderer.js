/*!
 * \file canvas-renderer.js
 * \brief Renders a Game onto a \c canvas element.
 */

/*!
 * \class CanvasRenderer
 * \implements Renderer
 * \brief Renders a Game onto a \c canvas element.
 */
/*!
 * \fn CanvasRenderer()
 * \memberof CanvasElement
 * \brief Constructs a new Renderer that uses the HTML5 \c canvas element.
 */
function CanvasRenderer(element) {
	this.canvas = document.createElement('canvas');
	this.canvas.width = 16 * 9;
	this.canvas.height = 16 * 9;
	this.context = this.canvas.getContext('2d');
	element.appendChild(this.canvas);
}

CanvasRenderer.prototype.begin = function () {
	// HINT: Resets the canvas element.
	this.canvas.width = this.canvas.width;
};

CanvasRenderer.prototype.end = function () {};

// TODO: Should this method be split into well defined drawX methods?
CanvasRenderer.prototype.draw = function (entity) {
	var drawEntity = this.drawEntity[entity.name];
	if (drawEntity)
		drawEntity.call(this, entity);
	// TODO: Throw a TypeError if entity is not an Entity.
};

CanvasRenderer.prototype.drawEntity = {
	Food: function (food) {
		this.context.fillStyle = '#ff0000';
		this.context.fillRect(food.x * 16 + 1, food.y * 16 + 1, 14, 14);
	}, Snake: function (snake) {
		this.context.fillStyle = '#00ff00';
		this.context.fillRect(snake.x * 16 + 1, snake.y * 16 + 1, 14, 14);
	}, Tail: function (tail) {
		this.context.fillStyle = '#00ff00';
		this.context.fillRect(tail.x * 16 + 1, tail.y * 16 + 1, 14, 14);
	}, Wall: function (wall) {
		this.context.fillStyle = '#000000';
		this.context.fillRect(wall.x * 16 + 1, wall.y * 16 + 1, 14, 14);
	}
};
