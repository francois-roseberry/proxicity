(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;

    exports.render = function (container, model) {
		precondition(container, 'Legend Widget requires a container');
		precondition(model, 'Legend Widget requires a model');
		
		var list = d3.select(container[0])
			.append('div')
			.classed('legend-container', true)
			.append('ul')
			.classed('legend-items', true);
			
		list.append('li')
			.classed('legend-item', true)
			.text(model.geojson().features.length + ' homes');
    };
}());