/**
 * Created by hyun4513 on 2015-06-23.
 */
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var tokenSecret = 'your unique secret';


var peopleSchema = new mongoose.Schema({

    name: { type: String, trim: true, required: true },
    tel: { type: String, unique: true, trim: true },
    gubun: String,
    attr1: String,
    attri2: String
});

var noteSchema = new mongoose.Schema({
    _id: Number,
    tel: { type: String, unique: true, trim: true },
    contents: String
});

var gameSchema = new mongoose.Schema({

    tel: { type: String, unique: true, trim: true },
    name: String,
    moves: Number
});

var People = mongoose.model('people', peopleSchema);
var Note = mongoose.model('note', noteSchema);
var Game = mongoose.model('game', gameSchema);
mongoose.connect('mongodb://hyun4513.iptime.org:27017/userDB');



/*  collections 확인
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {


    People.find(function (err, data) {
        if (err) return console.error(err);
        console.log(data);
    })
});
 */

exports.loginCheck = function (req, res, next) {
      People.findOne({tel:req.body.tel}, function(err, user) {
          if (!user) return res.status(401).send('User does not exist');
          var token = createJwtToken(user);
          res.send({ token: token });

      });

  };

exports.signup = function (req, res, next) {
    People.findOne({tel:req.body.tel}, function(err, user) {
        if (user) return res.status(401).send('User exist');


     var people = new People({
         name: req.body.name,
         tel: req.body.tel,
         gubun: "etc",
         attr1: "",
         attri2 : ""
       });
       people.save(function(err) {
         if (err) return next(err);
         res.send(200);
       });

    });

};

function createJwtToken(user) {

    var payload = {
        user: user,
        iat: new Date().getTime(),
        exp: moment().add(7,'days').valueOf()
    };
    //return jwt.encode( unescape(encodeURIComponent(payload, tokenSecret) );
    return jwt.encode( payload, tokenSecret );
}

exports.contents = function (req, res, next) {
    Note.findOne({tel:req.body.tel}, function(err, data) {
        if (!data) return res.send({ tel: '000000', message: '저희 결혼을 축하해 주셔서 감사드립니다.' } );
        console.log(data)
         res.send(data);

    });

};

exports.games = function (req, res, next) {

    Game.findOne({tel:req.body.tel}, function(err, user) {
        //console.log("user======"+user);
        if (user) {
            if(user.moves > req.body.moves){
                Game.update( {tel:req.body.tel}, {$set: { moves: req.body.moves }},
                            function(err, game) {
                                if (err) {
                                    console.log('******** update ,Error!'+err); //debug
                                    res.send(err)
                                }
                                res.status(200).send('기록을 갱신 하였습니다.ㅋㅋㅋ');
                            });
            }else{
                res.status(200).send('기록을 갱신 하지 못하였습니다.ㅋㅋㅋ');
            }


        }else{

             var game = new Game({
                 name: req.body.name,
                 tel: req.body.tel,
                 moves: req.body.moves
               });
               game.save(function(err) {
                 if (err) return next(err);
                 res.status(200).send('기록을 등록 하였습니다.ㅋㅋㅋ');
               });

        }
    });

};



exports.ranking = function (req, res, next) {

        Game.find(function(err, page_msgs) {
            if (err) {
                console.log('******** list page error ************22'); //debug
                res.send(err)
            }
            res.json(page_msgs);
        })
        .sort({moves:-1})
        .limit(5);
};



