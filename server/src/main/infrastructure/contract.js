"use strict";

exports.precondition = (condition, message) => {
	if (!condition) {
		throw new Error(message);
	}
};