(function () {
	"use strict";
	
	var expect  = require('chai').expect;
	var Rx = require('rx');
	var _ = require('underscore');
	var GroceriesProvider = require('../main/groceries-provider');
	var key = require('../../google_maps_api.key.json').key;

	describe('A groceries provider', function () {
		var FAKE_HOMES = [{
			name: 'House A', 
			coords: {
			  lat: 46.8128318,
			  lng: -71.209481
			}
		}];
		
		var groceriesProvider;
		var fakeProvider;
		var homesProduced;
		
		before(function (done) {
			fakeProvider = createFakeProvider();
			groceriesProvider = new GroceriesProvider(fakeProvider, key);
			
			groceriesProvider.getHomes().subscribe(function (homes) {
				homesProduced = homes;
			}, done, done);
		});
		
		it('cannot be created without a provider', function () {
			expect(function () {
				groceriesProvider = new GroceriesProvider({});
			}).to.throw(/A GroceriesProvider requires a provider/);
		});
		
		it('cannot be created without an API key', function () {
			expect(function () {
				groceriesProvider = new GroceriesProvider(fakeProvider);
			}).to.throw(/A GroceriesProvider requires an API key/);
		});
		
		it('preserve all existing fields', function () {
			homesProduced.forEach(function (home, index) {
				_.keys(FAKE_HOMES[index]).forEach(function (key) {
					expect(home[key]).to.deep.equal(FAKE_HOMES[index][key]);
				});
			});
		});
		
		it('add a grocery object with an address and a name', function () {
			homesProduced.forEach(function (home) {
				expect(home).to.contain.key('grocery');
				expect(home.grocery.name).to.be.a('string');
				expect(home.grocery.name).to.not.equal('');
				expect(home.grocery.address).to.be.a('string');
				expect(home.grocery.address).to.not.equal('');
			});
		});
		
		function createFakeProvider() {
			return {
				getHomes: function () {
					var subject = new Rx.AsyncSubject();
					subject.onNext(FAKE_HOMES);
					subject.onCompleted();
					return subject;
				}
			};
		}
	});
}());