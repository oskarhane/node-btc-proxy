/*
Copyright © 2013 Oskar Hane <dev@oskarhane.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

var fs = require('fs');
var https = require('https');
var http = require('http');
var express = require('express');

var settings = JSON.parse(fs.readFileSync('settings.json'));

var privateKey  = fs.readFileSync(settings.node_ssl_key_name).toString();
var certificate = fs.readFileSync(settings.node_ssl_cert_name).toString();

var credentials = {key: privateKey, cert: certificate};
var server = express();

server.post('/', function(request, response)
{	
	var proxy_request = http.request({host: settings.RPC.host, port: settings.RPC.port, method: request.method, headers: request.headers}, function(res)
	{
		res.on('data', function(chunk)
		{
			response.write(chunk, 'binary');
		});
		
		res.on('end', function(chunk)
		{
			response.end();
		});
		response.writeHead(res.statusCode, res.headers);
	});
	
	request.addListener('data', function(chunk) {
		proxy_request.write(chunk, 'binary');
	});
	request.addListener('end', function() {
		proxy_request.end();
	});
});

var auth = express.basicAuth(function(user, pass) 
{     
   return (user == settings.RPC.user && pass == settings.RPC.password) ? true : false;
},'Node BTC Proxy');

server.configure(function()
{
	server.use(auth);
	server.use(server.router);
});

var https_server = https.createServer(credentials, server);
https_server.listen(settings.node_port, settings.node_host);
