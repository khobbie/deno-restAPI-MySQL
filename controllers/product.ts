import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import db from '../db_config.ts';

// GET ALL PRODUCTS
const getProducts = async (ctx: RouterContext) => {
  const products = await db.query(`select * from products`);
  // CHECK IF EMPTY RESULT FROM THE TABLE
  if (products.length == 0) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: 'No data found',
      code: '404',
      count: products.length,
      data: products,
    };
  } else {
    // SUCCESSFUL RESPONSE
    ctx.response.status = 200;
    ctx.response.body = {
      message: 'Available products',
      code: '200',
      count: products.length,
      data: products,
    };
  }
};

// GET SINGLE PRODUCT
const getSingleProduct = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  // CHECK ID IS SENT OVER THE END POINT
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
      // SUCCESSFUL RESPONSE
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

// UPDATE SINGLE PRODUCT
const updateSingleProduct = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  console.log(id);
  // CHECK ID IS SENT OVER THE END POINT
  if (id == undefined) {
    ctx.response.status = 422;
    ctx.response.body = {
      message: 'Invalid or incorrect parameter(s)',
      code: '422',
      count: 0,
      data: null,
    };
  } else {
    const {
      value: { description, price },
    } = await ctx.request.body();
    console.log(description, price);
    // CHECK IF PARAMETERE ARE SENT OVER THE ENDPOINT
    if (description == undefined || price == undefined) {
      ctx.response.status = 422;
      ctx.response.body = {
        message: 'Invalid or incorrect parameter(s)',
        code: '422',
        count: 0,
        data: null,
      };
    } else {
      const product = await db.query(
        `UPDATE products SET description = ? , price = ?  WHERE id = ?`,
        [description, Number(price), Number(id)]
      );
      if (!product.affectedRows) {
        // FAILED QUERY
        ctx.response.status = 500;
        ctx.response.body = {
          message: 'Failed to execute query',
          code: '500',
          count: 0,
          data: null,
        };
      } else {
        // SUCCESSFUL RESPONSE
        ctx.response.status = 200;
        ctx.response.body = {
          message: 'Product successfully updated',
          code: '200',
          count: product.affectedRows,
          data: {
            id: Number(id),
            description: description,
            price: price,
            updated_at: new Date(),
          },
        };
      }
    }
  }
};

// DELETE SINGLE PRODUCT
const deleteSingleProduct = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  if (id == undefined) {
    // CHECK IF ID IS SENT OVER THE ENDPOINT
    ctx.response.status = 422;
    ctx.response.body = {
      message: 'Invalid or incorrect parameter(s)',
      code: '422',
      count: 0,
      data: null,
    };
  } else {
    // CHECK IF ID EXIST IN TABLE
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
        // FAILED QUERY
        ctx.response.status = 500;
        ctx.response.body = {
          message: 'Failed to execute query',
          code: '500',
          count: 0,
          data: null,
        };
      } else {
        // SUCCESSFUL RESPONSE
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

// CREATE A PRODUCT
const createProduct = async (ctx: RouterContext) => {
  const {
    value: { description, price },
  } = await ctx.request.body();

  // CHECK IF PARAMETERE ARE SENT OVER THE ENDPOINT
  if (description == undefined || price == undefined) {
    ctx.response.status = 422;
    ctx.response.body = {
      message: 'Invalid or incorrect parameter(s)',
      code: '422',
      count: 0,
      data: null,
    };
  } else {
    // INSERT INTO PRODUCTS TABLE
    let result = await db.execute(
      `INSERT INTO products (description, price) values(?, ?)`,
      [description, Number(price)]
      // ['phone', 20.9]
    );

    // CHECK IF LAST INSERTED ID EXIST
    if (result.lastInsertId) {
      // SUCCESSFUL RESPONSE
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

// EXPORT CONTROLLER FUNCTIONS
export {
  getProducts,
  createProduct,
  getSingleProduct,
  deleteSingleProduct,
  updateSingleProduct,
};
