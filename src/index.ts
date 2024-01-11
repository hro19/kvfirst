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
  const item = await c.env.MY_KV.get('aa')
  console.log(c.env.MY_KV);
  return c.json({success: true, aa: item})
})

app.post('/api/items', async (c) => {
  const { value } = await c.req.json()
  if (typeof value === "string") {
    // MY_KV へ put
    await c.env.MY_KV.put("aa", value)
  }
  return c.json({success: true})
})

export default app