/*!
 * \file renderer.js
 * \brief Concept for classes that draw the state of a \c Game.
 */

/*!
 * \class Renderer
 * \brief Concept that allows the state of \c Game objects to be drawn.
 * \sa CanvasRenderer
 * \sa Game::drawOn
 */

/*!
 * \fn void Renderer::begin()
 * \memberof Renderer
 * \public
 * \brief Initializes this renderer for the next frame.
 */

/*!
 * \fn void Renderer::end()
 * \memberof Renderer
 * \public
 * \brief Finalizes this renderer and draws the next frame.
 */

// TODO: Should this method be split into well defined drawX methods?
/*!
 * \fn void Renderer::draw(Entity entity)
 * \memberof Renderer
 * \public
 * \brief Draws \c entity on the next frame.
 */
