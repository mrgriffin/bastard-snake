var testEntity = {
	testMixin: function () {
		//! [mixin]
		function EntityA() {
		}
		Entity.mixin(EntityA);

		EntityA.prototype.onCollide = {
			EntityA: function (a) {
				// ...
			}
		};
		//! [mixin]
	}, testCollide: function () {
		function EntityA() {}
		Entity.mixin(EntityA);

		function EntityB() {}
		Entity.mixin(EntityB);

		//! [collide]
		EntityA.prototype.onCollide = {
			EntityA: function (a) {
				this.hitA = true;
				a.hitByA = true;
			}, EntityB: function (b) {
				this.hitB = true;
				b.hitByA = true;
				return new Entity.MoveAction(this, 1, 1);
			}
		};

		EntityB.prototype.onCollide = {
			EntityA: function (a) {
				this.hitA = true;
				a.hitByB = true;
			}, else: function(e) {
				this.hitElse = true;
				e.hitByB = true;
			}
		};

		var a1, a2, b1, b2;

		a1 = new EntityA();
		b1 = new EntityB();

		// HINT: These two steps are performed by Room::update().
		var actions = [].concat(a1.collide(b1));
		actions.forEach(function (action) { action.apply(); });

		this.assert(a1.hitB && b1.hitByA, "a1.hitB && b1.hitByA");
		this.assert(!a1.hitA && !b1.hitByB, "!a1.hitA && !b1.hitByB");
		this.assert(a1.x === 1 && a1.y === 1, "a1.{x,y} != {1,1}");
		//! [collide]

		b1 = new EntityB();
		a1 = new EntityA();
		b1.collide(a1);
		this.assert(b1.hitA && a1.hitByB, "b1.hitA && a1.hitByB");
		this.assert(!b1.hitElse && !a1.hitByA, "!b1.hitElse && !a1.hitByA");

		a1 = new EntityA();
		a2 = new EntityA();
		a1.collide(a2);
		this.assert(a1.hitA && a2.hitByA, "a1.hitA && a2.hitByA");
		this.assert(!a1.hitB && !a2.hitByB, "!a1.hitB && !a2.hitByB");

		b1 = new EntityB();
		b2 = new EntityB();
		b1.collide(b2);
		this.assert(b1.hitElse && b2.hitByB, "b1.hitElse && b2.hitByB");
		this.assert(!b1.hitA && !b2.hitByA, "!b1.hitA && !b2.hitByA");
	}, testUpdate: function () {
		function EntityA() {}
		Entity.mixin(EntityA);

		//! [update]
		EntityA.prototype.onUpdate = function () {
			this.updated = true;
		};

		var a = new EntityA();
		a.update();
		this.assert(a.updated, "a.updated");
		//! [update]
	}
};

quit(!TestRunner.runAll(testEntity, print));
