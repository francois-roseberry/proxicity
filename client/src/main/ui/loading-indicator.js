'use strict';

var precondition = require('./contract').precondition;

/**
 * Render a loading indicator (animated gif). If a message is provided, the indicator is wrapped inside a <div>
 * which contains the message above the indicator.
 *
 * @param container     D3 container of the indicator.
 * @param message       Optional. Message to display with the indicator.
 */
exports.render = (container, message) => {
    if (message) {
        precondition(_.isString(message), 'LoadingIndicator require the message to be a string');

        container = container.append('div')
            .classed('map4-loading-indicator', true)
            .attr('data-ui', 'loading-indicator');

        container.append('p')
            .text(message);
    }

    var loadingIndicator = container.append('img')
    	.attr('src', '/images/loading_32x32.gif')
    	.attr('width', 32)
    	.attr('height', 32);

    if (!message) {
        loadingIndicator.attr('data-ui', 'loading-indicator');
    }
};
