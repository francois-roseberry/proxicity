(function() {
	'use strict';
	
	exports.homes = function () {
		return [{
				name: "Appart A",
				url: "/appartments/a",
				price: 500,
				address: "Rue Richelieu, Ville de Québec, QC G1R, Canada",
				coords: {
					lat: 46.8107001,
					lng: -71.221038
				},
				grocery: {
					name: "Epicerie Richard",
					address: "42 Rue des Jardins, Ville de Québec",
					distance: 307,
					time: 250
				}
		    }, {
				name: "Appart B",
				url: "/appartments/b",
				price: 1000,
				address: "600 Avenue Wilfrid-Laurier, Ville de Québec, QC G1R 2L5, Canada",
				coords: {
					lat: 46.8054688,
					lng: -71.2165615
				},
				grocery: {
					name: "Epicerie Richard",
					address: "42 Rue des Jardins, Ville de Québec",
					distance: 307,
					time: 250
				}
		    }, {
				name: "Appart C",
				url: "/appartments/c",
				price: 750,
				address: "600 Avenue Wilfrid-Laurier, Ville de Québec, QC G1R 2L5, Canada",
				coords: {
					lat: 46.8054688,
					lng: -71.2165615
				},
				grocery: {
					name: "Epicerie Richard",
					address: "42 Rue des Jardins, Ville de Québec",
					distance: 307,
					time: 250
				}
		    }, {
				name: "Appart D",
				url: "/appartments/d",
				address: "1925 Rue Jalobert, Ville de Québec, QC G1L 4C2, Canada",
				coords: {
					lat: 46.828687,
					lng: -71.24396399999999
				},
				grocery: {
					name: "Epicerie Richard",
					address: "42 Rue des Jardins, Ville de Québec",
					distance: 307,
					time: 250
				}
		}];
	};
}());
