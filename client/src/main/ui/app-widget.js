(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;
	var i18n = require('./i18n').i18n();
	
	var MapModel = require('./map-model');
	var LoadingIndicator = require('./loading-indicator');
	var LegendWidget = require('./legend-widget');

    exports.render = function (container, task) {
		precondition(container, 'Application Widget requires a container');
		precondition(task, 'ApplicationWidget requires an ApplicationTask');
            
        var widgetContainer = d3.select(container[0])
            .append('div')
			.classed('app-widget-container', true);
			
		task.status()
			.subscribe(function (status) {
				status.match({
					loading: function () {
						LoadingIndicator.render(widgetContainer, i18n.LOADING);
					},
					ready: function (homes) {
						var model = MapModel.newModel(homes);
						widgetContainer.selectAll('*').remove();
						
						LegendWidget.render($(widgetContainer[0]), model);
						
						widgetContainer
							.append('div')
							.attr('id', 'proxicity-map')
							.classed('proxicity-map-container', true);
						
						var map = new L.map('proxicity-map', defaultOptions());
						L.tileLayer("http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png").addTo(map);
		
						L.geoJson(model.geojson(), {
							pointToLayer: function (feature, latlng) {
								return L.circleMarker(latlng);
							},
							onEachFeature: function (feature, layer) {
								layer.bindPopup(feature.properties.name);
							}
						}).addTo(map);
						
						map.fitBounds(boundsOf(model.geojson()));
					}
				});
			});
    };
	
	function boundsOf(geojson) {
		var bounds = d3.geo.bounds(geojson);
		var bottomLeft = swapCoordinates(bounds[0]);
        var topRight = swapCoordinates(bounds[1]);
        var correctedBounds = [bottomLeft, topRight];

        return correctedBounds;
	}
	
	function swapCoordinates(coordinates) {
		return [coordinates[1], coordinates[0]];
	}
    
    function defaultOptions() {
        return {
            center: [37.8, -96.9],
            zoom: 5,
            scrollWheelZoom: true,
            attributionControl: false,
            zoomAnimation: false,
            markerZoomAnimation: false,
            urlLayerTemplate: "",
            dragging: true,
            boxZoom: false,
            doubleClickZoom: true,
            zoomControl: false,
            inertia: false
        };
    }
}());