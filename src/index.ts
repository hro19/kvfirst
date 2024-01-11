import { KVNamespace } from '@cloudflare/workers-types'
import { Hono } from 'hono'
// import { bearerAuth } from "hono/bearer-auth";

type Bindings = {
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// const token = "honoiscool";
// app.use("/api/*", bearerAuth({ token }));

app.get('/api/items/aa', async (c) => {
  // MY_KV から get
  const item:any = await c.env.MY_KV.get('aa')
  console.log(c.env.MY_KV);
  const objitem = JSON.parse(item);
  return c.json({ success: true, aa: objitem });
})

app.post('/api/items', async (c) => {
  const { value } = await c.req.json();
  // オブジェクトをJSON文字列に変換
  const jsonvalue = JSON.stringify(value);
  await c.env.MY_KV.put("aa", jsonvalue);
  return c.json({ success: true });
})

export default app