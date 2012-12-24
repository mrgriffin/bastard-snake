/*!
 * \file unit-test.js
 * \brief Basic unit testing framework.
 */

/*!
 * \class TestRunner
 */
var TestRunner = (function () {
	/*!
	 * \class UnitTest
	 * \brief Utility functions for checking invariants.
	 */
	function UnitTest() {}

	function AssertionError(message) {
		// TODO: Is this really necessary?
		this.name = "AssertionError";
		this.message = message;
	}

	/*!
	 * \fn void assert(condition, message)
	 * \memberof UnitTest
	 * \brief Causes this test case to fail with the message \p message if \p condition is \c false.
	 */
	UnitTest.prototype.assert = function (condition, message) {
		if (!condition)
			throw new AssertionError(message);
	};

	function run(name, func, logger, setUp, tearDown) {
		try {
			var unitTest = new UnitTest();
			if (setUp !== undefined)
				setUp.call(unitTest);
			func.call(unitTest);
			if (tearDown !== undefined)
				tearDown.call(unitTest);
		} catch (e) {
			// TODO: Print a nicely formatted error message.
			logger(name + (e.name ? "(" + e.name + ")" : "") + (e.message ? ": " + e.message : ""));
			return false;
		}
		return true;
	}

	/*!
	 * \fn bool runAll(tests, print)
	 * \memberof TestRunner
	 * \brief Runs all the test cases named \c test... in tests.
	 * \detail Methods in \c UnitTest such as \c assert are made available via \c this during the evaluation of a test case.
	 *         The methods setUp and tearDown are called before and after each test case respectively if they are defined.
	 * \param tests an object that contains the test case functions to be evaluated.
	 * \param logger a function accepting a \c String that logs the test output.
	 * \return true if all tests succeeded; false otherwise.
	 * \sa UnitTest
	 */
	// TODO: Replace logger with onFail(name, exception).
	function runAll(tests, logger) {
		var count = 0, failures = 0;

		var setUp = tests.setUp;
		var tearDown = tests.tearDown;

		for (var property in tests) {
			if (/test.+/.test(property)) {
				count += 1;
				if (!run(property, tests[property], logger, setUp, tearDown))
					failures++;
			}
		}

		logger(failures + " " + (failures === 1 ? "failure" : "failures"));

		return failures === 0;
	}

	return { runAll: runAll };
}());
