"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const dataset = require('./test-data').dataset;
const Rx = require('rx');
const expect = chai.expect;

const ProxicityServer = require('../main/proxicity-server');

chai.use(chaiHttp);

describe('Homes API', () => {
	var ERROR_MESSAGE = 'BOOM !';
	var provider;
	var server;
	
	before(() => {
		provider = createTestProvider();
		
		server = ProxicityServer.create({
			port: 3000,
			provider: provider,
			webclient: '../../../client/target/dist'
		});
	});
	
	describe('when dataset is requested', () => {
		var response;
		var body;
		
		beforeEach((done) => {
			provider.throwErrorOnNextRequest(false);
			
			chai.request(server)
				.get('/dataset')
				.end((err, res) => {
					response = res;
					body = res.body;
					done();
				});
		});
		
		it('returns status response 200', () => {
			expect(response.statusCode).to.equal(200);
		});
		
		it('is valid json', () => {
			expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
		});
		
		it('contains attributes', () => {
			expect(response.body.attributes.length).to.eql(dataset().attributes.length);
			
			dataset().attributes.forEach((attribute, index) => {
				expect(response.body.attributes[index].id).to.eql(attribute.id);
				expect(response.body.attributes[index].name).to.eql(attribute.name);
				expect(response.body.attributes[index].type).to.eql(attribute.type);
			});
		});
		
		it('pass the level queried to the dataset provider', () => {
			expect(provider.getLastLevelQueried()).to.equal('home');
		});
		
		it('contains a data array with all homes', () => {
			expect(response.body.data.length).to.equal(dataset().data.length);
		});
		
		it('contains all home names', () => {
			dataset().data.forEach((home, index) => {
				expect(response.body.data[index].name).to.equal(home.name);
			});
		});
		
		it('contains all home adresses', () => {
			dataset().data.forEach((home, index) => {
				expect(response.body.data[index].address).to.equal(home.address);
			});
		});
		
		it('contains all home coordinates', () => {
			dataset().data.forEach((home, index) => {
				expect(response.body.data[index].coordinates).to.deep.equal(home.coordinates);
			});
		});
	});
	
	describe('when inner provider throws an error', () => {
		var errorResponse;
	
		before((done) => {
			provider.throwErrorOnNextRequest(true);
			
			chai.request(server)
				.get('/dataset')
				.end((err, res) => {
					errorResponse = res;
					done();
				});
		});
		
		it('returns status response 500', () => {
			expect(errorResponse.statusCode).to.equal(500);
		});
		
		it('is valid json', () => {
			expect(errorResponse.headers['content-type']).to.equal('application/json; charset=utf-8');
		});
		
		it('contains error message', () => {
			expect(errorResponse.body.message).to.equal(ERROR_MESSAGE);
		});
	});
	
	function createTestProvider() {
		return {
			_lastLevelQueried: '',
			throwErrorOnNextRequest: function (throwOrNot) {
				this._error = throwOrNot;
			},
			getDataset: function(level) {
				this._lastLevelQueried = level;
				if (this._error) {
					return Rx.Observable.throw(new Error(ERROR_MESSAGE));
				}
				
				return Rx.Observable.of(dataset());
			},
			getLastLevelQueried: function () {
				return this._lastLevelQueried;
			}
		};
	}
});