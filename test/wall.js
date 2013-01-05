var testWall = {
	// TODO: Does this test really belong in wall?
	testCrash: function () {
		var snake = new Snake(0, 0, Direction.RIGHT, 1);
		var wall = new Wall(1, 0);
		var room = new Room(2, 1);
		room.add(snake);
		room.add(wall);
		room.update();

		this.assert(snake.crashed === true, "!snake.crashed");
	}
};

quit(!TestRunner.runAll(testWall, print));
