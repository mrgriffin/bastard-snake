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
	 * \brief The image used to render the straight body (non-head, non-tail) segments of a snake.
	 */
	this.snakeBody = document.createElement('img');
	this.snakeBody.setAttribute('src', 'img/snake-body.png');

	/*!
	 * \property HTMLImageElement CanvasRenderer::snakeBend
	 * \private
	 * \brief The image used to render the corner body (non-head, non-tail) segments of a snake.
	 */
	this.snakeBend = document.createElement('img');
	this.snakeBend.setAttribute('src', 'img/snake-bend.png');

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
	 * \property Portal[] CanvasRenderer::portals
	 * \private
	 * \brief Portals drawn so far this frame.
	 */
	this.portals = [];

	/*!
	 * \property (Snake | Tail)[][] CanvasRenderer::snakes
	 * \private
	 * \brief Snakes to draw this frame.
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

	function angleBetween(to, via, from) {
		var dxt = to.x - via.x, dyt = to.y - via.y;
		var dxf = via.x - from.x, dyf = via.y - from.y;

		if ((dxt === 1 && dyf === -1) || (dyt === 1 && dxf === -1))
			return 0;
		else if ((dxt === -1 && dyf === -1) || (dyt === 1 && dxf === 1))
			return Math.PI * 0.5;
		else if ((dyt === -1 && dxf === 1) || (dxt === -1 && dyf === 1))
			return Math.PI;
		else if ((dyt === -1 && dxf === -1) || (dxt === 1 && dyf === 1))
			return Math.PI * 1.5;
	}

	// Draw the snakes.
	this.snakes.forEach(function (snake) {
		// Draw the head.
		drawScaledRotated(this.context,
			          this.snakeHead,
			          snake[0].x * 24,
			          snake[0].y * 24,
			          1,
			          1,
			          snake[0].direction.cwRadians());

		var lastSegment = snake[0];
		var tailSegment = snake[snake.length - 1];

		// Draw the body segments.
		for (var i = 1; i < snake.length - 1; ++i) {
			// Skip segments that overlap the previous segment.
			if (snake[i].x === snake[i - 1].x && snake[i].y === snake[i - 1].y)
				continue;

			// Skip segments that overlap the tail.
			if (snake[i].x === tailSegment.x && snake[i].y === tailSegment.y)
				continue;

			if (parallel(snake[i - 1], snake[i], snake[i + 1])) {
				drawScaledRotated(this.context,
				                  this.snakeBody,
				                  snake[i].x * 24,
				                  snake[i].y * 24,
				                  i % 2 && snake[i + 1].y !== snake[i - 1].y ? 1 : -1,
				                  i % 2 && snake[i + 1].x !== snake[i - 1].x ? 1 : -1,
				                  directionBetween(snake[i - 1], snake[i + 1]).cwRadians());
			} else {
				drawScaledRotated(this.context,
				                  this.snakeBend,
				                  snake[i].x * 24,
				                  snake[i].y * 24,
				                  // TODO: Should we be flipping the image under some circumstances?
				                  1,
				                  1,
				                  angleBetween(snake[i - 1], snake[i], snake[i + 1]));
			}

			lastSegment = snake[i];
		}

		// Draw the tail.
		if (snake.length > 1 && (lastSegment.x !== snake[0].x || lastSegment.y !== snake[0].y)) {
			drawScaledRotated(this.context,
			                  this.snakeTail,
			                  tailSegment.x * 24,
			                  tailSegment.y * 24,
			                  1,
			                  1,
			                  directionBetween(lastSegment, snake[snake.length - 1]).cwRadians());
		}
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
		this.context.fillStyle = [ '#7f7fff', '#ff7f00' ][this.portals.length % 2];
		this.context.beginPath();
		this.context.arc(portal.x * 24 + 12, portal.y * 24 + 12, 11, 0, 2 * Math.PI, false);
		this.context.fill();
		this.portals.push(portal);
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
