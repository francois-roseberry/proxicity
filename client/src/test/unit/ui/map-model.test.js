(function () {
    'use strict';
   
	var MapModel = require('./map-model');
	
	var testHomes = require('./test-homes');

    describe('A map model', function () {
		var model;
		var homes;
		
		beforeEach(function () {
			homes = testHomes.homes();
			model = MapModel.newModel(homes);
		});
		
		it('creates valid geojson with points from homes', function () {
			expect(model.geojson().type).to.eql('FeatureCollection');
			homes.forEach(function (home, index) {
				var feature = model.geojson().features[index];
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
			expect(model.geojson().features[0].properties.color).to.eql(MapModel.MIN_COLOR);
		});
		
		it('give the max color to the features corresponding to homes with the maximum price', function () {
			expect(model.geojson().features[1].properties.color).to.eql(MapModel.MAX_COLOR);
		});
		
		it('give an intermediate color to the features corresponding to homes with prices between', function () {
			expect(model.geojson().features[2].properties.color).to.eql('#800080');
		});
		
		it('give the no-data color to the features corresponding to homes with no prices', function () {
			expect(model.geojson().features[3].properties.color).to.eql(MapModel.NO_DATA_COLOR);
		});
	});
}());