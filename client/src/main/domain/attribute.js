'use strict';

var precondition = require('./contract').precondition;
var TimeFormatter = require('./time-formatter');

exports.currency = (id, name) => {
	return new Attribute(id, name, (value) => {
		return value + '$';
	});
};

exports.time = (id, name) => {
	return new Attribute(id, name, TimeFormatter.format);
};

exports.distance = (id, name) => {
	return new Attribute(id, name, (value) => {
		return value + 'm';
	});
};

class Attribute {
	constructor(id, name, format) {
		this._id = id;
		this._name = name;
		this._format = format;
	}

	id() {
		return this._id;
	};

	name() {
		return this._name;
	};

	format(value) {
		return this._format(value);
	};

	equals(other) {
		precondition(other, 'Testing an attribute for equality with another thing requires that other thing');

		if (other === this) {
			return true;
		}

		if (!(other instanceof Attribute)) {
			return false;
		}

		if (this._id !== other._id) {
			return false;
		}

		if (this._name !== other._name) {
			return false;
		}

		var value = 1;

		if (this._format(value) !== other._format(value)) {
			return false;
		}

		return true;
	};
}
