"use strict";

const expect  = require('chai').expect;
const KijijiListingProvider = require('../main/kijiji-listing-provider');

describe('A Kijiji listing provider', function () {
	this.timeout(10000);
	
	var kijijiProvider;
	var homesProduced;
	
	before(function (done) {
		kijijiProvider = new KijijiListingProvider();
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
	});
});