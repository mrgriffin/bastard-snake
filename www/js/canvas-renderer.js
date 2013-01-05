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
	this.canvas.width = 16 * 19;
	this.canvas.height = 16 * 19;
	/*!
	 * \property Object CanvasRenderer::context
	 * \private
	 * \brief The 2D context of \c canvas.
	 */
	this.context = this.canvas.getContext('2d');
	element.appendChild(this.canvas);
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
};

/*!
 * \fn void CanvasRenderer::end()
 * \public
 * \brief Finalizes the \c canvas element and draws the next frame.
 */
CanvasRenderer.prototype.end = function () {};

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
		this.context.fillRect(food.x * 16 + 1, food.y * 16 + 1, 14, 14);
	/*!
	 * \fn void CanvasRenderer::draw(Portal portal)
	 * \private
	 * \brief Draws a portal.
	 * \detail Portals are drawn as alternating blue and orange circles.
	 */
	}, Portal: function (portal) {
		this.context.fillStyle = [ '#7f7fff', '#ff7f00' ][this.portals++ % 2];
		this.context.beginPath();
		this.context.arc(portal.x * 16 + 8, portal.y * 16 + 8, 7, 0, 2 * Math.PI, false);
		this.context.fill();
	/*!
	 * \fn void CanvasRenderer::draw(Snake snake)
	 * \private
	 * \brief Draws the head of a snake.
	 * \detail Heads are drawn as a blue squares.
	 */
	}, Snake: function (snake) {
		this.context.fillStyle = '#00ff00';
		this.context.fillRect(snake.x * 16 + 1, snake.y * 16 + 1, 14, 14);
	/*!
	 * \fn void CanvasRenderer::draw(Tail tail)
	 * \private
	 * \brief Draws a tail segment of a snake.
	 * \detail Tail segments are drawn as a blue squares.
	 */
	}, Tail: function (tail) {
		this.context.fillStyle = '#00ff00';
		this.context.fillRect(tail.x * 16 + 1, tail.y * 16 + 1, 14, 14);
	/*!
	 * \fn void CanvasRenderer::draw(Wall wall)
	 * \private
	 * \brief Draws a wall.
	 * \detail Walls are drawn as black squares.
	 */
	}, Wall: function (wall) {
		this.context.fillStyle = '#000000';
		this.context.fillRect(wall.x * 16 + 1, wall.y * 16 + 1, 14, 14);
	}
};
