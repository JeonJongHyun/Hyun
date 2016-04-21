/**
 * Created by hyun4513 on 2015-07-30.
 */

var messageCtr = angular.module('MyApp.controllers.Message',['ui.bootstrap']);

messageCtr.controller('MessageCtrl',
    ['$rootScope', '$scope', '$http','HttpService', 'messageService','Auth',
    function($rootScope,$scope,$http, HttpService, messageService, Auth){

        var preSeeingIndex = -1;
        var currentSeeingIndex = -1;
        var oldTitle='';
        var oldContents='';

        $scope.pageInfo=messageService.pageInfo;
        var pageInfo = messageService.pageInfo;

        pageInfo.listPerPage = 5;
        $scope.guestMsgs = messageService.msgDatas;
        //$scope.listPerPage = pageInfo.listPerPage ; //TEST
        $scope.viewHits = messageService.viewHits;
        $scope.oneAtATime = true;
        $scope.editing = false;
        $scope.onSearching = false;
        //$scope.testVar = "yyyyyy";//test

        HttpService.setCountAllApiUrl("apis/countAll");
        HttpService.setCountSearchResultApiUrl("apis/countSearchResult/"); //TODO : 한번에 건수와 결과를 받아오기..


        HttpService.getPagedList(pageInfo.currentPage, pageInfo.listPerPage)
                        .then( function() {
                            HttpService.getCountAll();
                            //reset pageInfo.totalMsgCnt ,pageInfo.totalPages ,pageInfo.totalPageSets
                        });

        //------------------------------------------------------------
        $scope.changeViewToEdit = function (indexAtView) {
                        //console.log("editMsg : id->", indexAtView); //debug
                        $scope.editing = true;
                        oldTitle    = $scope.guestMsgs[indexAtView].title;
                        oldContents = $scope.guestMsgs[indexAtView].contents;
                        //console.log("oldTitle :", oldTitle); //debug
                        //console.log("oldContents :", oldContents); //debug
                    };

                    //--------------------------------------------------------------------
                    $scope.cancelEdit = function (indexAtView) {
                        $scope.editing = false;
                        $scope.currentSeeingIndex = -1;
                        //console.log("cancel oldTitle :", oldTitle); //debug
                        //console.log("cancel oldContents :", oldContents); //debug
                        $scope.guestMsgs[indexAtView].title = oldTitle;
                        $scope.guestMsgs[indexAtView].contents=oldContents;
                    };

                    var updateHitFlag = false;

                    //--------------------------------------------------------------------
                    $scope.headerClicked = function (msg, index) {

                        $scope.userCheck = false;

                        if($rootScope.currentUser != undefined){

                            if($scope.guestMsgs[index].user == $rootScope.currentUser.name)
                                $scope.userCheck = true;
                        }




                        if($scope.editing){
                            //editing하는 도중, 저장없이 클릭하는 경우--> 사용자 확인.
                        }

                        $scope.editing = false;
                        currentSeeingIndex = index;

                        //console.log("preSeeingIndex="+preSeeingIndex); //debug
                        //console.log("currentSeeingIndex="+currentSeeingIndex); //debug
                        //console.log("headerClicked!! msg->"+ msg.title+" index->"+index+" updateHitFlag="+updateHitFlag ); //debug
                        //console.log("_id="+msg._id); //debug
                        if( preSeeingIndex !=currentSeeingIndex) {
                            //이미 펼쳐진 상태에서 다른글의 헤더를 누른경우
                            updateHitFlag = true;
                        }else{
                            //동일한 글의 헤더를 2번 클릭하는경우 처음 펼필때만 update
                            updateHitFlag = !updateHitFlag;
                        }

                        if(updateHitFlag ){
                            //동일한 글의 헤더를 2번 클릭하는경우 처음 펼필때만 update
                            console.log("update hits :",msg._id); //debug
                            HttpService.updateHits(msg._id)
                                .success(function() {
                                    //console.log("updateHits OK!"); //debug
                                    $scope.viewHits[index] +=1; //update UI
                                })
                                .error (function () {
                                    console.log('updateHits Error'); //debug
                                }
                            );
                        }
                        preSeeingIndex = currentSeeingIndex;
                    };

                    //------------------------------------------------------------
                    $scope.updateMsg = function(msg) {
                        if (msg.title.length > 0 && msg.contents.length > 0) {
                            //var msgData = $scope.guestMsgs[currentSeeingIndex];
                            //console.log("contents valid"); //debug
                            HttpService.update(msg)
                                .success(function() {
                                    //console.log("UpdateMsg OK!"); //debug
                                })
                                .error (function () {
                                    console.log('UpdateMsg Error'); //debug
                                }
                            );
                        }else{
                            console.log("contents invalid!!");
                            //error
                        }
                        $scope.editing = false;
                        currentSeeingIndex = -1;
                    };

                    $scope.$on('writeError', function(event, data){
                        console.log('writeError!!'); //debug
                        //TODO
                        //alert("write message error! : "+data);
                    });
                    //------------------------------------------------------------
                    $scope.deleteMsg = function (msgObjId){
                        //console.log("delete : id->", msgObjId); //debug

                        $scope.cancelSearch(); //TODO : 검색중에 삭제하는 경우 리스트 유지
                        //var pageInfo = $scope.pageInfo;

                        var thisIsLastPageAndMsgCnt=0;
                        if(pageInfo.currentPage == pageInfo.totalPages ){
                            //마지막 페이지의 메시지갯수가 1개였을때 이메시지를 삭제하는 경우, 이전 페이지로 전환이 필요함!!
                            thisIsLastPageAndMsgCnt = pageInfo.totalMsgCnt % pageInfo.listPerPage;
                            if(thisIsLastPageAndMsgCnt==0){
                                thisIsLastPageAndMsgCnt = pageInfo.listPerPage;
                            }
                            //console.log('thisIsLastPageAndMsgCnt=',thisIsLastPageAndMsgCnt); //debug
                        }

                        HttpService.delete(msgObjId)
                            .success(function() {
                                //마지막 페이지의 마지막 게시물 삭제시, last 페이지 변경(-1)
                                if(thisIsLastPageAndMsgCnt ==1){
                                    pageInfo.currentPage -=1;
                                    pageInfo.currentPageSet-=1;
                                    //console.log('decrease page !!',pageInfo.currentPage); //debug
                                    //console.log('decrease currentPageSet !!',pageInfo.currentPageSet); //debug
                                }

                                HttpService.getPagedList(pageInfo.currentPage, pageInfo.listPerPage)
                                    .then( function() {
                                        HttpService.getCountAll()
                                            .then(function(){
                                                updateHitFlag = false; //reset!!
                                                preSeeingIndex = -1; //reset!!
                                            });
                                        //reset pageInfo.totalMsgCnt ,pageInfo.totalPages ,pageInfo.totalPageSets

                                    });

                            })
                            .error (function () {
                                console.log('deleteMsg Error'); //debug
                            });
                    };

                    //------------------------------------------------------------
                    $scope.searchText ="";
                    $scope.searchThis = function () {
                       // console.log('searchThis:', $scope.searchText); //debug

                        if($scope.searchText.trim().length==0){
                            return;
                        }

                        messageService.searchText = $scope.searchText;

                        HttpService.getSearchPagedList( 1, pageInfo.listPerPage)
                            .then( function() {
                                $scope.onSearching = true;
                                pageInfo.currentPage = 1;//XXX TODO 너무 복잡하다!!!
                                pageInfo.currentPageSet = 1;
                                //$rootScope.$broadcast('onSearchingChanged', true);
                                HttpService.getSearchResultCount();
                                //reset pageInfo.totalMsgCnt ,pageInfo.totalPages ,pageInfo.totalPageSets
                            });

                    };

                    $scope.cancelSearch = function () {
                        //console.log("cancel search!"); //debug
                        $scope.onSearching = false;
                        pageInfo.currentPage = 1;
                        pageInfo.currentPageSet = 1;
                        $scope.searchText="";

                        //$rootScope.$broadcast('onSearchingChanged', false);

                        //모든 게시물 재출력
                        HttpService.getPagedList(pageInfo.currentPage, pageInfo.listPerPage)
                            .then( function() {
                                HttpService.getCountAll();//XXX TODO 너무 복잡하다!!!
                                //reset pageInfo.totalMsgCnt ,pageInfo.totalPages ,pageInfo.totalPageSets
                            });
                    };



        $scope.newMsgData ={
            user:"",
            tel:"",
            title:"",
            contents:""
        };

        $scope.initMsg = function() {

            $scope.newMsgData.user = $rootScope.currentUser.name;
            $scope.newMsgData.tel = $rootScope.currentUser.tel;
            $scope.newMsgData.title = "";
            $scope.newMsgData.contents = "";
        }

        $scope.saveNewMsg = function() {
            //console.log($scope.newMsgData); //debug
            if ($scope.newMsgData.title != undefined && $scope.newMsgData.contents != undefined ) {

                if ($scope.newMsgData.title == '' || $scope.newMsgData.contents == '' ) {
                    console.log("invalid input!"); //debug
                    return;
                }

                HttpService.create($scope.newMsgData)
                    .then(function() {
                    //console.log("create #1");//debug
                    pageInfo.currentPageSet=1;//20141214
                    pageInfo.currentPage =1;
                    }, function(err){
                        //console.log("create Error!!-->",err);
                    })
                    .then(function(){
                        //console.log("create #2");//debug
                        HttpService.getPagedList(pageInfo.currentPage, pageInfo.listPerPage)
                            .then( function() {
                                //console.log("create #3");//debug
                                HttpService.getCountAll();
                                //reset pageInfo.totalMsgCnt ,pageInfo.totalPages ,pageInfo.totalPageSets
                            });
                    });

            }else{
                //TODO :handle error
            }
        }



}]);

