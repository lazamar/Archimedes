var prop, transport;

transport = (function () {
    var searchRadius = 2500;

    function buildStopSearchUrl(lat, lon) {
        return 'https://api.tfl.gov.uk/StopPoint?' +
            'lat=' + lat +
            '&lon=' + lon +
            '&stopTypes=CarPickupSetDownArea,NaptanAirAccessArea,NaptanAirEntrance,NaptanAirportBuilding,NaptanBusCoachStation,NaptanBusWayPoint,NaptanCoachAccessArea,NaptanCoachBay,NaptanCoachEntrance,NaptanCoachServiceCoverage,NaptanCoachVariableBay,NaptanFerryAccessArea,NaptanFerryBerth,NaptanFerryEntrance,NaptanFerryPort,NaptanFlexibleZone,NaptanHailAndRideSection,NaptanLiftCableCarAccessArea,NaptanLiftCableCarEntrance,NaptanLiftCableCarStop,NaptanLiftCableCarStopArea,NaptanMarkedPoint,NaptanMetroAccessArea,NaptanMetroEntrance,NaptanMetroPlatform,NaptanMetroStation,NaptanOnstreetBusCoachStopCluster,NaptanOnstreetBusCoachStopPair,NaptanPrivateBusCoachTram,NaptanPublicBusCoachTram,NaptanRailAccessArea,NaptanRailEntrance,NaptanRailPlatform,NaptanRailStation,NaptanSharedTaxi,NaptanTaxiRank,NaptanUnmarkedPoint,TransportInterchange' +
            '&radius=' + searchRadius +
            '&useStopPointHierarchy=True&' +
            'returnLines=True' +
            '&app_id=' + AppKeys.tflAPI.appId +
            '&app_key=' + AppKeys.tflAPI.appKey;
    }

    function simplifyStopsObj(tflObj) {
        var i, j, k, stop, stopInstance, stopPoint, stopPoints = [];
        // Go Through bus stops returned and create a simplified bus stops
        // array.
        for (i = 0; i < tflObj.stopPoints.length; i++) {
            stop = tflObj.stopPoints[i];
            //Each stop can have two children, one with buses going
            //one way and the other with them going the opposite
            //way.
            for (j = 0; j < stop.children.length; j++) {
                stopInstance = stop.children[j];
                stopPoint = {
                    id: stopInstance.id,
                    commonName: stopInstance.commonName,
                    lat: stopInstance.lat,
                    lon: stopInstance.lon,
                    stopLetter: stopInstance.stopLetter,
                    indicator: stopInstance.indicator
                };

                //Check if there is a record in additional properties that says
                //which direction buses or trains are going towards in this
                //stop.
                for (k = 0; k < stopInstance.additionalProperties.length; k++) {
                    if (stopInstance.additionalProperties[k].key === "Towards") {
                        stopPoint.towards = stopInstance.additionalProperties[k].value;
                    }
                }
                stopPoints.push(stopPoint);
            }
        }
        return stopPoints;
    }

    function getBusTimes(id) {
        var responseObj,
            arrivals = [],
            timePromise = Promise.defer(),
            request = require('request'),
            url = 'https://api.tfl.gov.uk/StopPoint/' + id +
                '/Arrivals?app_id=' + AppKeys.tflAPI.appId +
                '&app_key=' + AppKeys.tflAPI.appKey;

        request.get(url, function (error, response, body) {
            var i;
            if (error || response.statusCode !== 200) {
                timePromise.reject("Error in TFL request");
                return;
            }
            responseObj = JSON.parse(body);

            //Simplify the bus times array
            for (i = 0; i < responseObj.length; i++) {
                arrivals.push({
                    line: responseObj[i].lineName,
                    destination: responseObj[i].destinationName,
                    arrival: new Date(responseObj[i].timeToLive)
                });
            }
            timePromise.resolve(arrivals);
        });

        return timePromise.promise;
    }

    return {
        nearbyStops: function (lat, lon) {
            var stopsPromise = Promise.defer(),
                request = require('request'),
                url = buildStopSearchUrl(lat, lon);

            request.get(url, function (error, response, body) {
                var i, tflObj, stopPoints, busTimesPromises = [];

                if (error || response.statusCode !== 200) {
                    stopsPromise.reject("Error in TFL request");
                    return;
                }

                tflObj = JSON.parse(body);
                stopPoints = simplifyStopsObj(tflObj);
                //Get but times for all stops
                for (i = 0; i < stopPoints.length; i++) {
                    busTimesPromises.push(getBusTimes(stopPoints[i].id));
                }

                Promise.all(busTimesPromises).then(function (values) {
                    var j;
                    //Now we can return the main promise
                    for (j = 0; j < stopPoints.length; j++) {
                        stopPoints[j].lines = values[j];
                    }
                    stopsPromise.resolve(stopPoints);
                });
                return;
            });
            return stopsPromise.promise;
        }

    };
}());


// Export functions
for (prop in transport) {
    if (transport.hasOwnProperty(prop)) {
        exports[prop] = transport[prop];
    }
}
