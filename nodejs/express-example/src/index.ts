import express from "express";
import session from "express-session";
import parseurl from "parseurl";
import Redis from "ioredis";
import bodyParser from "body-parser";
import { RedisStore } from "connect-redis";
declare module "express-session" {
  interface SessionData {
    views: Record<string, string>;
  }
}
const app = express();
const port = 3000;
const redis = new Redis({
  password: "backend-examples",
});
const store = new RedisStore({
  client: redis,
  prefix: "express-example:",
});
app.use(
  session({
    store,
    secret: "express-example",
    resave: false,
    saveUninitialized: false,
    name: "express-example",
    cookie: {
      maxAge: 60 * 5 * 1000, // 5m
    },
  })
);
app.use(bodyParser.json());
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {};
  }

  const body = req.body;
  req.session.views["email"] = body.email;

  next();
});

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.post("/api/v1/auth/signin", (req, res) => {
  res.send({
    success: true,
    access_token: "access_token",
  });
});

app.post("/api/v1/auth/signout", (req, res) => {
  req.session.destroy((err) => {
    res.send({
      success: true,
    });
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
