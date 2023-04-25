import pgPromise from "pg-promise";

const pgp = pgPromise()("postgres://admin:admin@localhost:5432/planets");

const setupDb = async () => {
  await pgp.none(
    `
        CREATE TABLE IF NOT EXISTS planets (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            imgPath TEXT
        );`
  );

  await pgp.none(
    `
    DROP TABLE IF EXISTS users;
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            token TEXT
        );`
  );

  await pgp.none(
    `
    INSERT INTO users (username, password) VALUES ('dummy', 'dummy');
    `
  );
};

setupDb();

export default pgp;
