/* FRAMEWORK DECLARATION */
var express = require('express');
var app = express();

/* GLOBAL VARIABLES  - MODULES */
var expressSession = require('express-session'); /* express-session installed */
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));
var crypto = require('crypto'); /* not installed - included in core */
var swig = require('swig'); /* swig installed */
var mongo = require('mongodb'); /* mongo 2.2.33 installed */
var bodyParser = require('body-parser'); /* body-parser installed */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

/* GLOBAL VARIABLES - APP && OTHERS */
app.use(express.static('public'));
app.set('db','mongodb://admin:SocialNetworkAdmin@ds111370.mlab.com:11370/socialnetwork');
app.set('clave','abcdefg');
app.set('crypto',crypto);

/* CONTROLLERS*/
require("./routes/rusuarios.js")(app, swig, gestorBD);

/* FIRST CONNECTION REDIRECT */
app.get('/', function (req, res) {
    res.redirect('/identificarse');
});

/* MESSAGES AND PORT */
app.listen(8081, function(){
	console.log("Servidor activo");
});