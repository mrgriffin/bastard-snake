var testFixtures = {
	setUp: function () {
		this.setUp = true;
	}, tearDown: function () {
		this.assert(this.setUp === true, "!this.setUp");
		this.tornDown = true;
	}, testSetUp: function () {
		this.assert(this.setUp === true, "!this.setUp");
	}, testTearDown: function () {
		this.assert(this.tornDown === undefined, "this.tornDown !== undefined");
	}
};

TestRunner.runAll(testFixtures, print);
