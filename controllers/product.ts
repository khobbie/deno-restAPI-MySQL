import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import db from '../db_config.ts';

const getProducts = async (ctx: RouterContext) => {
  const products = await db.query(`select * from products`);
  if (products.length == 0) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: 'Available products',
      code: '404',
      count: products.length,
      data: products,
    };
  } else {
    ctx.response.status = 200;
    ctx.response.body = {
      message: 'Available products',
      code: '200',
      count: products.length,
      data: products,
    };
  }
};

const createProduct = async (ctx: RouterContext) => {
  const {
    value: { description, price },
  } = await ctx.request.body();

  if (description == undefined || price == undefined) {
    ctx.response.status = 422;
    ctx.response.body = {
      message: 'Invalid or incorrect parameter(s)',
      code: '422',
      count: 0,
      data: null,
    };
    ctx;
  } else {
    let result = await db.execute(
      `INSERT INTO products (description, price) values(?, ?)`,
      [description, Number(price)]
      // ['phone', 20.9]
    );
    console.log(result.lastInsertId);
  }
};

export { getProducts, createProduct };
