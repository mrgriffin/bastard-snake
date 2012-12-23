var testDirection = {
	testEquals: function () {
		this.assert(Direction.UP === Direction.UP, "UP !== UP");
		this.assert(Direction.RIGHT === Direction.RIGHT, "RIGHT !== RIGHT");
		this.assert(Direction.DOWN === Direction.DOWN, "DOWN !== DOWN");
		this.assert(Direction.LEFT === Direction.LEFT, "LEFT !== LEFT");
	}, testCW: function () {
		this.assert(Direction.UP.cw() === Direction.RIGHT, "UP.cw() !== RIGHT");
		this.assert(Direction.RIGHT.cw() === Direction.DOWN, "RIGHT.cw() !== DOWN");
		this.assert(Direction.DOWN.cw() === Direction.LEFT, "DOWN.cw() !== LEFT");
		this.assert(Direction.LEFT.cw() === Direction.UP, "LEFT.cw() !== UP");
	}, testCCW: function () {
		this.assert(Direction.UP.ccw() === Direction.LEFT, "UP.ccw() !== LEFT");
		this.assert(Direction.RIGHT.ccw() === Direction.UP, "RIGHT.ccw() !== UP");
		this.assert(Direction.DOWN.ccw() === Direction.RIGHT, "DOWN.ccw() !== RIGHT");
		this.assert(Direction.LEFT.ccw() === Direction.DOWN, "LEFT.ccw() !== DOWN");
	}
};

TestRunner.runAll(testDirection, print);
