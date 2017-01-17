(function () {
    'use strict';

    var Source = require('./server-dataset-source');

    describe.only('Loading the dataset', function () {
        this.timeout(15000);

		var url = 'proxicity/dataset';
        var dataset;

        before(function (done) {
            Source.newSource(url).getDataset()
                .subscribe(function (datasetJson) {
                    dataset = datasetJson;
                }, done, done);
        });

        it('load the dataset', function () {
            expect(dataset && _.isArray(dataset.data)).to.be(true);
        });
    });
}());