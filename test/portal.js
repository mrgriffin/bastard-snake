var testPortal = {
	testCollision: function () {
		function E(x, y) { this.x = x; this.y = y; }
		Entity.mixin(E);

		var room = new Room(2, 1);
		var portals = Portal.makePortals(0, 0, 1, 0);
		var e = new E(0, 0);

		room.addAll(portals);
		room.add(e);
		room.update();

		this.assert(e.x === 1 && e.y === 0, "e.{x,y} !== {1,0}");
	}
};

quit(!TestRunner.runAll(testPortal, print));
