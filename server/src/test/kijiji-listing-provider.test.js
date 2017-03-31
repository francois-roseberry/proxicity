"use strict";

const expect  = require('chai').expect;
const KijijiListingProvider = require('../main/kijiji-listing-provider');

describe('A Kijiji listing provider', function () {
	this.timeout(10000);
	
	var kijijiProvider;
	var homesProduced;
	
	before((done) => {
		kijijiProvider = new KijijiListingProvider();
		kijijiProvider.getHomes().subscribe((homes) => {
			homesProduced = homes;
		}, done, done);
	});
	
	describe('returns a collection of homes that', () => {
		it('have names', () => {
			homesProduced.forEach((home) => {
				expect(home.name).to.be.a('string');
				expect(home.name).to.not.equal('');
			});
		});
		
		it('have urls', () => {
			homesProduced.forEach((home) => {
				expect(home.url).to.be.a('string');
				expect(home.url).to.match(/^\/[^ ]*$/);
			});
		});
	});
});