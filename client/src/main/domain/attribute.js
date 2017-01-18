(function () {
	'use strict';
	
	var precondition = require('./contract').precondition;
	var TimeFormatter = require('./time-formatter');
	
	exports.currency = function (id, name) {
		return new Attribute(id, name, function (value) {
			return value + '$';
		});
	};
	
	exports.time = function (id, name) {
		return new Attribute(id, name, TimeFormatter.format);
	};
	
	function Attribute(id, name, format) {
		this._id = id;
		this._name = name;
		this._format = format;
	}
	
	Attribute.prototype.id = function () {
		return this._id;
	};
	
	Attribute.prototype.name = function () {
		return this._name;
	};
	
	Attribute.prototype.format = function (value) {
		return this._format(value);
	};
	
	Attribute.prototype.equals = function (other) {
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
}());