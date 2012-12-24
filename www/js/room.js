/*!
 * \file room.js
 * \brief Contains a set of entities.
 */

/*!
 * \class Room
 * \brief Contains a set of entities.
 */
function Room(width, height) {
	this.width = width;
	this.height = height;
	this.entities = [];
}

Room.prototype.add = function (entity) {
	this.entities.push(entity);
};

Room.prototype.update = function () {
	this.entities.forEach(function (entity) { entity.update(); });

	for (var i = 0; i < this.entities.length; ++i) {
		for (var j = i + 1; j < this.entities.length; ++j) {
			if (this.entities[i].x === this.entities[j].x && this.entities[i].y === this.entities[j].y) {
				this.entities[i].onCollide(this.entities[j]);
				this.entities[j].onCollide(this.entities[i]);
			}
		}
	}
};
