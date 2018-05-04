module.exports = function (app, swig, gestorBD) {



    /* Return the login html */
    app.get("/identificarse", function (req, res) {
        var respuesta = swig.renderFile('views/login.html', {});
        res.send(respuesta);
    });


    
    /* Return the signup html */
    app.get("/registrarse", function (req, res) {
        var respuesta = swig.renderFile('views/signup.html', {});
        res.send(respuesta);
    });
    
    
    
    /* Receive the post req from login html */
    app.post("/identificarse", function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email : req.body.email,
            password : seguro
        }
        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto"+
                    "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                res.send("Listar todos los usuarios de la aplicacion"); 
            }
        });
    });


    
    /* Receive the post req from signup html */
    app.post("/usuario", function (req, res) {
        /*First . Check if password == confirmPassword*/
        if (req.body.password != req.body.confirmPassword) {
            res.redirect("/registrarse?mensaje=La password y su confirmación deben ser iguales&tipoMensaje=alert-danger");
        } else {
            var re = /\S+@\S+/;
            /* Second - validate email */
            if (!re.test(req.body.email)) {
                res.redirect("/registrarse?El email no es válido&tipoMensaje=alert-danger");
            } else {
                /* Third - Check length */
                if (req.body.password.length < 7) {
                    res.redirect("/registrarse?mensaje=Password demasiado corta&tipoMensaje=alert-danger");
                } else {
                    /* Fourth - Check if already exists */
                    var criterio = {
                        email: req.body.email
                    };
                    gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                        if (usuarios == null) {
                            res.redirect("/registrarse?mensaje=Error al registrar al usuario&tipoMensaje=alert-danger");
                        } else {
                            if (usuarios[0].email == req.body.email) {                            	
                                res.redirect("/registrarse?mensaje=El email ya existe&tipoMensaje=alert-danger");
                            } else {
                                /* Adding user */
                                var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                                    .update(req.body.password).digest('hex');
                                var usuario = {
                                    email: req.body.email,
                                    password: seguro
                                };
                                gestorBD.insertarUsuario(usuario, function (id) {
                                    if (id == null) {
                                        res.redirect("/registrarse?mensaje=Error al registrar usuario&tipoMensaje=alert-danger");
                                    } else {
                                        res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });

};