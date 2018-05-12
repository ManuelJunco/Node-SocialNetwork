module.exports = function (app, gestorBD) {


    /* Authenticate users */
    app.post("/api/autenticar/", function (req, res) {
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
    });


    /* Obtain the user's friends */
    app.get("/api/usuario/mis-amigos", function (req, res) {
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


    /* Obtain all the message from authenticated user to other user */
    app.post("/api/mensaje/", function (req, res) {
        /* Check if they are friends */
        var criterio = {
            $or: [{origen:  res.usuario, destino: req.body.receptor, aceptada: true},
                {origen: req.body.receptor, destino:  res.usuario, aceptada: true}]
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
}