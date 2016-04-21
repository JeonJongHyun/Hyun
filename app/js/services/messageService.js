var messageService = angular.module('MyApp');

//global data
messageService.factory('messageService', function(){

    return  {
        msgDatas:[],
        viewHits : [],
        already_fetched_data: {
            user: '',
            tel: '',
            title:'',
            contents:'',
            reg_date: '',
            check:false,
            hits: 0
        },
        pageInfo: {
            listPerPage: 1, //한 페이지당 표시할 메시지 수
            totalPages: -1,
            totalMsgCnt: -1,
            maxVisiblePages: 5,//선택가능한 최대 페이지 표시수, 초과시에는 다음 이전을 통해 접근.
            currentPage: 1,    //사용자가 선택한 페이지를 계속 저장
            totalPageSets:-1,
            currentPageSet: 1 // ex: 전체 100 페이지 존재하는데(totalPages), 표시 페이지 단위가 5이면(maxVisiblePages),
            // 총 20 page sets (totalPageSets) 이 생성된다.
            // 이 page sets 들에서 현재 표시되고 있는 화면의 page set 을 의미함.
        },
        searchText:''
    };
});


//http wrapper
messageService.factory('HttpService', function($rootScope,$http, $log,$q, messageService){

    var i = 0;
    var countAllApiUrl;
    var countSearchResultApiUrl;

    function getCountAll() {
        var deferred = $q.defer();



        $http.get(countAllApiUrl )
            .success(function(totalCount) {
                var i = 0;
                var pageInfo = messageService.pageInfo;

                //console.log( "-myPaginationDirective totalCount: " + totalCount ); //debug
                pageInfo.totalMsgCnt = totalCount; //save to service
                pageInfo.totalPages = Math.ceil(pageInfo.totalMsgCnt / pageInfo.listPerPage);
                pageInfo.totalPageSets = Math.ceil(pageInfo.totalPages / pageInfo.maxVisiblePages);

                $rootScope.$broadcast('newCountArrived');//XXX
                deferred.resolve();

            })
            .error (function () {
                deferred.reject(err);
                console.log( "count all Error!: " ,err );
            });

        return deferred.promise;
    }

    function getSearchResultCount() {
        $http.get(countSearchResultApiUrl+messageService.searchText )
            .success(function(totalCount) {
                var i = 0;
                var pageInfo = messageService.pageInfo;

                //console.log( "-myPaginationDirective totalCount: " + totalCount ); //debug
                pageInfo.totalMsgCnt = totalCount; //save to service
                pageInfo.totalPages = Math.ceil(pageInfo.totalMsgCnt / pageInfo.listPerPage);
                pageInfo.totalPageSets = Math.ceil(pageInfo.totalPages / pageInfo.maxVisiblePages);

                $rootScope.$broadcast('newCountArrived');//XXX
            })
            .error (function () {
                console.log( "getSearchResultCount Error!: "  );
            });
    }

    function estimateMsgRowsAndBuildHitsArray (rawServerData) {

        for( i = 0; i<rawServerData.length; i++){

            var carriageReturnCnt= rawServerData[i].contents.split("\n").length - 1;
            if(carriageReturnCnt < 8){
                rawServerData[i].rows = 8; //기본값
            }else{
                rawServerData[i].rows = carriageReturnCnt + 1;
            }
        }

        angular.copy(rawServerData, messageService.msgDatas);

        //update hits
        var i = 0;
        var hits =[];
        for(i=0;i<messageService.pageInfo.listPerPage;i++){
            if(messageService.msgDatas[i]){
                hits.push(messageService.msgDatas[i].hits);
            }
        }
        angular.copy(hits, messageService.viewHits);
    }

    return {

        getPagedList : function(page, listPerPage) {
            //return $http.get('/apis/list/'+page+'/'+listPerPage);
            var deferred = $q.defer();
            $http.get('/apis/list/'+page+'/'+listPerPage)
                .success(function(data, status, headers, config) {
                    estimateMsgRowsAndBuildHitsArray(data);
                    deferred.resolve();
                })
                .error(function(err) {
                    deferred.reject(err);
                    $log.error(err);
                });

            return deferred.promise;
        },

        //search
        getSearchPagedList:function( page, listPerPage) {
            //console.log("getSearchPagedList: page="+page+"/ listPerPAge="+listPerPage);//debug
            var deferred = $q.defer();
            $http.get('/apis/searchList/'+messageService.searchText+'/'+page+'/'+listPerPage)
                .success(function(data, status, headers, config) {
                    //console.log("data:", data);//debug
                    estimateMsgRowsAndBuildHitsArray(data);
                    deferred.resolve();
                })
                .error(function(err) {
                    deferred.reject(err);
                    $log.error(err);
                });

            return deferred.promise;
        },

        updateHits: function(id) {
            return $http.get('/apis/updateHits/'+id);
        },

        create : function(msgData) {
            var deferred = $q.defer();
            //return $http.post('/apis/write', msgData);
            $http.post('/apis/write', msgData)
                .success(function(data, status, headers, config) {
                    deferred.resolve();
                })
                .error(function(err) {
                    //$log.error("write Error:",err);
                    deferred.reject(err);
                    $rootScope.$broadcast('writeError',err);//XXX
                });

            return deferred.promise;

        },

        update : function(msgData) {
            return $http.put('/apis', msgData);
        },

        delete : function(id) {
            return $http.delete('/apis/' + id);
        }
        ,
        getCountAll:getCountAll,

        setCountAllApiUrl: function(url){
            countAllApiUrl = url;
        },

        getSearchResultCount:getSearchResultCount,

        setCountSearchResultApiUrl: function(url){
            countSearchResultApiUrl = url;
        }

    }
});