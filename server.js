'use strict';

process.env.DEBUG = 'actions-on-google:*';

var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    bodyParser = require('body-parser'),
    express = require('express');


var app = express();

var port=8082;

app.use(express.static('public'));
app.use(bodyParser.json());


app.get('/',function(req,res){
        res.send('Damn express!');
        console.log('received get');
});

var letsencryptRoute='/.well-known/acme-challenge/h68iaMbkBhdCVdwzfbzgeibwVhdpPV9qe5eW02RCyNU';
var letsencryptContent='h68iaMbkBhdCVdwzfbzgeibwVhdpPV9qe5eW02RCyNU.ykizh7rYCzrRzmhhgfe_eXdIxGPhBhn8UqDUDoMAXqI';
app.get(letsencryptRoute,function(req,res){
	console.log("Let's encrypt!");
	res.send(letsencryptContent);
});

const redWords = [
	'all','as','are','at',
	'but','for',
	'had','have','he','her','his',
	'not','on','one','said','so',
	'they','we','with','you'
	];

var chosenWord='';
var gameRedWordsQuestion =  function () {

	chosenWord=redWords[Math.floor(Math.random()*redWords.length)];

    console.log('chose word ' ,chosenWord);
	return {
		speech:'Read this word',
		displayText:chosenWord 
	}	
}

var gameRedWordsAnswer = function (body) {
	
	var speech = body.result.parameters.word;

	// console.log('user said ',speech);

	if ( speech == chosenWord ) {
		var praise = 'Very good!';
	}else {
		var praise = 'Oh no! The word was ' + '<break time="1s"/>'+ chosenWord +'<break time="1s"/>' + '. Maybe next time!';
	}

	const nextWordResponse = gameRedWordsQuestion();

	// https://www.w3.org/TR/speech-synthesis/
	const pause = '<break time="2s"/>';

	var responseSpeech = '<speak><p>' + praise  + '</p><p>';
    responseSpeech +=  pause + nextWordResponse.speech + '</p></speak>';

    nextWordResponse.speech = responseSpeech;
    return nextWordResponse;

};

var ssmlTest = function(body) {
	return {
		// speech: '<speak>        Here are <say-as interpret-as="characters">SSML</say-as> samples.                I can pause <break time="3s"/>.    </speak>'
		speech: '<speak><break time="3s"/></speak>'
	}
}

app.get('/action',function(req,res){
	res.send('get action');
});

app.post('/action',function(req,res){
	
	var action = req.body.result.action;
	console.log('action', action);

	if ( action == "game.words.red.question" ) {
		var response = gameRedWordsQuestion();
	} else if ( action == "game.words.red.answer" ) {
        var response = gameRedWordsAnswer(req.body);
    } else if ( action == 'test') {
		var response = ssmlTest();
	} else {	
		var response = {
			speech: 'hello actions' 
		};
	}
	res.send(response);
});

var sslFolder='/etc/letsencrypt/live/magicwords.amazingdomain.net/';
if (fs.existsSync(sslFolder)) {

	console.log('Found SSL keys');
    var options = {
        key: fs.readFileSync(sslFolder + 'privkey.pem'),
        cert: fs.readFileSync(sslFolder + 'cert.pem'),
        ca: fs.readFileSync(sslFolder + 'chain.pem'),
        port: 443,
        path: '/'
    };
} else {
	var options = {};
}

var server = app.listen(port,function() {
        var host = server.address().address
        var port = server.address().port

        console.log("Express is live on port %s",port);
})
