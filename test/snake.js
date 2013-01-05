var testSnake = {
	testCtor: function () {
		var snake = new Snake(0, 1, Direction.RIGHT, 3);
		this.assert(snake.x === 0, "snake.x !== 0");
		this.assert(snake.y === 1, "snake.y !== 1");
		this.assert(snake.direction === Direction.RIGHT, "snake.direction !== RIGHT");
		this.assert(snake.tail !== undefined, "snake.tail !== undefined");
		this.assert(snake.tail.tail !== undefined, "snake.tail.tail !== undefined");
		this.assert(snake.tail.tail.tail === undefined, "snake.tail.tail.tail === undefined");
	}, testUpdate: function () {
		var room = new Room(3, 1);

		var snake = new Snake(0, 0, Direction.RIGHT, 3);
		room.add(snake);

		this.assert(snake.x === 0 && snake.y === 0, "snake.{x,y} !== {0,0}");

		room.update();
		this.assert(snake.x === 1 && snake.y === 0, "snake.{x,y} !== {1,0}");
		this.assert(snake.tail.x === 0 && snake.tail.y === 0, "snake.tail.{x,y} !== {0,0}");

		room.update();
		this.assert(snake.x === 2 && snake.y === 0, "snake.{x.y} !== {2,0}");
		this.assert(snake.tail.x === 1 && snake.y === 0, "snake.tail.{x,y} !== {1,0}");
		this.assert(snake.tail.tail.x === 0 && snake.tail.tail.y === 0, "snake.tail.tail.{x,y} !== {0,0}");
	}, testCrash: function () {
		var room = new Room(3, 1);

		var snake = new Snake(0, 0, Direction.RIGHT, 3);
		room.add(snake);

		room.update();
		room.update();
		snake.newDirection = Direction.LEFT;
		room.update();
		this.assert(snake.crashed === true, "snake did not crash");
	}
};

quit(!TestRunner.runAll(testSnake, print));
