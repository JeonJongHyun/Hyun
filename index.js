/**
 * Created by hyun4513 on 2015-06-18.
 */

var express = require('express'),
    path = require('path'),
    morgan   = require('morgan'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    routes   = require('./routes/route'),
    messageRoutes   = require('./routes/messageRoute');





var app = express();
//PORT 설정
app.set('port', process.env.PORT || 8081);
//__dirname 절대경로의 root 를 설정
app.set('views', __dirname + '/app');
//log 출력
app.use(morgan('dev'));

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(favicon(__dirname + '/app/favicon.ico'));
//static() 정적 파일 처리 index 파일을 찾아 뷰한다
app.use(express.static(path.join(__dirname, 'app')));




app.use('/apis', messageRoutes);
app.post('/auth/login', routes.loginCheck);
app.post('/auth/signup', routes.signup);
app.post('/user/message', routes.contents);
app.post('/game/insert', routes.games);
app.get('/game/ranking', routes.ranking);

app.get('*', function(req, res, next) {
    res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({ message: err.message });
});

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
})
