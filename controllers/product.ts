import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import db from '../db_config.ts';

const getProducts = async (ctx: RouterContext) => {
  const products = await db.query(`select * from products`);
  if (products.length == 0) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: 'No data found',
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

const getSingleProduct = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  if (id == undefined) {
    ctx.response.status = 422;
    ctx.response.body = {
      message: 'Invalid or incorrect parameter(s)',
      code: '422',
      count: 0,
      data: null,
    };
  } else {
    const product = await db.query(`SELECT * FROM products WHERE ?? = ?`, [
      'id',
      Number(id),
    ]);
    if (product.length == 0) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: 'No data found',
        code: '404',
        count: product.length,
        data: product,
      };
    } else {
      ctx.response.status = 200;
      ctx.response.body = {
        message: 'Available products',
        code: '200',
        count: product.length,
        data: product,
      };
    }
  }
};

const deleteSingleProduct = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  if (id == undefined) {
    ctx.response.status = 422;
    ctx.response.body = {
      message: 'Invalid or incorrect parameter(s)',
      code: '422',
      count: 0,
      data: null,
    };
  } else {
    const isIdExist = await db.query(`SELECT * FROM products WHERE ?? = ?`, [
      'id',
      Number(id),
    ]);
    if (isIdExist.length == 0) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: `Product with id: ${id}  does not exits`,
        code: '404',
        count: 0,
        data: null,
      };
    } else {
      const product = await db.query(`DELETE FROM products WHERE ?? = ?`, [
        'id',
        Number(id),
      ]);
      if (!product.affectedRows) {
        ctx.response.status = 500;
        ctx.response.body = {
          message: 'Failed to execute query',
          code: '500',
          count: 0,
          data: null,
        };
      } else {
        ctx.response.status = 200;
        ctx.response.body = {
          message: 'Product deleted',
          code: '200',
          count: product.affectedRows,
          data: {
            id: id,
          },
        };
      }
    }
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
  } else {
    let result = await db.execute(
      `INSERT INTO products (description, price) values(?, ?)`,
      [description, Number(price)]
      // ['phone', 20.9]
    );
    if (result.lastInsertId) {
      ctx.response.status = 201;
      ctx.response.body = {
        message: 'Created products',
        code: '201',
        count: result.affectedRows,
        data: {
          id: result.lastInsertId,
          description: description,
          price: price,
          created_at: new Date(),
        },
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        message: 'Failed to execute query',
        code: '500',
        count: 0,
        data: null,
      };
    }
  }
};

export { getProducts, createProduct, getSingleProduct, deleteSingleProduct };
