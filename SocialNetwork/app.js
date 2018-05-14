
/*-------------------------------------- FRAMEWORK DECLARATION -----------------------------------------------*/
var express = require('express');
var app = express();

app.use(function(req, res, next) {
	 res.header("Access-Control-Allow-Origin", "*");
	 res.header("Access-Control-Allow-Credentials", "true");
	 res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
	 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
	 // Debemos especificar todas las headers que se aceptan. Content-Type , token
	 next();
});



/*---------------------------------- GLOBAL VARIABLES - MODULES - ROUTES -------------------------------------*/
/*** jsonwebtoken installed ***/
var jwt = require('jsonwebtoken');
app.set('jwt',jwt);

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

/*** token route - important ***/
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
    /*** we need the token, it can be included in POST, GET or HEADERS ***/
    var token = req.body.token || req.query.token || req.headers['token'];
    if (token != null) {
        jwt.verify(token, 'secreto', function(err, infoToken) {
            if (err || (Date.now()/1000 - infoToken.tiempo) > 2400 ){ /* SOLO DURANTE LA FASE DE PRUEBAS*/
                /*** Forbidden ***/
                res.status(403);
                res.json({
                    acceso : false,
                    error: 'Token invalido o caducado'
                });
                return;
            } else {
                res.usuario = infoToken.usuario;
                next();
            }
        });
    } else {
        /*** Forbiden ***/
        res.status(403);
        res.json({
            acceso : false,
            mensaje: 'No hay Token'
        });
    }
});

/*** applying token route ***/
app.use('/api/usuario', routerUsuarioToken);
app.use('/api/mensaje',routerUsuarioToken);

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

/*** applying session route ***/
app.use("/usuario",routerUsuarioSession);
app.use("/amigo",routerUsuarioSession);
app.use("/peticion",routerUsuarioSession);
app.use("/invitaciones",routerUsuarioSession);


/*---------------------------------- GLOBAL VARIABLES - APP && OTHERS ----------------------------------------*/
app.use(express.static('public'));
app.set('db','mongodb://admin:SocialNetworkAdmin@ds111370.mlab.com:11370/socialnetwork');
app.set('clave','abcdefg');
app.set('crypto',crypto);



/*----------------------------------------- CONTROLLERS ------------------------------------------------------*/
require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rapisocialnetwork.js")(app, gestorBD);



/*------------------------------------- FIRST CONNECTION REDIRECT --------------------------------------------*/
app.get('/', function (req, res) {
    res.redirect('/identificarse');
});



/*---------------------------------- MESSAGES AND PORT -------------------------------------------------------*/
app.listen(8081, function(){
	console.log("Servidor activo");
});