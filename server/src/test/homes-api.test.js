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
		var ERROR_MESSAGE = 'BOOM !';
		var provider;
		var server;
		
		before(function () {
			provider = createTestProvider();
			
			server = ProxicityServer.create({
				port: 3000,
				provider: provider,
				webclient: '../../../client/target/dist'
			});
		});
		
		describe('when inner provider return homes', function () {
			var response;
			var body;
			
			beforeEach(function (done) {
				provider.throwErrorOnNextRequest(false);
				
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
		});
		
		describe('when inner provider throws an error', function () {
			var errorResponse;
		
			before(function (done) {
				provider.throwErrorOnNextRequest(true);
				
				chai.request(server)
					.get('/homes')
					.end(function (err, res) {
						errorResponse = res;
						done();
					});
			});
			
			it('returns status response 500', function () {
				expect(errorResponse.statusCode).to.equal(500);
			});
			
			it('is valid json', function () {
				expect(errorResponse.headers['content-type']).to.equal('application/json; charset=utf-8');
			});
			
			it('contains error message', function () {
				expect(errorResponse.body.message).to.equal(ERROR_MESSAGE);
			});
		});
		
		function createTestProvider() {
			return {
				throwErrorOnNextRequest: function (throwOrNot) {
					this._error = throwOrNot;
				},
				getHomes: function() {
					if (this._error) {
						return Rx.Observable.throw(new Error(ERROR_MESSAGE));
					}
					
					return Rx.Observable.of(homes());
				}
			};
		}
	});
}());