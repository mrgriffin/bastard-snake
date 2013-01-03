var testRoom = {
	testAdd: function () {
		var room = new Room(1, 1);

		function E0() { this.x = 0; this.y = 0; }
		Entity.mixin(E0);
		E0.prototype.onAdd = function () { return Room.addEntity(new E1()); };

		function E1() { this.x = 0; this.y = 0; }
		Entity.mixin(E1);

		room.add(new E0());

		this.assert(room.entities.length === 2, "entities.length !== 2");
		this.assert(room.contains(function (e) { return e instanceof E0; }, "!contains(e instanceof E0)"));
		this.assert(room.contains(function (e) { return e instanceof E1; }, "!contains(e instanceof E1)"));
	}, testAddAll: function () {
		var room = new Room(1, 1);

		function E() { this.x = 0; this.y = 0; }
		Entity.mixin(E);

		var e1 = new E(), e2 = new E();

		room.addAll([ e1, e2 ]);

		this.assert(room.entities.length === 2, "entities.length !== 2");
		this.assert(room.contains(e1), "!contains(e1)");
		this.assert(room.contains(e2), "!contains(e2)");
	}, testGetCells: function () {
		var room = new Room(2, 1);

		function E() { this.x = 0; this.y = 0; }
		Entity.mixin(E);

		var e = new E();
		room.add(e);

		var es = room.getCells(function (cell) { return cell.entities.some(function (entity) { return entity instanceof E; }); });
		this.assert(es.length === 1 && es[0].x === e.x && es[0].y === e.y && es[0].entities[0] === e, "room.getCells(instanceof E) !== [ e ]");

		var ns = room.getCells(function (cell) { return cell.entities.length === 0; });
		this.assert(ns.length === 1 && ns[0].x === 1 && ns[0].y === 0, "room.getCells(entities.length === 0) !== []");

		var all = room.getCells(function (cell) { return true; });
		this.assert(all.length === 2, "room.getCells(true).length !== 2");
		this.assert(all.some(function (cell) { return cell.x === 0 && cell.y === 0; }), "!room.getCells(true).contains({0,0})");
		this.assert(all.some(function (cell) { return cell.x === 1 && cell.y === 0; }), "!room.getCells(true).contains({1,0})");
	}, testUpdate: function () {
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
