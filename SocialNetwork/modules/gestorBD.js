module.exports = {
	mongo : null,
	app : null,
	init : function(app, mongo) {
		this.mongo = mongo;
		this.app = app;
	},
	obtenerUsuariosPg : function(criterioCount, criterio, pg, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.count(criterioCount, function(err, count) {
					collection.find(criterio).skip((pg - 1) * 5).limit(5)
							.toArray(function(err, usuarios) {
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
	obtenerUsuarios : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.find(criterio).toArray(function(err, usuarios) {
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
	insertarUsuario : function(usuario, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.insert(usuario, function(err, result) {
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
	obtenerInvitaciones : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('invitaciones');
				collection.find(criterio).toArray(function(err, invitaciones) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(invitaciones);
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