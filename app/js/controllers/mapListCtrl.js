/**
 * Created by hyun on 2015-08-03.
 */

var mapCtr = angular.module('MyApp.controllers.Map', ['uiGmapgoogle-maps']);

mapCtr.config(
    ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
    }]
);

mapCtr.controller('MapCtrl',['$scope', '$timeout', 'uiGmapLogger', 'uiGmapGoogleMapApi','Auth',
    function($scope, $timeout, $log, GoogleMapApi, Auth){
    //$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    //GoogleMapApi.then(function(maps) {
    //    $scope.map.rectangle.bounds = new maps.LatLngBounds(
    //        new maps.LatLng(55,-100),
    //        new maps.LatLng(49,-78)
    //    );
    //});


        var clusterTypes = ['standard','ugly','beer'];
        var selectedClusterTypes = {
            ugly:{
                title: 'Hi I am a Cluster!',
                gridSize: 60, ignoreHidden: true,
                minimumClusterSize: 2,
                imageExtension: 'png',
                imagePath: 'assets/images/cluster', imageSizes: [72]
            },
            beer:{
                title: 'Beer!',
                gridSize: 60,
                ignoreHidden: true,
                minimumClusterSize: 2,
                enableRetinaIcons: true,
                styles: [{
                    url: 'assets/images/beer.png',
                    textColor: '#ddddd',
                    textSize: 18,
                    width: 33,
                    height: 33,
                }]
            },
            standard:{
                title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2
            }
        };
        var selectClusterType = function(value){
            var cloned = _.clone($scope.map.randomMarkers, true);
            $scope.map.randomMarkers = [];
            $scope.map.clusterOptions = $scope.map.selectedClusterTypes[value] || $scope.map.selectedClusterTypes['standard'];
            $scope.map.clusterOptionsText =  angular.toJson($scope.map.clusterOptions);
            if(!value){
                value = 'standard';
            }
            $timeout(function(){
                $scope.map.randomMarkers = cloned;
            },200);

            return value;
        };


        angular.extend($scope, {
            example2: {
                doRebuildAll: false
            },
            clickWindow: function () {
                $log.info('CLICK CLICK');
                Logger.info('CLICK CLICK');
            },
            map: {
                show: true,
                control: {},
                version: "uknown",
                heatLayerCallback: function (layer) {
                    //set the heat layers backend data
                    var mockHeatLayer = new MockHeatLayer(layer);
                },
                showTraffic: false,
                showBicycling: true,
                showWeather: true,
                showHeat: true,
                center: {
                    latitude: 36.828410,
                    longitude: 128.622293
                },
                options: {
                    streetViewControl: false,
                    panControl: false,
                    maxZoom: 20,
                    minZoom: 3
                },
                zoom: 15,
                dragging: false,
                bounds: {},
                markers: [
                    {
                        id: 1,
                        latitude: 36.828274,
                        longitude: 128.620592,
                        showWindow: false,
                        title: '영광중학교 옆 무료주차장입니다.',
                        options: {
                            animation: 2,
                            labelContent: '주차장',
                            labelAnchor: "26 0",
                            labelClass: "marker-labels"
                        }
                    },
                    {
                        id: 2,
                        icon: 'image/image1.png',
                        latitude: 36.828133,
                        longitude: 128.622255,
                        showWindow: false,
                        title: '결혼식장 본관 입니다.',
                        options: {
                            animation: 1,
                            labelContent: '결혼식장(제일교회 본관)',
                            labelAnchor: "26 0",
                            labelClass: "marker-labels"
                        }
                    },
                    {
                        id: 3,
                        latitude: 36.828015,
                        longitude: 128.622901,
                        showWindow: false,
                        title: '교회 앞마당 주차장입니다. \n뒷편 주차장도 있으니 참고하세요.',
                        options: {
                            animation: 2,
                            labelContent: '주차장',
                            labelAnchor: "26 0",
                            labelClass: "marker-labels"
                        }
                    },
                    {
                        id: 4,
                        latitude: 36.828594,
                        longitude: 128.622043,
                        showWindow: false,
                        title: '교회 뒷마당 주차장입니다. \n크기는 작으니 골목에 주차하셔도 되요.',
                        options: {
                            animation: 2,
                            labelContent: '주차장',
                            labelAnchor: "26 0",
                            labelClass: "marker-labels"
                        }
                    },
                    {
                        id: 5,
                        latitude: 36.852668,
                        longitude: 128.530421,
                        showWindow: false,
                        title: '서울쪽 방향에서 들어오는 풍기IC 입니다.',
                        options: {
                            animation: 2,
                            labelContent: '풍기 IC',
                            labelAnchor: "26 0",
                            labelClass: "marker-labels"
                        }
                    },
                    {
                        id: 6,
                        latitude: 36.770917,
                        longitude: 128.572880,
                        showWindow: false,
                        title: '부산쪽 방향에서 들어오는 영주IC 입니다.',
                        options: {
                            animation: 2,
                            labelContent: '영주 IC',
                            labelAnchor: "26 0",
                            labelClass: "marker-labels"
                        }
                    },
                    {
                        id: 7,
                        latitude: 36.827308,
                        longitude: 128.621556,
                        showWindow: false,
                        title: '식사는 남서울 예식장 지하 1층에 마련하였습니다.',
                        options: {
                            animation: 2,
                            labelContent: '식사',
                            labelAnchor: "26 0",
                            labelClass: "marker-labels"
                        }
                    }
                ],
                //markers2: [
                //    {
                //        id: 1,
                //        icon: 'assets/images/blue_marker.png',
                //        latitude: 46,
                //        longitude: -77,
                //        showWindow: false,
                //        options: {
                //            labelContent: '[46,-77]',
                //            labelAnchor: "22 0",
                //            labelClass: "marker-labels"
                //        }
                //    },
                //    {
                //        id: 2,
                //        icon: 'assets/images/blue_marker.png',
                //        latitude: 33,
                //        longitude: -77,
                //        showWindow: false,
                //        options: {
                //            labelContent: 'DRAG ME!',
                //            labelAnchor: "22 0",
                //            labelClass: "marker-labels",
                //            draggable: true
                //        }
                //    },
                //    {
                //        id: 3,
                //        icon: 'assets/images/blue_marker.png',
                //        latitude: 35,
                //        longitude: -125,
                //        showWindow: false,
                //        options: {
                //            labelContent: '[35,-125]',
                //            labelAnchor: "22 0",
                //            labelClass: "marker-labels"
                //        }
                //    }
                //],
                //mexiIdKey: 'mid',
                //mexiMarkers: [
                //    {
                //        mid: 1,
                //        latitude: 36.828410,
                //        longitude: 128.622293,
                //
                //    },
                //    {
                //        mid: 2,
                //        latitude: 30.369913,
                //        longitude: -109.434814,
                //    },
                //    {
                //        mid: 3,
                //        latitude: 26.739478,
                //        longitude: -108.61084,
                //    }
                //],
                //clickMarkers: [
                //    {id: 1, "latitude": 50.948968, "longitude": 6.944781}
                //    ,
                //    {id: 2, "latitude": 50.94129, "longitude": 6.95817}
                //    ,
                //    {id: 3, "latitude": 50.9175, "longitude": 6.943611}
                //],
                dynamicMarkers: [],
                randomMarkers: [],
                doClusterRandomMarkers: true,
                currentClusterType: 'standard',
                clusterTypes: clusterTypes,
                selectClusterType: selectClusterType,
                selectedClusterTypes: selectedClusterTypes,
                clusterOptions: selectedClusterTypes['standard'],
                clickedMarker: {
                    id: 0,
                    options:{
                    }
                },
                events: {
//This turns of events and hits against scope from gMap events this does speed things up
// adding a blacklist for watching your controller scope should even be better
//        blacklist: ['drag', 'dragend','dragstart','zoom_changed', 'center_changed'],
                    tilesloaded: function (map, eventName, originalEventArgs) {
                    },
                    click: function (mapModel, eventName, originalEventArgs) {
                        // 'this' is the directive's scope
                        $log.info("user defined event: " + eventName, mapModel, originalEventArgs);

                        var e = originalEventArgs[0];
                        var lat = e.latLng.lat(),
                            lon = e.latLng.lng();
                        $scope.map.clickedMarker = {
                            id: 0,
                            options: {
                                labelContent: 'You clicked here ' + 'lat: ' + lat + ' lon: ' + lon,
                                labelClass: "marker-labels",
                                labelAnchor:"50 0"
                            },
                            latitude: lat,
                            longitude: lon
                        };
                        //scope apply required because this event handler is outside of the angular domain
                        $scope.$apply();
                    }
                    //dragend: function () {
                    //    $timeout(function () {
                    //        var markers = [];
                    //
                    //        var id = 0;
                    //        if ($scope.map.mexiMarkers !== null && $scope.map.mexiMarkers.length > 0) {
                    //            var maxMarker = _.max($scope.map.mexiMarkers, function (marker) {
                    //                return marker.mid;
                    //            });
                    //            id = maxMarker.mid;
                    //        }
                    //        for (var i = 0; i < 4; i++) {
                    //            id++;
                    //            markers.push(createRandomMarker(id, $scope.map.bounds, "mid"));
                    //        }
                    //        $scope.map.mexiMarkers = markers.concat($scope.map.mexiMarkers);
                    //    });
                    //}
                },
                //infoWindow: {
                //    coords: {
                //        latitude: 36.270850,
                //        longitude: -44.296875
                //    },
                //    options: {
                //        disableAutoPan: true
                //    },
                //    show: false
                //},
                infoWindowWithCustomClass: {
                    coords: {
                        latitude: 36.827814,
                        longitude: 128.622172
                    },
                    options: {
                        boxClass: 'custom-info-window',
                        closeBoxDiv: '<div" class="pull-right" style="position: relative; cursor: pointer; margin: -20px -15px;">X</div>',
                        disableAutoPan: true
                    },
                    show: true
                },
                //templatedInfoWindow: {
                //    coords: {
                //        latitude: 48.654686,
                //        longitude: -75.937500
                //    },
                //    options: {
                //        disableAutoPan: true
                //    },
                //    show: true,
                //    templateUrl: 'assets/templates/info.html',
                //    templateParameter: {
                //        message: 'passed in from the opener'
                //    }
                //},
                //circles: [
                //    {
                //        id: 1,
                //        center: {
                //            latitude: 44,
                //            longitude: -108
                //        },
                //        radius: 500000,
                //        stroke: {
                //            color: '#08B21F',
                //            weight: 2,
                //            opacity: 1
                //        },
                //        fill: {
                //            color: '#08B21F',
                //            opacity: 0.5
                //        },
                //        geodesic: true, // optional: defaults to false
                //        draggable: true, // optional: defaults to false
                //        clickable: true, // optional: defaults to true
                //        editable: true, // optional: defaults to false
                //        visible: true, // optional: defaults to true
                //        events:{
                //            dblclick: function(){
                //                window.alert("circle dblclick");
                //            }
                //        }
                //    }
                //],
                rectangle:{
                    bounds:{},
                    stroke: {
                        color: '#08B21F',
                        weight: 2,
                        opacity: 1
                    },
                    fill: {
                        color: 'pink',
                        opacity: 0.5
                    },
                    events:{
                        dblclick: function(){
                            window.alert("rectangle dblclick");
                        }
                    },
                    draggable: true, // optional: defaults to false
                    clickable: true, // optional: defaults to true
                    editable: true, // optional: defaults to false
                    visible: true // optional: defaults to true
                },
                //polygonEvents:{
                //    dblclick:function(){
                //        alert("Polgon Double Clicked!");
                //    }
                //},
                //polygons: [
                //    {
                //        id: 1,
                //        path: [
                //            {
                //                latitude: 50,
                //                longitude: -80
                //            },
                //            {
                //                latitude: 30,
                //                longitude: -120
                //            },
                //            {
                //                latitude: 20,
                //                longitude: -95
                //            }
                //        ],
                //        stroke: {
                //            color: '#6060FB',
                //            weight: 3
                //        },
                //        editable: true,
                //        draggable: true,
                //        geodesic: false,
                //        visible: true,
                //        fill: {
                //            color: '#ff0000',
                //            opacity: 0.8
                //        }
                //    }
                //],
                //polygons2: [
                //    {
                //        id: 1,
                //        path: [
                //            {
                //                latitude: 60,
                //                longitude: -80
                //            },
                //            {
                //                latitude: 40,
                //                longitude: -120
                //            },
                //            {
                //                latitude: 45,
                //                longitude: -95
                //            }
                //        ],
                //        stroke: {
                //            color: '#33CDDC',
                //            weight: 3
                //        },
                //        editable: true,
                //        draggable: true,
                //        geodesic: false,
                //        visible: true,
                //        fill: {
                //            color: '#33CCCC',
                //            opacity: 0.8
                //        }
                //    }
                //],
                //polylines: []
            },
            toggleColor: function (color) {
                return color == 'red' ? '#6060FB' : 'red';
            }

        });

}]);
