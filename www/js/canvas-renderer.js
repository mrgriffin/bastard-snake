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
	 * \property HTMLCanvasElement CanvasRenderer::canvas
	 * \private
	 * \brief The \c canvas element that this renders on.
	 */
	this.canvas = document.createElement('canvas');
	this.canvas.width = 24 * 15;
	this.canvas.height = 24 * 15;
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

	/*!
	 * \property HTMLImageElement[] CanvasRenderer::wall
	 * \private
	 * \brief The images used to render walls with \c n segments.
	 */
	this.wall = [];
	this.wall[0] = document.createElement('img');
	this.wall[0].setAttribute('src', 'img/wall-0.png');
	this.wall[1] = document.createElement('img');
	this.wall[1].setAttribute('src', 'img/wall-1.png');
	this.wall[2] = [];
	this.wall[2][0] = document.createElement('img');
	this.wall[2][0].setAttribute('src', 'img/wall-2s.png');
	this.wall[2][1] = document.createElement('img');
	this.wall[2][1].setAttribute('src', 'img/wall-2c.png');
	this.wall[3] = document.createElement('img');
	this.wall[3].setAttribute('src', 'img/wall-3.png');
	this.wall[4] = document.createElement('img');
	this.wall[4].setAttribute('src', 'img/wall-4.png');

	/*!
	 * \property HTMLImageElement CanvasRenderer::food
	 * \private
	 * \brief The image used to render food.
	 */
	this.food = document.createElement('img');
	this.food.setAttribute('src', 'img/food.png');
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

	/*!
	 * \property Wall[] CanvasRenderer::walls
	 * \private
	 * \brief Walls to draw this frame.
	 */
	this.walls = [];

	// TODO: Have a draw(Room) method so we don't need to hard room sizes.
	this.roomWidth = this.roomHeight = 15;
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

	// Draw the walls.
	this.walls.forEach(function (wall) {
		var neighbors = [
			wall.y !== 0 ? !!this.walls[(wall.y - 1) * this.roomHeight + wall.x] : true,
			wall.x !== this.roomWidth - 1 ? !!this.walls[wall.y * this.roomHeight + wall.x + 1] : true,
			wall.y !== this.roomHeight - 1 ? !!this.walls[(wall.y + 1) * this.roomHeight + wall.x] : true,
			wall.x !== 0 ? !!this.walls[wall.y * this.roomHeight + wall.x - 1] : true
		];

		// Number of neighbors that are set to true.
		var actualNeighbors = neighbors.reduce(function (count, wall) { return count + (wall ? 1 : 0); }, 0);

		var image = this.wall[actualNeighbors];
		var angle;

		switch (actualNeighbors) {
		case 0: angle = 0; break;
		case 1: angle = Math.PI * neighbors.indexOf(true) / 2; break;
		case 2:
			if (neighbors[0] && neighbors[2] || neighbors[1] && neighbors[3]) {
				image = this.wall[2][0];
				angle = neighbors[0] ? 0 : Math.PI * 0.5;
			} else {
				image = this.wall[2][1];
				// HINT: -2 is out of the domain of this function.
				angle = Math.PI * neighbors.reduce(function (first, value, index) { return (!value || first === index - 1) ? first : index }, -2) / 2;
			}
			break;
		case 3: angle = Math.PI * neighbors.indexOf(false) / 2; break;
		case 4: angle = 0; break;
		}
		
		drawScaledRotated(this.context, image, wall.x * 24, wall.y * 24, 1, 1, angle);
	}, this);

	// Returns the direction between to and from, or undefined if they are not adjacent.
	function directionBetween(to, from) {
		if (Math.abs(to.x - from.x) + Math.abs(to.y - from.y) !== 1)
			return undefined;
		else if (to.y < from.y)
			return Direction.UP;
		else if (to.x > from.x)
			return Direction.RIGHT;
		else if (to.y > from.y)
			return Direction.DOWN;
		else
			return Direction.LEFT;
	}

	function angleBetween(dirTo, dirFrom) {
		if ((dirTo.x === 1 && dirFrom.y === -1) || (dirTo.y === 1 && dirFrom.x === -1))
			return 0;
		else if ((dirTo.x === -1 && dirFrom.y === -1) || (dirTo.y === 1 && dirFrom.x === 1))
			return Math.PI * 0.5;
		else if ((dirTo.y === -1 && dirFrom.x === 1) || (dirTo.x === -1 && dirFrom.y === 1))
			return Math.PI;
		else if ((dirTo.y === -1 && dirFrom.x === -1) || (dirTo.x === 1 && dirFrom.y === 1))
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

			// Skip segments that overlap the tail unless at an edge.
			if (snake[i].x === tailSegment.x && snake[i].y === tailSegment.y &&
			    !(snake[i].x === 0 || snake[i].x === this.roomWidth - 1 || snake[i].y === 0 || snake[i].y === this.roomHeight - 1))
				continue;

			var dirFrom = directionBetween(snake[i], snake[i + 1]);
			var dirTo = directionBetween(snake[i - 1], snake[i]);

			if (!dirFrom || !dirTo || dirFrom === dirTo) {
				drawScaledRotated(this.context,
				                  this.snakeBody,
				                  snake[i].x * 24,
				                  snake[i].y * 24,
				                  i % 2 && snake[i + 1].y !== snake[i - 1].y ? 1 : -1,
				                  i % 2 && snake[i + 1].x !== snake[i - 1].x ? 1 : -1,
				                  (dirFrom ? dirFrom : dirTo).cwRadians());
			} else {
				drawScaledRotated(this.context,
				                  this.snakeBend,
				                  snake[i].x * 24,
				                  snake[i].y * 24,
				                  // TODO: Should we be flipping the image under some circumstances?
				                  1,
				                  1,
				                  angleBetween(dirTo, dirFrom));
			}

			lastSegment = snake[i];
		}

		// Draw the tail unless it overlaps the head, or overlaps a segment at an edge.
		if (snake.length > 1 && (tailSegment.x !== snake[0].x || tailSegment.y !== snake[0].y) &&
		    !((tailSegment.x === 0 || tailSegment.x === this.roomWidth - 1 || tailSegment.y === 0 || tailSegment.y === this.roomHeight - 1) &&
		      tailSegment.x === lastSegment.x && tailSegment.y === lastSegment.y)) {
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
		this.context.drawImage(this.food, food.x * 24, food.y * 24);
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
		this.walls[wall.y * this.roomWidth + wall.x] = wall;
	}
};
