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
			
		var header = legendContainer.append('div')
			.classed('legend-header', true)
			.append('span');
		
		legendContainer.append('img')
			.attr('src', '/images/powered_by_google_on_white.png')
			.classed('legend-footer', true);
			
		model.geojson().subscribe(function (geojson) {
			var description = i18n.DATA_SOURCE_DESCRIPTION.replace('{0}', geojson.features.length);
			
			header.html(description);
		});
			
		var criteriaContainer = legendContainer.append('div')
			.classed('legend-criteria', true);
			
		criteriaContainer.append('span')
			.text(i18n.CRITERIA_TYPE_COLOR + ' : ');
			
		var criteriaSelector = criteriaContainer
			.append('select')
			.classed('criteria-selector', true);
			
		$(criteriaSelector[0]).change(function () {
			model.changeActiveCriteria(this.value);
		});
		
		_.each(model.criteria(), function (criterion) {
			criteriaSelector.append('option')
				.attr('value', criterion.id)
				.text(criterion.name);
		});
		
		var list = legendContainer
			.append('ul')
			.classed('legend-items', true);
		
		model.categories().subscribe(function (categories) {
			list.selectAll('*').remove();
			
			list.selectAll('.legend-item')
				.data(categories)
				.enter()
				.append('li')
				.classed('legend-item', true)
				.each(function (category) {
					var element = d3.select(this);
					
					if (category.max) {
						// Bounded category
						renderBoundedCategory(element, category);
					} else {
						// Normal category
						renderCategory(element, category);
					}
				});
		});
    };
	
	function renderBoundedCategory(element, category) {
		var svg = element
			.classed('legend-bounded-category', true)
			.append('svg')
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
				'stop-color': category.min.color,
				'stop-opacity': 1
			});
			
		gradient.append('stop')
			.attr('offset', '100%')
			.style({
				'stop-color': category.max.color,
				'stop-opacity': 1
			});
			
		svg.append('rect')
            .attr({
                width: 25,
                height: 100
            })
            .style('fill', 'url(#grad1)');
			
		element.append('span')
            .classed('legend-bounds-upper', true)
            .text(category.max.value);

        element.append('span')
            .classed('legend-bounds-lower', true)
            .text(category.min.value);
	}
	
	function renderCategory(element, category) {
		element
			.classed('legend-no-data-category', true)
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
			.style('fill', category.color);
			
		element.append('span')
			.text(i18n.DATA_UNAVAILABLE + ' (' + category.count + ')');
	}
}());