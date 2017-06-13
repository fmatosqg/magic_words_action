
var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express');

var app = express();

var port=8082;

app.use(express.static('public'));

app.get('/',function(req,res){
        res.send('Damn express!')
});

var letsencryptRoute='/.well-known/acme-challenge/h68iaMbkBhdCVdwzfbzgeibwVhdpPV9qe5eW02RCyNU';
var letsencryptContent='h68iaMbkBhdCVdwzfbzgeibwVhdpPV9qe5eW02RCyNU.ykizh7rYCzrRzmhhgfe_eXdIxGPhBhn8UqDUDoMAXqI';
app.get(letsencryptRoute,function(req,res){
	console.log("Let's encrypt!");
	res.send(letsencryptContent);
});

app.post('/action',function(req,res){
	console.log('action');
	var response = {
		speech: 'hello actions' 
	};
	res.send(response);
});

var sslFolder='/etc/letsencrypt/live/magicwords.amazingdomain.net/';
var options = {
    key: fs.readFileSync(sslFolder + 'privkey.pem'),
    cert: fs.readFileSync(sslFolder + 'cert.pem'),
    ca: fs.readFileSync(sslFolder + 'chain.pem'),
    port: 443,
	path:'/'
};

var server = app.listen(port,function() {
        var host = server.address().address
        var port = server.address().port

        console.log("Express is live on port %s",port);
})
