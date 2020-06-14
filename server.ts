import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { getProducts, createProduct } from './controllers/product.ts';

const app = new Application();
const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());
const port = 9090;

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

// Hello World!
app.use((ctx) => {
  ctx.response.body = 'Hello World!';
});

//  OUR REST API ENDPOINTS

router
  .get('/', (ctx) => {
    ctx.response.body = 'Welcome to Deno Rest API with MySQL';
  })
  .get('/products', getProducts)
  //   .get('/products/:id', getSingleProduct)
  .post('/products', createProduct);
//   .put('/products/:id', updateProduct)
//   .delete('/products/:id', deleteProduct);
await app.listen({ port });
console.log(`Server is up & running on ${port}`);
