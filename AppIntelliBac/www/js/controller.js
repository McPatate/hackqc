app.controller('controller', [ '$http', '$rootScope', '$scope', function($http, $rootScope, $scope) {

    this.scope = $scope;


    $scope.control =
        L.Routing.control({
            waypoints: [
                L.latLng(45.46516, -73.59939),
                L.latLng(45.46945, -73.59018),
                L.latLng(45.46194, -73.58808)
            ]
        }).addTo(map);

    $scope.distanceCalc = function (userLocation, newPoi) {
        var R = 6371e3;
        var φ1 = Math.abs(userLocation.latitude).toRadians();
        var φ2 = Math.abs(newPoi.latitude).toRadians();
        var λ1 = Math.abs(userLocation.longitude).toRadians();
        var λ2 = Math.abs(newPoi.longitude).toRadians();
        var Δφ = φ2 - φ1;
        var Δλ = λ2 - λ1;
        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.round((R * c));
    };

    $scope.addPoint = function(poi){
        $scope.control.spliceWaypoints($scope.control.getWaypoints().length, 1, poi);

    };
    $scope.delPoint = function(){
        $scope.control.spliceWaypoints(0, 1);
    };

    $scope.travauxPos = [];

    $scope.addTravaux = function(lat, lon){
        var travauxIcon = L.icon({
            iconUrl: '../img/pan.png',
            //shadowUrl: '../img/pan.png',
            iconSize:     [30, 30], // size of the icon
            //shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
            // shadowAnchor: [4, 62],  // the same for the shadow
        });
        travauxPos.push([lat, lon]);
        L.marker([lat, lon], {icon: travauxIcon}).addTo(map);
    };

    $scope.getTravaux = function() {
        $http.get("http://intellibac.herokuapp.com/Travaux").then(function (response){
            travauxPos = [];
            var data = response.data;
            for (var i = 0; i < data.length; i++)
                $scope.addTravaux(data[i].position.lat, data[i].position.lon);
        });
    };

    var popup = L.popup();
    $scope.test = 1;
    map.on('click', function(event) {
        if ($scope.test == 1) {
            $scope.addPoint(L.latLng(45.4641, -73.60171));
            $scope.test = 0;
        }else
        popup
            .setLatLng(event.latlng)
            .setContent("Vous êtes ici: " + event.latlng.toString())
            .openOn(map);
    });

    $scope.getBac = function() {
        $http.get("http://intellibac.herokuapp.com/bacs").then(function (response) {
            var data = response.data;
            for (var i = 0; i < data.length; i++){
                var dis = -1, trav = null;
                var lat = data[i].position.lat;
                var lon = data[i].position.lon;
                $scope.addPoint(L.latLng(lat,lon));

               /* $scope.travauxPos.forEach(function(x) {
                    if (dis == -1 || $scope.distanceCalc(x, L.latLng(lat, lon)) < dis)
                    {
                        trav = L.latLng(x[0], x[1]);
                        dis = $scope.distanceCalc(trav, L.latLng(lat, lon));
                    }
                });

                if (i + 1 < data.length &&
                    $scope.distanceCalc(trav, L.latLng(data[i+1].position.lat, data[i+1].position.lat)) > dis) {
                       $scope.addPoint(L.latLgn(lat - (trav.longitude - lon),
                       lon - (trav.latitude - lat)));
                }*/
            }
        });
    };

    $scope.getTravaux();
    $scope.getBac();
}]);