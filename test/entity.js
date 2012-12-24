function E0() {}
E0.prototype = Entity;

function E1() {}
E1.prototype = Entity;

var testEntity = {
	// TODO: Refactor this into multiple functions.
	testOnCollision: function () {
		var test = this;

		var hitE0 = false;

		var e0 = new E0();
		e0.collisionHandlers = {
			E0: function () { hitE0 = true; },
			E1: function () { this.assert(false, "e0.onCollide(E1)"); }
		};

		e0.onCollide(e0);
		this.assert(hitE0 === true, "!e0.onCollide(E0)");


		hitE0 = false;
		var hitE1 = false;

		E1.prototype.collisionHandlers = {
			E0: function () { hitE0 = true; },
			E1: function () { hitE1 = true; },
		};
		var e1 = new E1();

		e1.onCollide(e0);
		this.assert(hitE0 === true, "!e1.onCollide(E0)");
		this.assert(hitE1 === false, "e1.onCollide(E1)");

		hitE0 = false;
		hitE1 = false;

		e1.onCollide(e1);
		this.assert(hitE0 === false, "e1.onCollide(E0)");
		this.assert(hitE1 === true, "!e1.onCollide(E1)");
	}
};

TestRunner.runAll(testEntity, print);
