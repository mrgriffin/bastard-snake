var testRoom = {
	testUpdate: function () {
		var self = this;
		var room = new Room(3, 1);

		function E0(x, y, vx, vy) {
			this.x = x;
			this.y = y;
			this.vx = vx;
			this.vy = vy;
		}
		Entity.mixin(E0);
		E0.prototype.onUpdate = function () {
			this.updated = true;
		};
		E0.prototype.onCollide = {
			E0: function (that) {
				self.assert(this.updated && that.updated, "onCollide before onUpdate");
				self.assert(this.collision === undefined, "onCollide called twice");
				this.collision = that;
				return [ Room.removeEntity(this), Room.removeEntity(that) ];
			}
		};

		var e0 = new E0(0, 0, 1, 0);
		var e1 = new E0(2, 0, -1, 0);
		var e2 = new E0(0, 0, 0, 0);
		var e3 = new E0(2, 0, 0, 0);

		e2.onUpdate = function () {
			return Room.addEntity(e3);
		};

		room.add(e0);
		room.add(e1);
		room.add(e2);

		room.update();
		this.assert(e0.collision === e1, "e0.collision !== e1");
		this.assert(e1.collision === e0, "e1.collision !== e0");
		this.assert(e2.collision === undefined, "e2.collision !== undefined");
		this.assert(!room.contains(e0), "e0 in room");
		this.assert(!room.contains(e1), "e1 in room");
		this.assert(room.contains(e2), "e2 not in room");
		this.assert(room.contains(function (entity) { return entity === e3; }), "e3 not in room");
	}
};

TestRunner.runAll(testRoom, print);
