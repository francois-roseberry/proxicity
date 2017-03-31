"use strict";

exports.precondition = function(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
};