var express = require('express');
var mongoose = require('mongoose');
var messageRouter = express.Router();
var my_utils = require('./my-common-utils');


var messageSchema = new mongoose.Schema({

    user: String,
    tel: String,
    title: { type: String},
    contents: { type: String},
    reg_date: String,
    hits: Number
});

var Message = mongoose.model('message', messageSchema);


messageRouter.get('/countAll', function(req, res, next) {
    Message.count(function(error,result){
        if(!error) {
            //console.log("count :"+result);
            res.json(result);
        }
    });
});

messageRouter.get('/list/:page/:listPerPage', function(req, res, next) {
    console.log('******** list page , req.params.page :'+ req.params.page  ); //debug
    //console.log('******** list page , req.params.listPerPage :'+ req.params.listPerPage  ); //debug

    if(req.params.page==0){
        console.log('none');
    }else
    if(req.params.page==1){

        //Message.find().sort({_id:-1}).limit( 5  , function(err, page_msgs) {
        Message.find( function(err, page_msgs) {
            if (err) {
                console.log('******** list page error ************11'); //debug
                res.send(err)
            }
            //console.log('page_msgs='+page_msgs);
            res.json(page_msgs);
        }).sort({_id:-1})
          .limit(parseInt(req.params.listPerPage));
    }else{

        //Message.find().sort({_id:-1}).skip((req.params.page-1)*parseInt(req.params.listPerPage)  ).limit(parseInt(req.params.listPerPage)  , function(err, page_msgs) {
        Message.find(function(err, page_msgs) {
            if (err) {
                console.log('******** list page error ************22'); //debug
                res.send(err)
            }
            res.json(page_msgs);
        }).sort({_id:-1})
          .skip((req.params.page-1)*parseInt(req.params.listPerPage)  )
          .limit(parseInt(req.params.listPerPage));
    }

});

messageRouter.get('/countSearchResult/:searchText', function(req, res, next) {
    //console.log('******** countSearchResult , req.params.searchText :' + req.params.searchText); //debug
    var searchThis = new RegExp(req.params.searchText) ;
    Message.count( { $or: [{user:searchThis },
                                    {title:searchThis},
                                    {contents: searchThis}]},
                function(error,result){
                    if(!error) {
                        console.log("countSearchResult :"+result);
                        res.json(result);
                    }
                });
});

messageRouter.get('/searchList/:searchText/:page/:listPerPage', function(req, res, next) {
    //console.log('******** searchList , req.params.searchText :'+ req.params.searchText  ); //debug
    //console.log('******** searchList , req.params.page :'+ req.params.page  ); //debug
    //console.log('******** searchList , req.params.listPerPage :'+ req.params.listPerPage  ); //debug

    var searchThis = new RegExp(req.params.searchText) ;
    if(req.params.page==1){
        Message.find( { $or: [ {user:searchThis },
                        {title:searchThis},
                        {contents: searchThis}]},
            function(err, page_msgs) {
                if (err) {
                    console.log('******** list page error ************33'); //debug
                    res.send(err)
                }
                console.log(page_msgs);//debug
                res.json(page_msgs);
        }).sort({_id:-1}).limit( parseInt(req.params.listPerPage));

    }else{

        Message.find(  { $or: [ {user:searchThis },
                        {title:searchThis},
                        {contents: searchThis}]}
            ,function(err, page_msgs) {
                if (err) {
                    console.log('******** list page error ************444'); //debug
                    res.send(err)
                }
                res.json(page_msgs);
            }).sort({_id:-1})
            .skip((req.params.page-1)*parseInt(req.params.listPerPage)  )
            .limit(parseInt(req.params.listPerPage));

    }


});


messageRouter.get('/updateHits/:msgObjId', function(req, res, next) {

    Message.update( {"_id": req.params.msgObjId}, {$inc:{hits:1}},
        function(err, one_guest_msg) {
            if (err) {
                console.log('******** update hits ,Error!'+err); //debug
                res.send(err)
            }
            res.end(); //필요하다.
        });
});



messageRouter.post('/write', function(req, res, next) {
    var v_tel = "000000";
    if(req.body.tel != "" ){
        var v_tel = req.body.tel;
    }

    var message= new Message({
            user  : req.body.user,
            tel    : v_tel,
            title : req.body.title,
            contents : req.body.contents,
            reg_date : my_utils.getTimeStamp(),
            hits : 0
        });
    message.save(function(err, saved) {
            if( err || !saved) {
                console.log(err);
                console.log("msg not saved");
            } else {
                res.end(); //필요하다.
            }
        });
});



messageRouter.delete('/:msgObjId', function(req, res, next) {
    //console.log('******** delete ,req.params.msgObjId:'+req.params.msgObjId); //debug
    //findOne!!
    Message.remove( {"_id": req.params.msgObjId}, function(err, data) {
        if (err) {
            console.log('******** remove ,Error!'+err); //debug
            res.send(err)
        }
        res.end(); //필요하다.
    });
});


messageRouter.put('/', function(req, res) {
    //console.log('******** update : _id ==>'+req.body._id); //debug

    Message.findOne(
        {"_id": req.body._id},
        function(err, one_guest_msg) {
            if (err) {
                console.log('******** edit ,Error!'+err); //debug
                res.send(err)
            }

            Message.update(
                {"_id": req.body._id},
                {
                    user  : req.body.user,
                    title : req.body.title,
                    contents : req.body.contents,
                    reg_date : one_guest_msg.reg_date, //기존값 그대로 !!
                    hits : one_guest_msg.hits //기존값 그대로 !!
                },
                function(err, data) {
                    if (err) {
                        console.log('******** update msg ,Error!'+err); //debug
                        res.send(err)
                    }
                    res.end(); //필요하다.
                });
        });
});


module.exports = messageRouter;