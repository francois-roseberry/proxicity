(function () {
    "use strict";

    var precondition = require('./contract').precondition;

    var CONNECTION_IMPOSSIBLE = 0;

    module.exports.get = function (url) {
		precondition(_.isString(url) && url.length > 0, 'Rest client can only GET from a non-empty url');
		
        var promise = $.ajax({
            url: url
        }).then(_.identity, transformErrors(url));
		
        return Rx.Observable.fromPromise(promise);
    };

    function transformErrors(url) {
        return function (response) {
            if (response.status === CONNECTION_IMPOSSIBLE) {
                return new Error("Could not make a request to " + url +" .");
            }

            return new HttpError(url, response.status, response.statusText, response.responseText);
        };
    }

    function HttpError(url, statusCode, statusText, responseEntity) {
        this.name = "HttpError";
        this.url = url;
        this.responseEntity = responseEntity;
        this.message = "Server returned status '" + statusCode + " " + statusText + "' when querying url '" + url + "'";
    }

    HttpError.prototype = new Error();
    HttpError.prototype.constructor = HttpError;
}());