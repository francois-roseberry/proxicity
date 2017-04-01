"use strict";

const fs = require('fs');
const Rx = require('rx');
const _ = require('underscore');
const precondition = require('./infrastructure/contract').precondition;

class CachedProvider {
	constructor(provider, filename) {
		precondition(provider && _.isFunction(provider.getHomes), 'A CachedProvider requires a provider');
		precondition(_.isString(filename), 'A CachedProvider requires a filename');
		
		this._provider = provider;
		this._filename = filename;
	}

	getHomes() {
		var subject = new Rx.AsyncSubject();
		var provider = this._provider;
		var filename = this._filename;
		fs.readFile(this._filename, 'utf-8', (err, data) => {
			if (err) {
				// Error reading, file's probably absent.
				provider.getHomes().subscribe(cacheResults(filename, subject),
					(err) => {
						subject.onError(err);
					});
					
				return;
			}
			
			subject.onNext(JSON.parse(data));
			subject.onCompleted();
		});
		return subject.asObservable();
	}
}

function cacheResults(filename, subject) {
	return function (homes) {
		fs.writeFile(filename, JSON.stringify(homes, null, 2), function(err) {
			if (err) {
				subject.onError(err);
				return;
			}
			
			subject.onNext(homes);
			subject.onCompleted();
		});
	};
}

module.exports = CachedProvider;