import koa from "koa";
const app = new koa();
const port = 3000;
app.use(async (ctx, next) => {
  ctx.body = "Hello Koa";
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
