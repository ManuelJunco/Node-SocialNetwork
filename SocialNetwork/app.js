
/*-------------------------------------- FRAMEWORK DECLARATION -----------------------------------------------*/
var express = require('express');
var app = express();



/*---------------------------------- GLOBAL VARIABLES - MODULES - ROUTES -------------------------------------*/
/*** express-session installed ***/
var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

/*** not installed - included in core ***/
var crypto = require('crypto');
/*** swig installed ***/
var swig = require('swig');
/*** mongo 2.2.33 installed ***/
var mongo = require('mongodb');
/*** body-parser installed ***/
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

/*** session route - important ***/
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    console.log("routerUsuarioSession");
    if ( req.session.usuario ) {
        next();
    } else {
        console.log("va a : " + req.session.destino)
        res.redirect("/identificarse");
    }
});
app.use("/usuario",routerUsuarioSession);
app.use("/amigo",routerUsuarioSession);



/*---------------------------------- GLOBAL VARIABLES - APP && OTHERS ----------------------------------------*/
app.use(express.static('public'));
app.set('db','mongodb://admin:SocialNetworkAdmin@ds111370.mlab.com:11370/socialnetwork');
app.set('clave','abcdefg');
app.set('crypto',crypto);



/*----------------------------------------- CONTROLLERS ------------------------------------------------------*/
require("./routes/rusuarios.js")(app, swig, gestorBD);



/*------------------------------------- FIRST CONNECTION REDIRECT --------------------------------------------*/
app.get('/', function (req, res) {
    res.redirect('/identificarse');
});



/*---------------------------------- MESSAGES AND PORT -------------------------------------------------------*/
app.listen(8081, function(){
	console.log("Servidor activo");
});