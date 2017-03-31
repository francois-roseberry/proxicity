"use strict";

exports.dataset = function () {
	return {
		attributes: attributes(),
		data: homes()
	};
};

function attributes() {
	return [{
		id: 'price',
		name: 'Price',
		type: 'currency'
	}, {
		id: 'grocery-time',
		name: 'Time to closest grocery',
		type: 'time'
	}, {
		id: 'grocery-distance',
		name: 'Distance to closest grocery',
		type: 'distance'
	}];
}

function homes() {
	return [{
				name: 'Appartment A',
				address: "9325 Rue de Belfort, Ville de Québec, QC G1G 6J6, Canada",
				coordinates: [46.872382, -71.272625]
			}, {
				name: 'Appartment B',
				address: "1500 Rte de l'Église, Ville de Québec, QC G1W 3P6, Canada",
				coordinates: [46.762904, -71.282380]
			}, {
				name: 'Appartment C',
				address: "2315 Boulevard Cardinal-Villeneuve, Ville de Québec, QC G1L 3H7, Canada",
				coordinates: [46.834005, -71.239776]
			}];
}