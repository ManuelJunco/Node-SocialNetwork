module.exports = function(app, swig, gestorBD) {

	/* Return the login html */
	app.get("/identificarse", function(req, res) {
		var respuesta = swig.renderFile('views/login.html', {});
		res.send(respuesta);
	});

	/* Return the signup html */
	app.get("/registrarse", function(req, res) {
		var respuesta = swig.renderFile('views/signup.html', {});
		res.send(respuesta);
	});

	/* Disconnect the user */
	app.get('/desconectarse', function(req, res) {
		req.session.usuario = null;
		res.redirect("/identificarse");
	})

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
				res.redirect("/identificarse"
						+ "?mensaje=Email o password incorrecto"
						+ "&tipoMensaje=alert-danger ");
			} else {
				req.session.usuario = usuarios[0].email;
				res.redirect("/usuario");
			}
		});
	});

    /* Receive the post req from signup html */
    app.post("/registrarse", function (req, res) {
        /*First - Check password*/
        if (req.body.password != req.body.confirmPassword) {
            res.redirect("/registrarse?mensaje=La password y su confirmación deben ser iguales&tipoMensaje"
                + "=alert-danger");
        } else {
            var re = /\S+@\S+/;
            /* Second - Check email */
            if (!re.test(req.body.email)) {
                res.redirect("/registrarse?El email no es válido&tipoMensaje=alert-danger");
            } else {
                /* Third - Check password */
                if (req.body.password.length < 7) {
                    res.redirect("/registrarse?mensaje=Password demasiado corta, minimo 7 caracteres&tipoMensaje"
                        + "=alert-danger");
                } else {
                    /* Fourth - Check the name */
                    if (req.body.nombre.length < 3) {
                        res.redirect("/registrarse?mensaje=El nombre es demasiado corto, minimo 3 caracteres&"
                            + "tipoMensaje=alert-danger");
                    } else {
                        var criterio = {
                            email: req.body.email
                        };
                        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                            if (usuarios == null) {
                                res.redirect("/registrarse?mensaje=Error al registrar al usuario&tipoMensaje="
                                    + "alert-danger");
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
                                            res.redirect("/registrarse?mensaje=Error al registrar usuario&tipoMensaje"
                                                + "=alert-danger");
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
        var criterioCount = {};
        if (req.query.busqueda != null) {
            var expReg = {$regex: ".*" + req.query.busqueda + ".*"};
            criterio = {$or: [{nombre: expReg}, {email: expReg}]};
            criterioCount = criterio;
        }
        var pg = parseInt(req.query.pg);
        if (req.query.pg == null) {
            pg = 1;
        }
        gestorBD.obtenerUsuariosPg(criterioCount, criterio, pg, function (usuarios, total) {
            if (usuarios == null) {
                res.redirect("/identificarse?mensaje=Error al obtener la lista de usuarios, intente iniciar " +
                    "sesión otra vez&tipoMensaje"
                    + "=alert-danger");
            } else {
                var pgUltima = total / 5;
                if (total % 5 > 0) {
                    pgUltima = pgUltima + 1;
                }
                var respuesta = swig.renderFile('views/home.html',
                    {
                        usuarios: usuarios,
                        pgActual: pg,
                        pgUltima: pgUltima,
                        search: req.query.busqueda,
                        me: req.session.usuario
                    });
                res.send(respuesta);
            }
        });
    });


    /* A user sends a friend request to another */
    app.post("/peticion/:email", function (req, res) {
        /* Check if the target is already on peticiones */
        var criterio = {
            $or: [{origen: req.session.usuario, destino: req.params.email},
                {destino: req.session.usuario, origen: req.params.email}]
        };
        gestorBD.obtenerPeticiones(criterio, function (peticiones) {
            if (peticiones == null) {
                res.redirect("/usuario?mensaje=Error al enviar la petición&tipoMensaje=alert-danger");
            } else {
                if (peticiones[0] != null) {
                    if (peticiones[0] == true) {
                        res.redirect("/usuario?mensaje=Este usuario ya es tu amigo&"
                            + "tipoMensaje=alert-danger");
                    } else {
                        res.redirect("/usuario?mensaje=Esta petición ya ha sido enviada o quizás deberías" +
                            " ver tu lista de peticiones recibidas&"
                            + "tipoMensaje=alert-danger");
                    }
                } else {
                    var peticion = {
                        origen: req.session.usuario,
                        destino: req.params.email,
                        aceptada: false
                    };
                    gestorBD.insertarPeticion(peticion, function (id) {
                        if (id == null) {
                            res.redirect("/usuario?mensaje=No ha sido posible enviar la petición" +
                                "correctamente&tipoMensaje=alert-danger");
                        } else {
                            res.redirect("/usuario?mensaje=Petición enviada con éxito");
                        }
                    });
                }
            }
        });
    });


    /* Show the friends of connected user - Includes pagination */
    app.get("/amigo", function (req, res) {
        /* IMPORTANT: Search in peticiones collection */
        var criterio = {
            $or: [{origen: req.session.usuario, aceptada: true},
                {destino: req.session.usuario, aceptada: true}]
        };
        var pg = parseInt(req.query.pg);
        if (req.query.pg == null) {
            pg = 1;
        }
        gestorBD.obtenerAmigosPg(req.session.usuario, criterio, pg, function (amigos, total) {
            if (amigos == null) {
                res.redirect("/usuario?mensaje=Error al obtener la lista de amigos&tipoMensaje=alert-danger");
            } else {
                var pgUltima = total / 5;
                if (total % 5 > 0) {
                    pgUltima = pgUltima + 1;
                }
                var respuesta = swig.renderFile('views/friends.html',
                    {
                        amigos: amigos,
                        pgActual: pg,
                        pgUltima: pgUltima,
                    });
                res.send(respuesta);
            }
        });
    });
    
    /* Shows the invitation page with the invitations list - Includes pagination */
	app.get("/invitaciones", function(req, res) {
		var criterio = {
			$or : [ {
				destino : req.session.usuario,
				aceptada : false
			} ]
		};
		var pg = parseInt(req.query.pg);
		if (req.query.pg == null) {
			pg = 1;
		}
		gestorBD.obtenerAmigosPg(req.session.usuario, criterio, pg, function(
				peticiones, total) {
			if (peticiones == null) {
				res.send("Error al buscar peticiones ");
				/* ¿A DÓNDE DEBERÍA REDIRIGIR? */
			} else {
				var pgUltima = total / 5;
				if (total % 5 > 0) {
					pgUltima = pgUltima + 1;
				}
				var respuesta = swig.renderFile('views/invitationList.html', {
					peticiones : peticiones,
					pgActual : pg,
					pgUltima : pgUltima,
				});
				res.send(respuesta);
			}
		});
	});

    
	/* A user sends a friend request to another */
	app.post("/peticion/aceptar/:email", function(req, res) {
		/* Check if the target is already on peticiones */
		var criterio = {
			$or : [ {
				origen : req.session.usuario,
				destino : req.params.email
			}, {
				destino : req.session.usuario,
				origen : req.params.email
			} ]
		};
		gestorBD.obtenerPeticiones(criterio, function(peticiones) {
			if (peticiones == null) {
				res.send("Error al enviar petición ");
				/* ¿A DÓNDE DEBERÍA REDIRIGIR? */
			} else {
				/* gestorBD.aceptarPeticion(p) */
			}
		});
	});

};