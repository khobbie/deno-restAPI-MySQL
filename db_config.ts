import { Client } from 'https://deno.land/x/mysql/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';

// console.log(config().MYSQL_HOST);

const db = await new Client().connect({
  hostname: config().MYSQL_HOST,
  username: config().MYSQL_USERNAME,
  db: config().MYSQL_DATABASE,
  password: config().MYSQL_PASSWORD,
});

// await db.execute(`DROP TABLES IF EXISTS products`);
// await db.execute(`
//         CREATE TABLE products (
//         id int(11) NOT NULL AUTO_INCREMENT,
//         description varchar(60),
//         description varchar(60),
//         PRIMARY KEY(id)
//         ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
//     `);

// console.log(db);

// let result = await db.execute(
//   `INSERT INTO products(description, price) values(?, ?)`,
//   ['phone', 20.9]
// );
// console.log(result);

// const users = await db.query(`select * from products`);
// console.log(users);

// TRANSACTION
// const products: any = await db.transaction(async (conn) => {
//   await conn.execute(`INSERT INTO products(description, price) values(?, ?)`, [
//     'phone',
//     20.9,
//   ]);
//   return await conn.query(`select ??, ?? from ??`, [
//     'description',
//     'price',
//     'products',
//   ]);
// });
// console.log(products.length);

export default db;
