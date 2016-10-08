(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;
	var i18n = require('./i18n').i18n();

    exports.format = function (seconds) {
		precondition(_.isNumber(seconds), 'Formatting time requires an amount of seconds');
		
		if (seconds >= 60) {
			return Math.round(seconds/60) + ' ' + i18n.TIME_FORMAT_MIN;
		}
		
		return seconds%60 + ' ' + i18n.TIME_FORMAT_SEC;
    };
}());