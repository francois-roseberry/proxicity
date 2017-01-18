(function () {
    'use strict';

    var Source = require('./server-dataset-source');
    var Attribute = require('./attribute');

    describe('Loading the dataset', function () {
        this.timeout(15000);

		var url = 'proxicity/dataset';
        var dataset;

        before(function (done) {
            Source.newSource(url).getDataset()
                .subscribe(function (datasetJson) {
                    dataset = datasetJson;
                }, done, done);
        });
        
        it('has an array of attributes', function () {
        	expect(_.isArray(dataset.attributes)).to.be(true);
        	expect(dataset.attributes.length).to.eql(2);
        	expect(dataset.attributes[0].equals(Attribute.currency('price', 'Price'))).to.be(true);
        	expect(dataset.attributes[1].equals(Attribute.time('grocery-time', 'Time to closest grocery'))).to.be(true);
        });

        it('has an array of data', function () {
            expect(dataset && _.isArray(dataset.data)).to.be(true);
        });
    });
}());