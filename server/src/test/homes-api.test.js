(function() {
	"use strict";
	
	var chai = require('chai');
	var chaiHttp = require('chai-http');
	var homes = require('./test-data.js').homes;
	var Rx = require('rx');
	var expect = chai.expect;
	
	var ProxicityServer = require('../main/proxicity-server');
	
	chai.use(chaiHttp);

	describe('Homes API', function () {
		var response;
		var body;
		
		before(function (done) {
			var server = ProxicityServer.create({
				port: 3000,
				provider: createTestProvider(),
				webclient: '../../../client/target/dist'
			});
			
			chai.request(server)
				.get('/homes')
				.end(function (err, res) {
					response = res;
					body = res.body;
					done();
				});
		});
		
		it('returns status response 200', function () {
			expect(response.statusCode).to.equal(200);
		});
		
		it('is valid json', function () {
			expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
		});
		
		it('contains all home names', function () {
			homes().homes.forEach(function (home, index) {
				expect(response.body.homes[index].name).to.equal(home.name);
			});
		});
		
		it('contains all home adresses', function () {
			homes().homes.forEach(function (home, index) {
				expect(response.body.homes[index].address).to.equal(home.address);
			});
		});
		
		it('contains all home coordinates', function () {
			homes().homes.forEach(function (home, index) {
				expect(response.body.homes[index].coordinates).to.deep.equal(home.coordinates);
			});
		});
		
		function createTestProvider() {
			var subject = new Rx.AsyncSubject();
			subject.onNext(homes());
			subject.onCompleted();
			return {
				getHomes: function() {return subject.asObservable();}
			};
		}
	});
}());