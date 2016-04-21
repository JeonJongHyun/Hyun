angular.module('MyApp.controllers.Main', [])

.controller('MainCtrl', function($rootScope, $scope, $compile, $timeout,Auth){



        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth()+1;
        var y = date.getFullYear();

        var d_day;

        d_day =  Math.floor((new Date(2015, 10-1, 24).getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
        $scope.alertMessage = '결혼식 : d-day ' + d_day;
        /* event source that contains custom events on the scope */
        $scope.events = [
            {title: '중복',start: new Date(2015, 7-1, 23)},
            {title: '여름휴가',start: new Date(2015, 8-1, 3),end: new Date(2015, 8-1, 8),allDay: false},
            {title: '아버지생신',start: new Date(2015, 8-1, 8)},
            {title: '대구',start: new Date(2015, 9-1, 19)},
            {title: '추석',start: new Date(2015, 9-1, 26),end: new Date(2015, 9-1, 29),allDay: false},
            {title: '웨딩샵',start: new Date(2015, 10-1, 3)},
            {title: '서울모임',start: new Date(2015, 10-1, 9),end: new Date(2015, 10-1, 11),allDay: false}

        ];
        /* event source that calls a function on every view switch */
        $scope.eventsF = function (start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
            callback(events);
        };

        $scope.calEventsExt = {
            color: '#f00',
            textColor: 'yellow',
            events: [
                {type:'party',title: '결혼식',start: new Date(2015, 10-1, 24, 12, 0),end: new Date(2015, 10-1, 24, 14, 0),allDay: false},
                {type:'party',title: '멕시코 칸쿤',start: new Date(2015, 10-1, 25, 12, 0),end: new Date(2015, 11-1, 01, 18, 0),allDay: false}
            ]
        };
        /* alert on eventClick */
        $scope.alertOnEventClick = function( date, jsEvent, view){
            $scope.alertMessage = (date.title + ' was clicked ');
        };
        /* alert on Drop */
        $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){

            $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* Change View */
        $scope.changeView = function(view,calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
        };
        /* Change View */
        $scope.renderCalender = function(calendar) {
            $timeout(function() {
                if(uiCalendarConfig.calendars[calendar]){
                    uiCalendarConfig.calendars[calendar].fullCalendar('render');
                }
            });
        };
        /* Render Tooltip */
        $scope.eventRender = function( event, element, view ) {
            element.attr({'tooltip': event.title,
                'tooltip-append-to-body': true});
            $compile(element)($scope);
        };

        /* config object */
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: true,
                header:{
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick
               // eventDrop: $scope.alertOnDrop,
               // eventResize: $scope.alertOnResize,
               // eventRender: $scope.eventRender
            }
        };


        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        /* event sources array*/
        $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];



        /*image Carousel*/
        /*
        $scope.colors = ["#fc0003", "#f70008", "#f2000d", "#ed0012", "#e80017", "#e3001c", "#de0021", "#d90026", "#d4002b", "#cf0030", "#c90036", "#c4003b", "#bf0040", "#ba0045", "#b5004a", "#b0004f", "#ab0054", "#a60059", "#a1005e", "#9c0063", "#960069", "#91006e", "#8c0073", "#870078", "#82007d", "#7d0082", "#780087", "#73008c", "#6e0091", "#690096", "#63009c", "#5e00a1", "#5900a6", "#5400ab", "#4f00b0", "#4a00b5", "#4500ba", "#4000bf", "#3b00c4", "#3600c9", "#3000cf", "#2b00d4", "#2600d9", "#2100de", "#1c00e3", "#1700e8", "#1200ed", "#0d00f2", "#0800f7", "#0300fc"];

        function getSlide(target, style) {
            var i = target.length;
            return {
                id: (i + 1),
                label: 'slide #' + (i + 1),
                img: 'http://lorempixel.com/450/300/' + style + '/' + ((i + 1) % 10) ,
                color: $scope.colors[ (i*10) % $scope.colors.length],
                odd: (i % 2 === 0)
            };
        }

        function addSlide(target, style) {
            target.push(getSlide(target, style));
        };

        //$scope.carouselIndex = 3;
        //$scope.carouselIndex2 = 0;
        //$scope.carouselIndex2 = 1;
        //$scope.carouselIndex3 = 5;
        //$scope.carouselIndex4 = 5;

        function addSlides(target, style, qty) {
            for (var i=0; i < qty; i++) {
                addSlide(target, style);
            }
        }

        $scope.slides2 = [];
        addSlides($scope.slides2, 'fashion', 10);

*/

        if(document.documentElement.clientWidth <400){
            $scope.slides_show = 2;
        }else{
            $scope.slides_show = 3;
        };

        $timeout(function() {
            return $scope.awesomeThings = ['♥우리결혼해요♥', '10월24일',
                '영주제일교회', '종현이랑', '지욱이가', '축하해주세요', '감사합니다.'];
          }, 1000);
          return $scope.breakpoints = [
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            }, {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ];




    });