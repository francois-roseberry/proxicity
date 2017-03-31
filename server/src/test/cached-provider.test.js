"use strict";

const expect  = require('chai').expect;
const fs = require('fs');
const Rx = require('rx');	
const CachedProvider = require('../main/cached-provider');

describe('A cached provider', function () {
	var CACHED_FILE = 'cached-file.test.json';
	var cachedProvider;
	var fakeProvider;
	
	before(function () {
		fakeProvider = createFakeProvider();
		cachedProvider = new CachedProvider(fakeProvider, CACHED_FILE);
	});
	
	it('cannot be created without a filename', function () {
		expect(function () {
			cachedProvider = new CachedProvider(fakeProvider, 1);
		}).to.throw(/A CachedProvider requires a filename/);
	});
	
	it('cannot be created without a provider', function () {
		expect(function () {
			cachedProvider = new CachedProvider({}, CACHED_FILE);
		}).to.throw(/A CachedProvider requires a provider/);
	});
	
	describe('when cached file is not present', function () {
		var homesProduced;
		
		before(function (done) {
			cachedProvider.getHomes().subscribe(function (homes) {
				homesProduced = homes;
			}, done, done);
		});
		
		it('gets homes from its provider', function () {
			expect(fakeProvider.hasBeenCalled()).to.equal(true);
		});
		
		it('caches the result in a file', function (done) {
			fs.exists(CACHED_FILE, function (result) {
				expect(result).to.equal(true);
				done();
			});
		});
		
		describe('after querying the provider a second time', function () {
			var homesFromCache;
			
			before(function (done) {
				fakeProvider.reset();
				cachedProvider.getHomes().subscribe(function (homes) {
					homesFromCache = homes;
				}, done, done);
			});
			
			it('does not get homes from its provider', function () {
				expect(fakeProvider.hasBeenCalled()).to.equal(false);
			});
			
			it('homes read from cached file are the same as those from provider', function () {
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