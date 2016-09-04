(function () {
    'use strict';
   
	var MapModel = require('./map-model');
	var Source = require('./fake-home-source');

    describe('A map model', function () {
		var model;
		var originalHomes;
		
		beforeEach(function (done) {
			var source = Source.newSource();
			source.getHomes()
				.subscribe(function (homes) {
					originalHomes = homes;
					model = MapModel.newModel(homes);
				}, done, done);
				
			source.resolve();
		});
		
		it('creates valid geojson with points from homes', function () {
			expect(model.geojson().type).to.eql('FeatureCollection');
			originalHomes.forEach(function (home, index) {
				var feature = model.geojson().features[index];
				expect(feature.type).to.eql('Feature');
				expect(feature.geometry.type).to.eql('Point');
				expect(feature.geometry.coordinates).to.eql([
					home.coords.lng, home.coords.lat
				]);
				expect(feature.properties.name).to.eql(home.name);
				expect(feature.properties.price).to.eql(home.price);
				expect(feature.properties.address).to.eql(home.address);
			});
		});
	});
}());