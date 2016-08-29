(function() {
	"use strict";
	
	var expect  = require('chai').expect;
	var request = require('request');
	var homes = require('../main/fake-homes.js').homes;

	describe('Homes API', function () {
		var response;
		var body;
		
		before(function (done) {
			var url = "http://localhost:3000/homes";
			request(url, function (error, res) {
				response = res;
				body = JSON.parse(res.body);
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
				expect(body.homes[index].name).to.equal(home.name);
			});
		});
		
		it('contains all home adresses', function () {
			homes().homes.forEach(function (home, index) {
				expect(body.homes[index].address).to.equal(home.address);
			});
		});
		
		it('contains all home coordinates', function () {
			homes().homes.forEach(function (home, index) {
				expect(body.homes[index].coordinates).to.deep.equal(home.coordinates);
			});
		});
	});
}());