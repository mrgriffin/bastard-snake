var testFood = {
	// TODO: Does this test really belong in food?
	testEaten: function () {
		var snake = new Snake(0, 0, Direction.RIGHT, 1);
		var food = new Food(1, 0);
		var room = new Room(2, 1);
		room.add(snake);
		room.add(food);
		room.update();

		this.assert(!room.contains(food), "room.contains(food)");
		this.assert(room.contains(snake), "!room.contains(snake)");
		this.assert(snake.tail !== undefined, "snake.tail === undefined");
		this.assert(snake.tail.x === snake.x && snake.tail.y === snake.y, "snake.tail.{x,y} !== snake.{x,y}");
		this.assert(room.contains(snake.tail), "!room.contains(snake.tail)");
		this.assert(snake.tail.tail === undefined, "snake.tail.tail !== undefined");
	}
};

TestRunner.runAll(testFood, print);
