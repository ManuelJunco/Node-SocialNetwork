module.exports = function (app, gestorBD) {


    /* Authenticate users */
    app.post("/api/autenticar/", function (req, res) {
        if (req.body.password != null) {
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            var criterio = {
                email: req.body.email,
                password: seguro
            }
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null || usuarios.length == 0) {
                    /* User isn't authorized*/
                    res.status(401);
                    res.json({
                        autenticado: false
                    })
                } else {
                    /* Include token */
                    var token = app.get('jwt').sign(
                        {
                            usuario: criterio.email,
                            tiempo: Date.now() / 1000
                        }, "secreto");
                    /* OK */
                    res.status(200);
                    res.json({
                        autenticado: true,
                        token: token
                    });
                }
            });
        } else {
            /* Bad request */
            res.status(400);
            res.json({
                error: "Parametros incorrectos"
            })
        }
    });


    /* Obtain the user's friends */
    app.get("/api/usuario/amigo", function (req, res) {
        var criterio = {
            $or: [{origen: res.usuario, aceptada: true},
                {destino: res.usuario, aceptada: true}]
        }
        gestorBD.obtenerAmigos(res.usuario, criterio, function (amigos) {
            if (amigos == null) {
                /* Internal server Error */
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                /* OK */
                res.status(200);
                for (var i in amigos) {
                    delete amigos[i]["nombre"];
                    delete amigos[i]["email"];
                    delete amigos[i]["password"];
                }
                res.send(JSON.stringify(amigos));
            }
        });
    });


    /* Create a message */
    app.post("/api/mensaje/", function (req, res) {
        /* Check if they are friends */
        var criterio = {
            $or: [{origen: res.usuario, destino: req.body.receptor, aceptada: true},
                {origen: req.body.receptor, destino: res.usuario, aceptada: true}]
        };
        gestorBD.obtenerAmigos(res.usuario, criterio, function (amigos) {
            if (amigos == null) {
                /* Internal server Error */
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                if (amigos.length == 0) {
                    /* Bad request */
                    res.status(400);
                    res.json({
                        error: "los usuarios no son amigos"
                    })
                } else {
                    var mensaje = {
                        emisor: res.usuario,
                        receptor: req.body.receptor,
                        texto: req.body.texto,
                        leido: false
                    };
                    gestorBD.insertarMensaje(mensaje, function (id) {
                        if (id == null) {
                            /* Internal server Error */
                            res.status(500);
                            res.json({
                                error: "se ha producido un error"
                            })
                        } else {
                            /* Created */
                            res.status(201);
                            res.json({
                                mensaje: "mensaje insertado",
                                _id: id
                            })
                        }
                    });
                }
            }
        });
    });


    /* Obtain the user's message  */
    app.get("/api/mensaje/:id_user1/:id_user2", function (req, res) {
        /* Obtain the _id of the user authenticated */
        var criterio = {
            $or: [{_id: gestorBD.mongo.ObjectID(req.params.id_user1)},
                {_id: gestorBD.mongo.ObjectID(req.params.id_user2)}]
        }
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null) {
                /* Internal server Error */
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                /* Check if appears in one params */
                if(usuarios.length == 2) {
                    if (res.usuario == usuarios[0].email || res.usuario == usuarios[1].email) {
                        criterio = {
                            $or: [{emisor: usuarios[0].email, receptor: usuarios[1].email},
                                {emisor: usuarios[1].email, receptor: usuarios[0].email}]
                        }
                        gestorBD.obtenerMensajes(criterio, function (mensajes) {
                            if (mensajes == null) {
                                /* Internal server Error */
                                res.status(500);
                                res.json({
                                    error: "se ha producido un error"
                                })
                            } else {
                                /* OK */
                                res.status(200);
                                res.send(JSON.stringify(mensajes));
                            }
                        });
                    } else {
                        /* Bad request */
                        res.status(400);
                        res.json({
                            error: "el emisor o el receptor debe ser el usuario autenticado"
                        })
                    }
                } else {
                    /* Internal server Error */
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                }
            }
        });
    });


    /* Change one attribute of message */
    app.put("/api/mensaje/:id/", function (req, res) {
        /* Find the message */
        var criterio = {
            _id: gestorBD.mongo.ObjectID(req.params.id)
        }
        gestorBD.obtenerMensajes(criterio, function (mensajes) {
            if (mensajes == null) {
                /* Internal server Error */
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                /* Verify that the user is a sender */
                if(mensajes[0].receptor == res.usuario){
                    var mensaje = {
                        leido : true
                    }
                    gestorBD.modificarMensaje(criterio, mensaje, function (result) {
                        if (result == null) {
                            res.status(500);
                            res.json({
                                error: "se ha producido un error"
                            })
                        } else {
                            res.status(200);
                            res.json({
                                mensaje: "mensaje modificado",
                                _id: req.params.id
                            })
                        }
                    });
                }
            }
        });
    });
}