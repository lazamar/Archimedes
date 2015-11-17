var prop, transport;

transport = (function () {
    var searchRadius = 500;

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
        var i, j, k, stop, stopInstance, stopPoint,
            lines = [],
            stopPoints = [];
        // Go Through bus stops returned and create a simplified bus stops
        // array.
        for (i = 0; i < tflObj.stopPoints.length; i++) {
            stop = tflObj.stopPoints[i];
            lines = [];
            for (j = 0; j < stop.lines.length; j++) {
                lines.push(stop.lines[j].name);
            }
            //Each stop can have two children, one with buses going
            //one way and the other with them going the opposite
            //way.
            for (j = 0; j < stop.children.length; j++) {
                stopInstance = stop.children[j];
                stopPoint = {
                    'id': stopInstance.id,
                    'commonName': stopInstance.commonName,
                    'lat': stopInstance.lat,
                    'lon': stopInstance.lon,
                    'lines': lines,
                    'stopLetter': stopInstance.stopLetter,
                    'indicator': stopInstance.indicator
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

    return {
        nearbyStops: function (lat, lon) {
            var stopsPromise = Promise.defer(),
                request = require('request'),
                url = buildStopSearchUrl(lat, lon);

            request.get(url, function (error, response, body) {
                var tflObj, stopPoints;

                if (error || response.statusCode !== 200) {
                    stopsPromise.reject("Error in TFL request");
                    return;
                }

                tflObj = JSON.parse(body);
                stopPoints = simplifyStopsObj(tflObj);
                stopsPromise.resolve(stopPoints);
                return;
            });
            return stopsPromise.promise;
        },

        getBusTimes: function (id) {
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

    };
}());


// Export functions
for (prop in transport) {
    if (transport.hasOwnProperty(prop)) {
        exports[prop] = transport[prop];
    }
}
