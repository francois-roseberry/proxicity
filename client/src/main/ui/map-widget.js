(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;
	var i18n = require('./i18n').i18n();
	
	var TimeFormatter = require('./time-formatter');

    exports.render = function (container, model) {
		precondition(container, 'Map Widget requires a container');
		precondition(model, 'Map Widget requires a model');
				
		d3.select(container[0])
			.append('div')
			.attr('id', 'proxicity-map')
			.classed('proxicity-map-container', true);
			
		var map = new L.map('proxicity-map', defaultOptions());
		L.tileLayer("http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png").addTo(map);

		L.geoJson(model.geojson(), {
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					radius: 6,
					stroke: false,
					fillOpacity: 1,
					fillColor: feature.properties.color
				});
			},
			onEachFeature: function (feature, layer) {
				layer.bindPopup(
					feature.properties.name + '<br><br>' + i18n.DATE_POSTED	+
					' : ' + feature.properties.posted + '<br/><br/>' + i18n.GROCERY +
					' :<br>&nbsp;&nbsp;&nbsp;&nbsp;' + feature.properties.grocery.name +
					'<br>&nbsp;&nbsp;&nbsp;&nbsp;' + feature.properties.grocery.address +
					'<br>&nbsp;&nbsp;&nbsp;&nbsp;' +
					TimeFormatter.format(feature.properties.grocery.time) +
					'<br><br>' + i18n.PRICE + ' : ' +
					(feature.properties.price ?
						feature.properties.price + ' $' : i18n.DATA_UNAVAILABLE));
			}
		}).addTo(map);
		
		map.fitBounds(boundsOf(model.geojson()));					
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