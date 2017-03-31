"use strict";

const expect  = require('chai').expect;
const KijijiListingProvider = require('../main/kijiji-listing-provider');
const KijijiDetailsProvider = require('../main/kijiji-details-provider');

describe('A Kijiji details provider', function () {
	this.timeout(10000);
	
	var kijijiProvider;
	var homesProduced;
	
	before((done) => {
		kijijiProvider = new KijijiDetailsProvider(singleHomeKijijiProvider());
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
		
		it('have prices', () => {
			homesProduced.forEach((home) => {
				expect(home.price).to.be.a('string');
			});
		});
		
		it('have adresses', () => {
			homesProduced.forEach((home) => {
				expect(home.address).to.be.a('string');
				expect(home.address).to.not.equal('');
			});
		});
		
		it('have posted dates', () => {
			homesProduced.forEach((home) => {
				expect(home.posted).to.be.a('string');
				expect(home.posted).to.not.equal('');
			});
		});
	});
	
	function singleHomeKijijiProvider() {
		return {
			getHomes: () => {
				return new KijijiListingProvider().getHomes().map((homes) => {
					return [homes[0]];
				});
			}
		};
	}
});