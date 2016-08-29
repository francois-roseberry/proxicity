(function () {
	"use strict";
	
	var expect  = require('chai').expect;
	var KijijiProvider = require('../main/kijiji-provider.js');

	describe.skip('A Kijiji provider', function () {
		this.timeout(30000);
		
		var kijijiProvider;
		var homesProduced;
		
		before(function (done) {
			kijijiProvider = new KijijiProvider();
			kijijiProvider.getHomes().subscribe(function (homes) {
				homesProduced = homes;
			}, done, done);
		});
		
		describe('returns a collection of homes that', function () {
			it('have names', function () {
				homesProduced.forEach(function (home) {
					expect(home.name).to.be.a('string');
					expect(home.name).to.not.equal('');
				});
			});
			
			it('have urls', function () {
				homesProduced.forEach(function (home) {
					expect(home.url).to.be.a('string');
					expect(home.url).to.match(/^\/[^ ]*$/);
				});
			});
			
			it('have adresses', function () {
				homesProduced.forEach(function(home) {
					expect(home.address).to.be.a('string');
					expect(home.address).to.not.equal('');
				});
			});
		});
	});
}());