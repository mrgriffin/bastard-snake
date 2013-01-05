/*!
 * \file action.js
 * \brief Concept for game state altering actions.
 */

/*!
 * \class Action
 * \brief Concept that allows event handlers on an \c Entity to interact with the game state.
 * \sa Entity::MoveAction
 * \sa Room::AddEntityAction
 * \sa Room::RemoveEntityAction
 */
/*!
 * \fn void Action::apply(Room room)
 * \protected
 * \brief Applies this action to \p room.
 */
/*!
 * \overload void Action::apply()
 */
var Action = {
	/*!
	 * \fn bool Action::isAction(Object object)
	 * \public
	 * \brief Returns true if \p object is an \c Action.
	 */
	isAction: function (object) {
		return 'apply' in object;
	}
};
