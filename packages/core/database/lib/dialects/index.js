'use strict';

const path = require('path');
const fse = require('fs-extra');

const errors = require('../errors');

class Dialect {
  constructor(db) {
    this.db = db;
  }

  configure() {}
  initialize() {}

  usesForeignKeys() {
    return false;
  }

  useReturning() {
    return false;
  }

  // TODO: pass query info to display some more metadata
  transformErrors(error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(error.message);
  }
}
class PostgresDialect extends Dialect {
  useReturning() {
    return true;
  }

  initialize() {
    this.db.connection.client.driver.types.setTypeParser(1700, 'text', parseFloat);
  }

  usesForeignKeys() {
    return false;
  }

  transformErrors(error) {
    switch (error.code) {
      case '23502': {
        throw new errors.NotNullConstraint({ column: error.column });
      }
      default: {
        super.transformErrors(error);
      }
    }
  }
}

class MysqlDialect extends Dialect {
  configure() {
    this.db.config.connection.connection.supportBigNumbers = true;
    this.db.config.connection.connection.bigNumberStrings = true;
    this.db.config.connection.connection.typeCast = (field, next) => {
      if (field.type == 'DECIMAL' || field.type === 'NEWDECIMAL') {
        var value = field.string();
        return value === null ? null : Number(value);
      }

      if (field.type == 'TINY' && field.length == 1) {
        let value = field.string();
        return value ? value == '1' : null;
      }
      return next();
    };
  }

  usesForeignKeys() {
    return false;
  }

  transformErrors(error) {
    super.transformErrors(error);
  }
}

class SqliteDialect extends Dialect {
  configure() {
    // TODO: use strapi.dir ?

    this.db.config.connection.connection.filename = path.resolve(
      this.db.config.connection.connection.filename
    );

    const dbDir = path.dirname(this.db.config.connection.connection.filename);

    fse.ensureDirSync(dbDir);
  }

  transformErrors(error) {
    switch (error.errno) {
      case 19: {
        throw new errors.NotNullConstraint(); // TODO: extract column name
      }
      default: {
        super.transformErrors(error);
      }
    }
  }
}
const createDialect = (db, client) => {
  switch (client) {
    case 'postgres':
      return new PostgresDialect(db);
    case 'mysql':
      return new MysqlDialect(db);
    case 'sqlite':
      return new SqliteDialect(db);
    default:
      throw new Error(`Unknow dialect ${client}`);
  }
};

const getDialect = db => {
  const { client } = db.config.connection;

  const dialect = createDialect(db, client);
  dialect.client = client;

  return dialect;
};

module.exports = {
  getDialect,
};
