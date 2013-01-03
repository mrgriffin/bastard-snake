function E0() {}
Entity.mixin(E0);
E0.prototype.onUpdate = function () { this.updated = true; };

function E1() {
	this.hitE0 = false;
	this.hitE1 = false;
}
Entity.mixin(E1);
E1.prototype.onCollide = {
	E0: function () { this.hitE0 = true; },
	E1: function () { this.hitE1 = true; },
};

var testEntity = {
	testCollide: function () {
		var self = this;

		var hitE0 = false;
		var e0 = new E0();
		e0.onCollide = {
			E0: function () { hitE0 = true; },
			E1: function () { self.assert(false, "e0.onCollide(E1)"); }
		};
		e0.collide(e0);
		this.assert(hitE0 === true, "!e0.onCollide(E0)");

		var e1 = new E1();
		e1.collide(e0);
		this.assert(e1.hitE0 === true, "!e1.onCollide(E0)");
		this.assert(e1.hitE1 === false, "e1.onCollide(E1)");

		e1 = new E1();
		e1.collide(e1);
		this.assert(e1.hitE0 === false, "e1.onCollide(E0)");
		this.assert(e1.hitE1 === true, "!e1.onCollide(E1)");
	}, testCollideElse: function () {
		var e0 = new E0();
		e0.onCollide = { else: function (that) { this.hitElse = true; } };

		e0.collide(e0);
		this.assert(e0.hitElse === true, "!e0.hitElse");
	}, testUpdate: function () {
		var e0 = new E0();
		e0.update();
		this.assert(e0.updated === true, "!e0.updated");
	}
};

TestRunner.runAll(testEntity, print);
