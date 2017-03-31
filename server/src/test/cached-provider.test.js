"use strict";

const expect  = require('chai').expect;
const fs = require('fs');
const Rx = require('rx');	
const CachedProvider = require('../main/cached-provider');

describe('A cached provider', () => {
	var CACHED_FILE = 'cached-file.test.json';
	var cachedProvider;
	var fakeProvider;
	
	before(() => {
		fakeProvider = createFakeProvider();
		cachedProvider = new CachedProvider(fakeProvider, CACHED_FILE);
	});
	
	it('cannot be created without a filename', () => {
		expect(() => {
			cachedProvider = new CachedProvider(fakeProvider, 1);
		}).to.throw(/A CachedProvider requires a filename/);
	});
	
	it('cannot be created without a provider', () => {
		expect(() => {
			cachedProvider = new CachedProvider({}, CACHED_FILE);
		}).to.throw(/A CachedProvider requires a provider/);
	});
	
	describe('when cached file is not present', () => {
		var homesProduced;
		
		before((done) => {
			cachedProvider.getHomes().subscribe((homes) => {
				homesProduced = homes;
			}, done, done);
		});
		
		it('gets homes from its provider', () => {
			expect(fakeProvider.hasBeenCalled()).to.equal(true);
		});
		
		it('caches the result in a file', (done) => {
			fs.exists(CACHED_FILE, (result) => {
				expect(result).to.equal(true);
				done();
			});
		});
		
		describe('after querying the provider a second time', () => {
			var homesFromCache;
			
			before((done) => {
				fakeProvider.reset();
				cachedProvider.getHomes().subscribe((homes) => {
					homesFromCache = homes;
				}, done, done);
			});
			
			it('does not get homes from its provider', () => {
				expect(fakeProvider.hasBeenCalled()).to.equal(false);
			});
			
			it('homes read from cached file are the same as those from provider', () => {
				expect(homesFromCache).to.deep.equal(homesProduced);
			});
		});
	});
	
	function createFakeProvider() {
		return {
			_called: false,
			hasBeenCalled: function () {
				return this._called;
			},
			reset: function () {
				this._called = false;
			},
			getHomes: function () {
				this._called = true;
				var subject = new Rx.AsyncSubject();
				subject.onNext({field: 'value'});
				subject.onCompleted();
				return subject;
			}
		};
	}
});