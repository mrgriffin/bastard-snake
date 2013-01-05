/*!
 * \file canvas-renderer.js
 * \brief Renders a \c Game onto a \c canvas element.
 */

/*!
 * \class CanvasRenderer
 * \implements Renderer
 * \brief Renders a \c Game onto a \c canvas element.
 */
/*!
 * \fn CanvasRenderer::CanvasRenderer(HTMLElement element)
 * \public
 * \brief Constructs a renderer that uses the HTML5 \c canvas element.
 */
function CanvasRenderer(element) {
	/*!
	 * \property HTMLElement CanvasRenderer::canvas
	 * \private
	 * \brief The \c canvas element that this renders on.
	 */
	this.canvas = document.createElement('canvas');
	this.canvas.width = 24 * 19;
	this.canvas.height = 24 * 19;
	/*!
	 * \property CanvasRenderingContext2D CanvasRenderer::context
	 * \private
	 * \brief The 2D context of \c canvas.
	 */
	this.context = this.canvas.getContext('2d');
	element.appendChild(this.canvas);

	// TODO: Introduce onload event listeners and have a loaded boolean.

	/*!
	 * \property HTMLImageElement CanvasRenderer::snakeHead
	 * \private
	 * \brief The image used to render the head segment of a snake.
	 */
	this.snakeHead = document.createElement('img');
	this.snakeHead.setAttribute('src', 'img/snake-head.png');

	/*!
	 * \property HTMLImageElement CanvasRenderer::snakeBody
	 * \private
	 * \brief The image used to render the body (non-head, non-tail) segments of a snake.
	 */
	this.snakeBody = document.createElement('img');
	this.snakeBody.setAttribute('src', 'img/snake-body.png');

	/*!
	 * \property HTMLImageElement CanvasRenderer::snakeTail
	 * \private
	 * \brief The image used to render the tail segment of a snake.
	 */
	this.snakeTail = document.createElement('img');
	this.snakeTail.setAttribute('src', 'img/snake-tail.png');
}

/*!
 * \fn void CanvasRenderer::begin()
 * \public
 * \brief Initializes the \c canvas element for the next frame.
 */
CanvasRenderer.prototype.begin = function () {
	// HINT: Resets the canvas element.
	this.canvas.width = this.canvas.width;

	/*!
	 * \property int CanvasRenderer::portals
	 * \private
	 * \brief Count of portals drawn so far this frame.
	 */
	this.portals = 0;

	/*!
	 * \property (Snake | Tail)[][] CanvasRenderer::snakes
	 * \private
	 * \brief Array of the snakes to render this frame.
	 */
	this.snakes = [];
};

/*!
 * \fn void CanvasRenderer::end()
 * \public
 * \brief Finalizes the \c canvas element and draws the next frame.
 */
CanvasRenderer.prototype.end = function () {
	function drawScaledRotated(context, image, x, y, sx, sy, angle) {
		context.save();
		context.translate(x + image.width / 2, y + image.width / 2);
		context.scale(sx, sy);
		context.rotate(angle);
		context.drawImage(image, -image.width / 2, -image.height / 2);
		context.restore();
	}

	function parallel(entity1, entity2, entity3) {
		return (entity1.x === entity2.x && entity1.x === entity3.x) ||
		       (entity1.y === entity2.y && entity1.y === entity3.y);
	}

	// WARNING: assumes entity1 and entity2 are parallel.
	function directionBetween(to, from) {
		if (to.y < from.y)
			return Direction.UP;
		else if (to.x > from.x)
			return Direction.RIGHT;
		else if (to.y > from.y)
			return Direction.DOWN;
		else
			return Direction.LEFT;
	}

	// Draw the snakes.
	this.snakes.forEach(function (snake) {
		// Draw the head.
		drawScaledRotated(this.context, this.snakeHead, snake[0].x * 24, snake[0].y * 24, 1, 1, snake[0].direction.cwRadians());

		// Draw the body segments.
		for (var i = 1; i < snake.length - 1; ++i) {
			if (parallel(snake[i - 1], snake[i], snake[i + 1]))
				drawScaledRotated(this.context, this.snakeBody, snake[i].x * 24, snake[i].y * 24, 1, i % 2 ? 1 : -1, directionBetween(snake[i - 1], snake[i + 1]).cwRadians());
		}

		// Draw the tail.
		if (snake.length > 1)
			drawScaledRotated(this.context, this.snakeTail, snake[snake.length - 1].x * 24, snake[snake.length - 1].y * 24, 1, 1, directionBetween(snake[snake.length - 2], snake[snake.length - 1]).cwRadians());
	}, this);
};

/*!
 * \fn void CanvasRenderer::draw(Entity entity)
 * \public
 * \brief Draws \c entity on the next frame.
 * \exception TypeError the type of \p entity does not mixin \c Entity.
 */
CanvasRenderer.prototype.draw = function (entity) {
	if (!Entity.isEntity(entity))
		throw new TypeError("CanvasRenderer::draw: type of entity does not mixin Entity");
	var drawEntity = this.drawEntity[entity._entity_name];
	if (drawEntity)
		drawEntity.call(this, entity);
};

CanvasRenderer.prototype.drawEntity = {
	/*!
	 * \fn void CanvasRenderer::draw(Food food)
	 * \private
	 * \brief Draws a piece of food.
	 * \detail Food is drawn as a red square.
	 */
	Food: function (food) {
		this.context.fillStyle = '#ff0000';
		this.context.fillRect(food.x * 24 + 1, food.y * 24 + 1, 22, 22);
	/*!
	 * \fn void CanvasRenderer::draw(Portal portal)
	 * \private
	 * \brief Draws a portal.
	 * \detail Portals are drawn as alternating blue and orange circles.
	 */
	}, Portal: function (portal) {
		this.context.fillStyle = [ '#7f7fff', '#ff7f00' ][this.portals++ % 2];
		this.context.beginPath();
		this.context.arc(portal.x * 24 + 12, portal.y * 24 + 12, 11, 0, 2 * Math.PI, false);
		this.context.fill();
	/*!
	 * \fn void CanvasRenderer::draw(Snake snake)
	 * \private
	 * \brief Draws the head of a snake.
	 * \detail Heads are drawn as a blue squares.
	 */
	}, Snake: function (snake) {
		this.snakes[this.snakes.length] = [ snake ];
	/*!
	 * \fn void CanvasRenderer::draw(Tail tail)
	 * \private
	 * \brief Draws a tail segment of a snake.
	 * \detail Tail segments are drawn as a blue squares.
	 */
	}, Tail: function (tail) {
		this.snakes[this.snakes.length - 1].push(tail);
	/*!
	 * \fn void CanvasRenderer::draw(Wall wall)
	 * \private
	 * \brief Draws a wall.
	 * \detail Walls are drawn as black squares.
	 */
	}, Wall: function (wall) {
		this.context.fillStyle = '#000000';
		this.context.fillRect(wall.x * 24 + 1, wall.y * 24 + 1, 22, 22);
	}
};
