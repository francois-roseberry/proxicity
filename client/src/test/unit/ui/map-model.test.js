(function () {
    'use strict';
   
	var MapModel = require('./map-model');
	
	var testDataset = require('./test-dataset');

    describe('A map model', function () {
		var model;
		var geojson;
		var geojsonCount;
		var actualCategories;
		var dataset;
		
		beforeEach(function () {
			geojsonCount = 0;
			dataset = testDataset.dataset(true);
			model = MapModel.newModel(dataset);
			model.geojson().subscribe(function (json) {
				geojson = json;
				geojsonCount++;
			});
			model.categories().subscribe(function (categories) {
				actualCategories = categories;
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
				expect(feature.properties.url).to.eql(MapModel.BASE_URL + home.url);
			});
		});
		
		it('gives the min color to the features corresponding to homes with the minimum price', function () {
			expect(geojson.features[0].properties.color).to.eql(MapModel.MIN_COLOR);
		});
		
		it('gives the max color to the features corresponding to homes with the maximum price', function () {
			expect(geojson.features[1].properties.color).to.eql(MapModel.MAX_COLOR);
		});
		
		it('gives an intermediate color to the features corresponding to homes with prices between', function () {
			expect(geojson.features[2].properties.color).to.eql('#800080');
		});
		
		it('gives the no-data color to the features corresponding to homes with no prices', function () {
			expect(geojson.features[3].properties.color).to.eql(MapModel.NO_DATA_COLOR);
		});
		
		it('creates only 2 categories', function () {
			expect(actualCategories).to.have.length(2);
		});
		
		it('creates a bounded category', function () {
			expect(actualCategories[0].max.color).to.eql(MapModel.MAX_COLOR);
			
			expect(actualCategories[0].min.color).to.eql(MapModel.MIN_COLOR);
		});
		
		it('creates a no-data category', function () {
			expect(actualCategories[1].color).to.eql(MapModel.NO_DATA_COLOR);
			expect(actualCategories[1].count).to.eql(1);
		});
		
		describe('when created without missing values', function () {
			beforeEach(function () {
				var dataset = testDataset.dataset();
				var model = MapModel.newModel(dataset);
				model.categories().subscribe(function (categories) {
					actualCategories = categories;
				});
			});
			
			it('does not create an empty no-data category', function () {
				expect(actualCategories).to.have.length(1);
			});
		});
		
		it('has the same attributes as its dataset', function () {
			expect(model.attributes().length).to.eql(dataset.attributes.length);
			
			model.attributes().forEach(function (attribute, index) {
				expect(attribute.id).to.eql(dataset.attributes[index].id);
				expect(attribute.name).to.eql(dataset.attributes[index].name);
			});
		});
		
		describe('when changing active attribute', function () {
			beforeEach(function () {
				model.changeActiveAttribute('price');
			});
			
			it('fires a geojson event', function () {
				expect(geojsonCount).to.eql(2);
			});
		});
	});
}());