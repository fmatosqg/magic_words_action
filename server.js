var express = require('express');

var app = express();

var port=8082;

app.use(express.static('public'));

app.get('/',function(req,res){
        res.send('Damn express!')
});

var server = app.listen(port,function() {
        var host = server.address().address
        var port = server.address().port

        console.log("Express is live on port %s",port);
})