﻿(function () {
    'use strict';
   
	var MapModel = require('./map-model');
	
	var testDataset = require('./test-dataset');
	var i18n = require('./i18n').i18n();

    describe('A map model', function () {
		var model;
		var geojson;
		var geojsonCount;
		var dataset;
		
		beforeEach(function () {
			geojsonCount = 0;
			dataset = testDataset.dataset();
			model = MapModel.newModel(dataset);
			model.geojson().subscribe(function (json) {
				geojson = json;
				geojsonCount++;
			});
		});
		
		it('creates valid geojson with points from homes', function () {
			expect(geojson.type).to.eql('FeatureCollection');
			dataset.data.forEach(function (home, index) {
				var feature = geojson.features[index];
				expect(feature.type).to.eql('Feature');
				expect(feature.geometry.type).to.eql('Point');
				expect(feature.geometry.coordinates).to.eql([
					home.coords.lng, home.coords.lat
				]);
				expect(feature.properties.name).to.eql(home.name);
				expect(feature.properties.price).to.eql(home.price);
				expect(feature.properties.address).to.eql(home.address);
				expect(feature.properties.posted).to.eql(home.posted);
				expect(feature.properties.grocery.name).to.eql(home.grocery.name);
				expect(feature.properties.grocery.address).to.eql(home.grocery.address);
				expect(feature.properties.grocery.time).to.eql(home.grocery.time);
			});
		});
		
		it('give the min color to the features corresponding to homes with the minimum price', function () {
			expect(geojson.features[0].properties.color).to.eql(MapModel.MIN_COLOR);
		});
		
		it('give the max color to the features corresponding to homes with the maximum price', function () {
			expect(geojson.features[1].properties.color).to.eql(MapModel.MAX_COLOR);
		});
		
		it('give an intermediate color to the features corresponding to homes with prices between', function () {
			expect(geojson.features[2].properties.color).to.eql('#800080');
		});
		
		it('give the no-data color to the features corresponding to homes with no prices', function () {
			expect(geojson.features[3].properties.color).to.eql(MapModel.NO_DATA_COLOR);
		});
		
		it('has a price and a grocery distance criteria', function () {
			expect(model.criteria().length).to.eql(2);
			
			expect(model.criteria()[0].id).to.eql('price');
			expect(model.criteria()[0].name).to.eql(i18n.CRITERIA_PRICE);
			
			expect(model.criteria()[1].id).to.eql('grocery-time');
			expect(model.criteria()[1].name).to.eql(i18n.CRITERIA_GROCERY_TIME);
		});
		
		describe('when changing active criteria', function () {
			beforeEach(function () {
				model.changeActiveCriteria('price');
			});
			
			it('fires a geojson event', function () {
				expect(geojsonCount).to.eql(2);
			});
		});
	});
}());