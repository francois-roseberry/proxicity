(function() {
	"use strict";
	
	var chai = require('chai');
	var chaiHttp = require('chai-http');
	var dataset = require('./test-data').dataset;
	var Rx = require('rx');
	var expect = chai.expect;
	var _ = require('underscore');
	
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
		
		describe('when dataset is requested', function () {
			var response;
			var body;
			
			beforeEach(function (done) {
				provider.throwErrorOnNextRequest(false);
				
				chai.request(server)
					.get('/dataset')
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
			
			// TODO move this test on the provider chain
			// The test here should only verify that the json corresponds to the test dataset
			it('contains an attribute array with 3 attributes', function () {
				expect(response.body.attributes.length).to.eql(3);
				
				expect(response.body.attributes[0].id).to.eql('price');
				expect(_.isString(response.body.attributes[0].name)).to.eql(true);
				expect(response.body.attributes[0].type).to.eql('currency');
				
				expect(response.body.attributes[1].id).to.eql('grocery-time');
				expect(_.isString(response.body.attributes[1].name)).to.eql(true);
				expect(response.body.attributes[1].type).to.eql('time');
				
				expect(response.body.attributes[2].id).to.eql('grocery-distance');
				expect(_.isString(response.body.attributes[2].name)).to.eql(true);
				expect(response.body.attributes[2].type).to.eql('distance');
			});
			
			it('contains a data array with all homes', function () {
				expect(response.body.data.length).to.equal(dataset().data.length);
			});
			
			it('contains all home names', function () {
				dataset().data.forEach(function (home, index) {
					expect(response.body.data[index].name).to.equal(home.name);
				});
			});
			
			it('contains all home adresses', function () {
				dataset().data.forEach(function (home, index) {
					expect(response.body.data[index].address).to.equal(home.address);
				});
			});
			
			it('contains all home coordinates', function () {
				dataset().data.forEach(function (home, index) {
					expect(response.body.data[index].coordinates).to.deep.equal(home.coordinates);
				});
			});
		});
		
		describe('when inner provider throws an error', function () {
			var errorResponse;
		
			before(function (done) {
				provider.throwErrorOnNextRequest(true);
				
				chai.request(server)
					.get('/dataset')
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
				getDataset: function() {
					if (this._error) {
						return Rx.Observable.throw(new Error(ERROR_MESSAGE));
					}
					
					return Rx.Observable.of(dataset());
				}
			};
		}
	});
}());