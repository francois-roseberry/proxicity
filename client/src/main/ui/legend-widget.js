(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;
	var i18n = require('./i18n').i18n();

    exports.render = function (container, model) {
		precondition(container, 'Legend Widget requires a container');
		precondition(model, 'Legend Widget requires a model');
		
		var legendContainer = d3.select(container[0])
			.append('div')
			.classed('legend-container', true);
			
		legendContainer.append('div')
			.classed('legend-header', true)
			.append('span')
			.text(model.geojson().features.length + ' homes');
		
		var list = legendContainer
			.append('ul')
			.classed('legend-items', true);
			
		var boundedCategory = list.append('li')
			.classed({
				'legend-item': true,
				'legend-bounded-category' : true
			});
			
		var svg = boundedCategory.append('svg')
			.classed('legend-thumbnail', true)
			.attr({
				width: 25,
				height: 100
			});
			
		var gradient = svg.append('defs')
			.append('linearGradient')
			.attr({
				id: 'grad1',
				x1: '0%',
				y1: '100%',
				x2: '0%',
				y2: '0%'
			});
			
		gradient.append('stop')
			.attr('offset', '0%')
			.style({
				'stop-color': model.bounds().min.color,
				'stop-opacity': 1
			});
			
		gradient.append('stop')
			.attr('offset', '100%')
			.style({
				'stop-color': model.bounds().max.color,
				'stop-opacity': 1
			});
			
		svg.append('rect')
            .attr({
                width: 25,
                height: 100
            })
            .style('fill', 'url(#grad1)');
			
		boundedCategory.append('span')
            .classed('legend-bounds-upper', true)
            .text(model.bounds().max.value);

        boundedCategory.append('span')
            .classed('legend-bounds-lower', true)
            .text(model.bounds().min.value);
			
		var noDataCategory = list.append('li')
			.classed({
				'legend-item': true,
				'legend-no-data-category': true
			});
			
		noDataCategory
			.append('svg')
			.classed('legend-thumbnail', true)
			.attr({
				width: 25,
				height: 25
			})
			.append('rect')
			.attr({
				width: 25,
				height: 25
			})
			.style('fill', model.noDataCategory().color);
			
		noDataCategory.append('span')
			.text(i18n.DATA_UNAVAILABLE + ' (' + model.noDataCategory().count + ')');
    };
}());