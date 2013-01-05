var testGame = {
	testCtor: function () {
		// TODO: Should Game take some parameters?
		var game = new Game();

		this.assert(game.currentRoom.contains(function (e) { return e instanceof Snake; }), "!game.room.contains(instanceof Snake)");
		this.assert(game.currentRoom.contains(function (e) { return e instanceof Food; }), "!game.room.contains(instanceof Food)");
	}
};

quit(!TestRunner.runAll(testGame, print));
