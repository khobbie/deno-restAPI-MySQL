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
  }
  ctx.response.status = 200;
  ctx.response.body = {
    message: 'Available products',
    code: '200',
    count: products.length,
    data: products,
  };
};

export { getProducts };
