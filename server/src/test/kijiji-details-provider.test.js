(function () {
	"use strict";
	
	var expect  = require('chai').expect;
	var KijijiListingProvider = require('../main/kijiji-listing-provider');
	var KijijiDetailsProvider = require('../main/kijiji-details-provider');

	describe('A Kijiji details provider', function () {
		this.timeout(10000);
		
		var kijijiProvider;
		var homesProduced;
		
		before(function (done) {
			kijijiProvider = new KijijiDetailsProvider(singleHomeKijijiProvider());
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
			
			it('have prices', function () {
				homesProduced.forEach(function (home) {
					expect(home.price).to.be.a('string');
				});
			});
			
			it('have adresses', function () {
				homesProduced.forEach(function(home) {
					expect(home.address).to.be.a('string');
					expect(home.address).to.not.equal('');
				});
			});
		});
		
		function singleHomeKijijiProvider() {
			return {
				getHomes: function () {
					return new KijijiListingProvider().getHomes().map(function (homes) {
						return [homes[0]];
					});
				}
			};
		}
	});
}());