import { KVNamespace } from '@cloudflare/workers-types'
import { Hono } from 'hono'
import { cors } from "hono/cors";
import { Video } from './ts/video'
// import { bearerAuth } from "hono/bearer-auth";

type Bindings = {
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()
app.use("/api/*", cors());
// const token = "honoiscool";
// app.use("/api/*", bearerAuth({ token }));

app.get("/api/videos/:username", async (c) => {
  // MY_KV から get
  const { username } = c.req.param();
  const videos: any = await c.env.MY_KV.get(username);
  if (videos) {
    const objvideos = JSON.parse(videos);
    return c.json({ success: true, videos: objvideos });
  } else {
    return c.json({ success: false, message: "video not found" });
  }
});

app.post("/api/videos/:username", async (c) => {
  const { username } = c.req.param();
  let newVideo = await c.req.json();

  let videos: any = await c.env.MY_KV.get(username);

  if (!videos) {
    videos = [newVideo]; // Convert newVideo to an array
  } else {
    videos = JSON.parse(videos);
    videos.push(newVideo);
  }

  // Convert the object to a JSON string
  const resultVideos = JSON.stringify(videos);
  await c.env.MY_KV.put(username, resultVideos);
  const perseVideos = JSON.parse(resultVideos);
  return c.json({ success: true, videos: perseVideos });
});

//指定したvideoIdを削除する
app.put("/api/videos/:username/del/:videoId", async (c) => {
  const { username, videoId } = c.req.param();

  let videos:any = await c.env.MY_KV.get(username);

  if (videos === null) {
    return c.json({ success: false, message: "お気に入り登録はありません" });
  } else {
    videos = JSON.parse(videos);
    if (Array.isArray(videos)) {
      videos = videos.filter((video: any) => video.videoId !== videoId);
    }
  }

  const stringifyVideos = JSON.stringify(videos);
  await c.env.MY_KV.put(username, stringifyVideos);

  return c.json({
    success: true,
    videos: videos,
  });
});

app.delete("/api/videos/:username", async (c) => {
  const { username } = c.req.param();

  await c.env.MY_KV.delete(username);

  return c.json({
    success: true,
    message: "Deleted videos for" + username,
  });
});

export default app