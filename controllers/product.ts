import { RouterContext } from 'https://deno.land/x/oak/mod.ts';

const getProducts = (ctx: RouterContext) => {
  ctx.response.body = 'Get products';
};

export { getProducts };
