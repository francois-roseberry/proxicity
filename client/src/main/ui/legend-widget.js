'use strict';

var precondition = require('./contract').precondition;
var i18n = require('./i18n').i18n();

  exports.render = (container, task) => {
	precondition(container, 'Legend Widget requires a container');
	precondition(task, 'Legend Widget requires a DisplaySheetTask');

	var legendContainer = d3.select(container[0])
		.append('div')
		.classed('legend-container', true);

	var header = legendContainer.append('div')
		.classed('legend-header', true)
		.append('span');

	legendContainer.append('img')
		.attr('src', '/images/powered_by_google_on_white.png')
		.classed('legend-footer', true);

	var attributeContainer = legendContainer.append('div')
		.classed('legend-criteria', true);

	attributeContainer.append('span')
		.text(i18n.CRITERIA_TYPE_COLOR + ' : ');

	var attributeSelector = attributeContainer
		.append('select')
		.classed('criteria-selector', true);

	var list = legendContainer
		.append('ul')
		.classed('legend-items', true);

	task.status().subscribe((status) => {
		status.match({
			ready: _.noop,
			displayed: (model) => {
				model.geojson().subscribe((geojson) => {
					var description = i18n.DATA_SOURCE_DESCRIPTION.replace('{0}', geojson.features.length);

					header.html(description);
				});

				$(attributeSelector[0]).change(function () {
					model.changeActiveAttribute(this.value);
				});

				_.each(model.attributes(), (attribute) => {
					attributeSelector.append('option')
						.attr('value', attribute.id())
						.text(attribute.name());
				});

				model.categories().subscribe((categories) => {
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
