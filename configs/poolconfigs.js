const { currentDBUserData } = require('../environment/auth-data');
const { dbConfigSettings } = require('./db-configs');

module.exports.dbConfigObject = {
  configCamunda: {
    user: currentDBUserData.userName,
    host: dbConfigSettings.db_rep_ip_addresses.camunda_db_rep_ip_address,
    database: dbConfigSettings.db_names.camunda_db,
    password: currentDBUserData.password,
    port: dbConfigSettings.db_connection_settings.db_default_connect_port,
    max: dbConfigSettings.db_connection_settings.db_max_pool,
    min: dbConfigSettings.db_connection_settings.db_min_pool,
    idleTimeoutMillis: dbConfigSettings.db_connection_settings.idle_timeout_millis,
    connectionTimeoutMillis: dbConfigSettings.db_connection_settings.connection_timeout_millis,
  },

  configSearchstore: {
    user: currentDBUserData.userName,
    host: dbConfigSettings.db_rep_ip_addresses.common_rep_ip_address,
    database: dbConfigSettings.db_names.searchstoreservice,
    password: currentDBUserData.password,
    port: dbConfigSettings.db_connection_settings.db_default_connect_port,
    max: dbConfigSettings.db_connection_settings.db_max_pool,
    min: dbConfigSettings.db_connection_settings.db_min_pool,
    idleTimeoutMillis: dbConfigSettings.db_connection_settings.idle_timeout_millis,
    connectionTimeoutMillis: dbConfigSettings.db_connection_settings.connection_timeout_millis,
  },

  configApplication: {
    user: currentDBUserData.userName,
    host: dbConfigSettings.db_rep_ip_addresses.common_rep_ip_address,
    database: dbConfigSettings.db_names.application,
    password: currentDBUserData.password,
    port: dbConfigSettings.db_connection_settings.db_default_connect_port,
    max: dbConfigSettings.db_connection_settings.db_max_pool,
    min: dbConfigSettings.db_connection_settings.db_min_pool,
    idleTimeoutMillis: dbConfigSettings.db_connection_settings.idle_timeout_millis,
    connectionTimeoutMillis: dbConfigSettings.db_connection_settings.connection_timeout_millis,
  },

  configClientService: {
    user: currentDBUserData.userName,
    host: dbConfigSettings.db_rep_ip_addresses.common_rep_ip_address,
    database: dbConfigSettings.db_names.clientservice,
    password: currentDBUserData.password,
    port: dbConfigSettings.db_connection_settings.db_default_connect_port,
    max: dbConfigSettings.db_connection_settings.db_max_pool,
    min: dbConfigSettings.db_connection_settings.db_min_pool,
    idleTimeoutMillis: dbConfigSettings.db_connection_settings.idle_timeout_millis,
    connectionTimeoutMillis: dbConfigSettings.db_connection_settings.connection_timeout_millis,
  },

  configAutoApplication: {
    user: currentDBUserData.userName,
    host: dbConfigSettings.db_rep_ip_addresses.common_rep_ip_address,
    database: dbConfigSettings.db_names.autotestservice,
    password: currentDBUserData.password,
    port: dbConfigSettings.db_connection_settings.db_default_connect_port,
    max: dbConfigSettings.db_connection_settings.db_max_pool,
    min: dbConfigSettings.db_connection_settings.db_min_pool,
    idleTimeoutMillis: dbConfigSettings.db_connection_settings.idle_timeout_millis,
    connectionTimeoutMillis: dbConfigSettings.db_connection_settings.connection_timeout_millis,
  },

  configCCapplication: {
    user: currentDBUserData.userName,
    host: dbConfigSettings.db_rep_ip_addresses.common_rep_ip_address,
    database: dbConfigSettings.db_names.cctestservice,
    password: currentDBUserData.password,
    port: dbConfigSettings.db_connection_settings.db_default_connect_port,
    max: dbConfigSettings.db_connection_settings.db_max_pool,
    min: dbConfigSettings.db_connection_settings.db_min_pool,
    idleTimeoutMillis: dbConfigSettings.db_connection_settings.idle_timeout_millis,
    connectionTimeoutMillis: dbConfigSettings.db_connection_settings.connection_timeout_millis,
  },

  configAdministration: {
    user: currentDBUserData.userName,
    host: dbConfigSettings.db_rep_ip_addresses.common_rep_ip_address,
    database: dbConfigSettings.db_names.testservice,
    password: currentDBUserData.password,
    port: dbConfigSettings.db_connection_settings.db_default_connect_port,
    max: dbConfigSettings.db_connection_settings.db_max_pool,
    min: dbConfigSettings.db_connection_settings.db_min_pool,
    idleTimeoutMillis: dbConfigSettings.db_connection_settings.idle_timeout_millis,
    connectionTimeoutMillis: dbConfigSettings.db_connection_settings.connection_timeout_millis,
  },

  configStatusview: {
    user: currentDBUserData.userName,
    host: dbConfigSettings.db_rep_ip_addresses.common_rep_ip_address,
    database: dbConfigSettings.db_names.statusviewservice,
    password: currentDBUserData.password,
    port: dbConfigSettings.db_connection_settings.db_default_connect_port,
    max: dbConfigSettings.db_connection_settings.db_max_pool,
    idleTimeoutMillis: dbConfigSettings.db_connection_settings.idle_timeout_millis,
    connectionTimeoutMillis: dbConfigSettings.db_connection_settings.connection_timeout_millis,
  },

  configMapplication: {
    user: currentDBUserData.userName,
    host: dbConfigSettings.db_rep_ip_addresses.common_rep_ip_address,
    database: dbConfigSettings.db_names.mtestservice,
    password: currentDBUserData.password,
    port: dbConfigSettings.db_connection_settings.db_default_connect_port,
    max: dbConfigSettings.db_connection_settings.db_max_pool,
    min: dbConfigSettings.db_connection_settings.db_min_pool,
    idleTimeoutMillis: dbConfigSettings.db_connection_settings.idle_timeout_millis,
    connectionTimeoutMillis: dbConfigSettings.db_connection_settings.connection_timeout_millis,
  },

  configMrealestate: {
    user: currentDBUserData.userName,
    host: dbConfigSettings.db_rep_ip_addresses.common_rep_ip_address,
    database: dbConfigSettings.db_names.mrealestateservice,
    password: currentDBUserData.password,
    port: dbConfigSettings.db_connection_settings.db_default_connect_port,
    max: dbConfigSettings.db_connection_settings.db_max_pool,
    min: dbConfigSettings.db_connection_settings.db_min_pool,
    idleTimeoutMillis: dbConfigSettings.db_connection_settings.idle_timeout_millis,
    connectionTimeoutMillis: dbConfigSettings.db_connection_settings.connection_timeout_millis,
  },
};
