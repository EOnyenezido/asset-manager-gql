import SQL from 'sequelize';

const database = new SQL(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  logging: false,
}, {
  define: {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timestamps: true
  }
});

// TODO: Replace with Migration
database.sync();

export default database;