﻿"use strict";

/* jshint expr:true */

const expect  = require('chai').expect;
const Rx = require('rx');
const _ = require('underscore');
const PriceExtractor = require('../main/price-extractor');

describe('A price extractor', () => {
	var FAKE_HOMES = [{
		name: 'House A', 
		address: '2323 Avenue Chapdelaine, Ville de Québec, QC G1V 5B9, Canada',
		price: '800 $'
	}, {
		name: 'House B', 
		address: '2323 Avenue Chapdelaine, Ville de Québec, QC G1V 5B9, Canada',
		price: 'invalid price'
	}, {
		name: 'House C', 
		address: '2323 Avenue Chapdelaine, Ville de Québec, QC G1V 5B9, Canada',
		price: '1 000,00 $'
	}];
	
	var priceExtractor;
	var homesProduced;
	
	before((done) => {
		priceExtractor = new PriceExtractor(createFakeProvider());
		
		priceExtractor.getHomes().subscribe((homes) => {
			homesProduced = homes;
		}, done, done);
	});
	
	it('cannot be created without a provider', () => {
		expect(() => {
			priceExtractor = new PriceExtractor({});
		}).to.throw(/A PriceExtractor requires a provider/);
	});
	
	it('preserve all existing fields, except the price', () => {
		homesProduced.forEach((home, index) => {
			_.without(_.keys(FAKE_HOMES[index]), 'price').forEach((key) => {
				expect(home[key]).to.deep.equal(FAKE_HOMES[index][key]);
			});
		});
	});
	
	it('when price string ends with a dollar sign, ' +
		'the price property becomes the parsed number', () => {
			expect(homesProduced[0].price).to.equal(800);
		});
	
	it('when price string is not a price, the price property is removed', () => {
		expect(homesProduced[1].price).to.be.undefined;
	});
	
	it('when price contain spaces, it is still extracted', () => {
		expect(homesProduced[2].price).to.equal(1000);
	});
	
	function createFakeProvider() {
		return {
			getHomes: () => {
				var subject = new Rx.AsyncSubject();
				subject.onNext(FAKE_HOMES);
				subject.onCompleted();
				return subject;
			}
		};
	}
});