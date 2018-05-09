module.exports = function (app, swig, gestorBD) {
    /* Shows the invitation page with the invitations list - Includes pagination */
    app.get("/invitaciones", function (req, res) {
        var criterio = {};
        var criterioCount = {};
        if (req.query.busqueda != null) {
            var expReg = {$regex: ".*" + req.query.busqueda + ".*"};
            criterio = {$or: [{"nombre": expReg}, {"email": expReg}]};
            criterioCount = criterio;
        }
        var pg = parseInt(req.query.pg);
        if (req.query.pg == null) {
            pg = 1;
        }
        gestorBD.obtenerInvitacionesPg(criterioCount, criterio, pg, function (invitaciones, total) {
            if (usuarios == null) {
                res.send("Error al listar ");
                /* ¿A DÓNDE DEBERÍA REDIRIGIR? */
            } else {
                var pgUltima = total / 5;
                if (total % 5 > 0) {
                    pgUltima = pgUltima + 1;
                }
                var respuesta = swig.renderFile('views/invitationList.html',
                    {
                        invitaciones: invitaciones,
                        pgActual: pg,
                        pgUltima: pgUltima,
                        search: req.query.busqueda
                    });
                res.send(respuesta);
            }
        });
    });
};