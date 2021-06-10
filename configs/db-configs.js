module.exports.dbConfigSettings = {
  db_names: {
    camunda_db: 'camunda_db',
    searchstoreservice: 'searchstoreservice',
    application: 'application',
    clientservice: 'clientservice',
    autotestservice: 'autotestservice',
    cctestservice: 'cctestservice',
    testservice: 'testservice',
    statusviewservice: 'statusviewservice',
    mtestservice: 'mtestservice',
    mrealestateservice: 'mrealestateservice',
  },
  db_rep_ip_addresses: {
    common_rep_ip_address: '11.111.11.11',
    camunda_db_rep_ip_address: '11.111.11.12',
  },
  db_connection_settings: {
    db_default_connect_port: 1000,
    db_max_pool: 10,
    db_min_pool: 0,
    idle_timeout_millis: 300000,
    connection_timeout_millis: 30000,
  },
};
