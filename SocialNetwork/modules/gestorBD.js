module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    insertarMensaje: function (mensaje, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('mensajes');
                collection.insert(mensaje, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerAmigos: function (me, criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('peticiones');
                collection.find(criterio).toArray(function (err, peticiones) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        var aux = [peticiones.length];
                        for (var i in peticiones) {
                            if (me != peticiones[i].origen) {
                                aux[i] = peticiones[i].origen;
                            } else {
                                aux[i] = peticiones[i].destino;
                            }
                        }
                        var criterio2 = {
                            email: {$in: aux}
                        }
                        var collection2 = db.collection('usuarios');
                        collection2.find(criterio2).toArray(function (err, usuarios) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(usuarios);
                            }
                            db.close();
                        });

                    }
                });
            }
        });
    },
    obtenerAmigosPg: function (me, criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('peticiones');
                collection.find(criterio).toArray(function (err, peticiones) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        var aux = [peticiones.length];
                        for (var i in peticiones) {
                            if (me != peticiones[i].origen) {
                                aux[i] = peticiones[i].origen;
                            } else {
                                aux[i] = peticiones[i].destino;
                            }
                        }
                        var criterio2 = {
                            email: {$in: aux}
                        }
                        var collection2 = db.collection('usuarios');
                        collection2.count(criterio2, function (err, count) {
                            collection2.find(criterio2).skip((pg - 1) * 5).limit(5).toArray(function (err, usuarios) {
                                if (err) {
                                    funcionCallback(null);
                                } else {
                                    funcionCallback(usuarios, count);
                                }
                                db.close();
                            });
                        });
                    }
                });
            }
        });
    },
    obtenerPeticiones: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('peticiones');
                collection.find(criterio).toArray(function (err, peticiones) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(peticiones);
                    }
                    db.close();
                });
            }
        });
    },
    insertarPeticion: function (peticion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('peticiones');
                collection.insert(peticion, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerUsuariosPg: function (criterioCount, criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.count(criterioCount, function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
                        .toArray(function (err, usuarios) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(usuarios, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    obtenerUsuarios: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.find(criterio).toArray(function (err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },
    insertarUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.insert(usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
	obtenerInvitacionesPg : function(criterioCount, criterio, pg,
			funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('invitaciones');
				collection.count(criterioCount, function(err, count) {
					collection.find(criterio).skip((pg - 1) * 5).limit(5)
							.toArray(function(err, invitaciones) {
								if (err) {
									funcionCallback(null);
								} else {
									funcionCallback(invitaciones, count);
								}
								db.close();
							});
				});
			}
		});
	}
};