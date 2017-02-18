(function() {
	'use strict';
	
	var Attribute = require('./attribute');

	exports.dataset = function (withMissingPrice) {
		return {
			attributes: attributes(),
			data: homes(withMissingPrice || false)
		};
	};
	
	function attributes() {
		return [Attribute.currency('price', 'Price'), Attribute.time('grocery-time', 'Grocery time')];
	}

	function homes(withMissingPrice) {
		return [{
					name : "Appart A",
					url : "/appartments/a",
					price : 500,
					address : "Rue Richelieu, Ville de Quebec, QC G1R, Canada",
					coords : {
						lat : 46.8107001,
						lng : -71.221038
					},
					grocery : {
						name : "Epicerie Richard",
						address : "42 Rue des Jardins, Ville de Quebec",
						distance : 307,
						time : 250
					}
				},
				{
					name : "Appart B",
					url : "/appartments/b",
					price : 1000,
					address : "600 Avenue Wilfrid-Laurier, Ville de Quebec, QC G1R 2L5, Canada",
					coords : {
						lat : 46.8054688,
						lng : -71.2165615
					},
					grocery : {
						name : "Epicerie Richard",
						address : "42 Rue des Jardins, Ville de Quebec",
						distance : 307,
						time : 250
					}
				},
				{
					name : "Appart C",
					url : "/appartments/c",
					price : 750,
					address : "600 Avenue Wilfrid-Laurier, Ville de Quebec, QC G1R 2L5, Canada",
					coords : {
						lat : 46.8054688,
						lng : -71.2165615
					},
					grocery : {
						name : "Epicerie Richard",
						address : "42 Rue des Jardins, Ville de Quebec",
						distance : 307,
						time : 250
					}
				},
				{
					name : "Appart D",
					url : "/appartments/d",
					address : "1925 Rue Jalobert, Ville de Quebec, QC G1L 4C2, Canada",
					price: (withMissingPrice ? null : 700),
					coords : {
						lat : 46.828687,
						lng : -71.24396399999999
					},
					grocery : {
						name : "Epicerie Richard",
						address : "42 Rue des Jardins, Ville de Quebec",
						distance : 307,
						time : 250
					}
				}];
	}
}());
