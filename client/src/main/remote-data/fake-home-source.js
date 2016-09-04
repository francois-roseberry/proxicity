(function() {
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
				"name": "Beau 3 1/2 semi-meublé - Rue Richelieu - Vieux-Québec - À VOIR!!",
				"url": "/v-appartement-condo-3-1-2/ville-de-quebec" +
					"/beau-3-1-2-semi-meuble-rue-richelieu-vieux-quebec-a-voir/1193171756?src=topAdSearch",
				"price": "620,00 $",
				"address": "Rue Richelieu, Ville de Québec, QC G1R, Canada",
				"coords": {
				  "lat": 46.8107001,
				  "lng": -71.221038
				}
		    }, {
				"name": "Condo 3.5 pièces",
				"url": "/v-appartement-condo-3-1-2/ville-de-quebec" + 
					"/condo-3-5-pieces/1160364331?src=topAdSearch",
				"price": "1 000,00 $",
				"address": "600 Avenue Wilfrid-Laurier, Ville de Québec, QC G1R 2L5, Canada",
				"coords": {
				  "lat": 46.8054688,
				  "lng": -71.2165615
				}
		    }, {
				"name": "Grand 3 1/2 Près du Centre Videotron",
				"url": "/v-appartement-condo-3-1-2/ville-de-quebec" +
					"/grand-3-1-2-pres-du-centre-videotron/1189208409?src=topAdSearch",
				"price": "540,00 $",
				"address": "1925 Rue Jalobert, Ville de Québec, QC G1L 4C2, Canada",
				"coords": {
				  "lat": 46.828687,
				  "lng": -71.24396399999999
				}
		}];
	}
}());
