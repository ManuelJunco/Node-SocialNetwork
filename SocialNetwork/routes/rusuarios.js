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


    /* Disconnect the user */
    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.redirect("/identificarse");
    })


    /* Receive the post req from login html */
    app.post("/identificarse", function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email: req.body.email,
            password: seguro
        }
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto" +
                    "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                res.redirect("/usuario");
            }
        });
    });


    /* Receive the post req from signup html */
    app.post("/registrarse", function (req, res) {
        /*First . Check password*/
        if (req.body.password != req.body.confirmPassword) {
            res.redirect("/registrarse?mensaje=La password y su confirmación deben ser iguales&tipoMensaje=alert-danger");
        } else {
            var re = /\S+@\S+/;
            /* Second - Check email */
            if (!re.test(req.body.email)) {
                res.redirect("/registrarse?El email no es válido&tipoMensaje=alert-danger");
            } else {
                /* Third - Check password */
                if (req.body.password.length < 7) {
                    res.redirect("/registrarse?mensaje=Password demasiado corta, minimo 7 caracteres&tipoMensaje=alert-danger");
                } else {
                    /* Fourth - Check the name */
                    if (req.body.nombre < 3) {
                        res.redirect("/registrarse?mensaje=El nombre es demasiado corto, minimo 3 caracteres&tipoMensaje=alert-danger");
                    } else {
                        var criterio = {
                            email: req.body.email
                        };
                        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                            if (usuarios == null) {
                                res.redirect("/registrarse?mensaje=Error al registrar al usuario&tipoMensaje=alert-danger");
                            } else {
                                /* Fifth - Check email */
                                if (usuarios[0] != null) {
                                    res.redirect("/registrarse?mensaje=El email ya existe&tipoMensaje=alert-danger");
                                } else {
                                    /* Adding user */
                                    var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                                        .update(req.body.password).digest('hex');
                                    var usuario = {
                                        email: req.body.email,
                                        password: seguro,
                                        nombre: req.body.nombre
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
        }
    });


    /* Shows the home page with the user list - Includes pagination */
    app.get("/usuario", function (req, res) {
        var criterio = {};

        if (req.query.busqueda != null) {
            var search = { $regex: ".*" + req.query.busqueda + ".*" };
            criterio = {$or : [ {"nombre": search }, {"email" : search } ]};
        }
        var pg = parseInt(req.query.pg);
        if (req.query.pg == null) {
            pg = 1;
        }
        gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
            if (usuarios == null) {
                res.send("Error al listar "); /* ¿A DÓNDE DEBERÍA REDIRIGIR? */
            } else {
                if(total > usuarios.length) {
                    var pgUltima = total / 5;
                    if (total % 5 > 0) {
                        pgUltima = pgUltima + 1;
                    }
                } else {
                    pgUltima = 1;
                }
                var respuesta = swig.renderFile('views/home.html',
                    {
                        usuarios: usuarios,
                        pgActual: pg,
                        pgUltima: pgUltima
                    });
                res.send(respuesta);
            }
        });
    });
};