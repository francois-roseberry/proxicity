"use strict";

const expect  = require('chai').expect;
const Rx = require('rx');
const _ = require('underscore');
const GeocodingProvider = require('../main/geocoding-provider');

describe('A geocoding provider', () => {
	var FAKE_HOMES = [{
		name: 'House A', 
		address: '2323 Avenue Chapdelaine, Ville de Québec, QC G1V 5B9, Canada'
	}];
	
	var geocodingProvider;
	var homesProduced;
	
	before((done) => {
		geocodingProvider = new GeocodingProvider(createFakeProvider());
		
		geocodingProvider.getHomes().subscribe((homes) => {
			homesProduced = homes;
		}, done, done);
	});
	
	it('cannot be created without a provider', () => {
		expect(() => {
			geocodingProvider = new GeocodingProvider({});
		}).to.throw(/A GeocodingProvider requires a provider/);
	});
	
	it('preserve all existing fields', () => {
		homesProduced.forEach((home, index) => {
			_.keys(FAKE_HOMES[index]).forEach((key) => {
				expect(home[key]).to.deep.equal(FAKE_HOMES[index][key]);
			});
		});
	});
	
	it('add a coordinates field with a latitude and a longitude', () => {
		homesProduced.forEach((home) => {
			expect(home).to.contain.key('coords');
			expect(home.coords.lat).to.be.a('number');
			expect(home.coords.lng).to.be.a('number');
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