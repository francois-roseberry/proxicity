"use strict";

const fs = require('fs');
const Rx = require('rx');
const wicket = require('wicket/wicket');
const inside = require('turf-inside');
const flipCoordinates = require('turf-flip');
const _ = require('underscore');
const precondition = require('./infrastructure/contract.js').precondition;

function DistrictProvider(provider, filename) {
	precondition(provider && _.isFunction(provider.getHomes), 'A DistrictProvider requires a provider');
	precondition(_.isString(filename), 'A DistrictProvider requires a district filename');
	
	this._provider = provider;
	this._filename = filename;
}

DistrictProvider.prototype.getHomes = function () {
	var subject = new Rx.AsyncSubject();
	var provider = this._provider;
	fs.readFile(this._filename, 'utf-8', function (err, data) {
		if (err) {
			subject.onError(err);
			return;
		}
		
		var contents = JSON.parse(data);
		
		var districts = encodeDistricts(contents['Quartiers']['Quartier']);
		
		provider.getHomes().subscribe(function (homes) {
			var newHomes = homes.map(function (home) {
				var point = {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [home.coords.lat, home.coords.lng]
						}
				};
				var parent = _.find(districts, function (district) {
					var wkt = new wicket.Wkt();
					var wktGeometry = district.geometry;
					wkt.read(wktGeometry);
					var geometry = wkt.toJson();
					var polygon = flipCoordinates({
						type: 'Feature',
						geometry: geometry
					});
					return inside(point, polygon);
				});
				
				if (parent) {
					home.district = parent.id;
				} else {
					home.district = -1;
				}
				return home;
			});
			
			subject.onNext(newHomes);
			subject.onCompleted();
		});
	});
	
	return subject.asObservable();
};

function encodeDistricts(districts) {
	return districts.map(function (district, index) {
		return {
			id: index,
			name: district['Nom'],
			geometry: district['Geometrie']
		};
	});
}

module.exports = DistrictProvider;