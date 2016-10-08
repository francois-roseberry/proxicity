(function () {
    'use strict';
   
	var TimeFormatter = require('./time-formatter');

    describe('A time format', function () {
		it('format 60 as 1 min', function () {
			expect(TimeFormatter.format(60)).to.eql('1 min');
		});
		
		it('format 30 as 30 sec', function () {
			expect(TimeFormatter.format(30)).to.eql('30 sec');
		});
		
		it('format 89 as 1 min', function () {
			expect(TimeFormatter.format(89)).to.eql('1 min');
		});
		
		it('format 90 as 2 min', function () {
			expect(TimeFormatter.format(90)).to.eql('2 min');
		});
	});
}());