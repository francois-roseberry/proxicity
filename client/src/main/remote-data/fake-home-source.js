﻿(function() {
	'use strict';

	exports.newSource = function() {
		return new FakeHomeSource();
	};

	function FakeHomeSource() {
		this._homes = new Rx.AsyncSubject();
	}
	
	FakeHomeSource.prototype.resolve = function () {
		this._homes.onNext(createHomes());
		this._homes.onCompleted();
	};
	
	FakeHomeSource.prototype.getHomes = function () {
		return this._homes.asObservable();
	};
	
	function createHomes() {
		return [{
				name: "Appart A",
				url: "/appartments/a",
				price: 500,
				address: "Rue Richelieu, Ville de Québec, QC G1R, Canada",
				coords: {
				  lat: 46.8107001,
				  lng: -71.221038
				}
		    }, {
				name: "Appart B",
				url: "/appartments/b",
				price: 1000,
				address: "600 Avenue Wilfrid-Laurier, Ville de Québec, QC G1R 2L5, Canada",
				coords: {
				  lat: 46.8054688,
				  lng: -71.2165615
				}
		    }, {
				name: "Appart C",
				url: "/appartments/c",
				price: 750,
				address: "600 Avenue Wilfrid-Laurier, Ville de Québec, QC G1R 2L5, Canada",
				coords: {
				  lat: 46.8054688,
				  lng: -71.2165615
				}
		    }, {
				name: "Appart D",
				url: "/appartments/d",
				address: "1925 Rue Jalobert, Ville de Québec, QC G1L 4C2, Canada",
				coords: {
				  lat: 46.828687,
				  lng: -71.24396399999999
				}
		}];
	}
}());
