(function () {
    'use strict';

    var Source = require('./server-home-source');

    describe('Loading the homes', function () {
        this.timeout(15000);

		var url = 'proxicity/homes';
        var homes;

        before(function (done) {
            Source.newSource(url).getHomes()
                .subscribe(function (returnedHomes) {
                    homes = returnedHomes;
                }, done, done);
        });

        it('load the homes', function () {
            expect(_.isArray(homes)).to.be(true);
        });
    });
}());