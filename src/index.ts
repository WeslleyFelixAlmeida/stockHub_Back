import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./modules/user/routes/userRoutes";
import productRoutes from "./modules/product/routes/productRoutes";
import categoryRoutes from "./modules/category/routes/categoryRoutes";
import { connectRedis } from "./connections/redis";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);

let redisConnected = false;

async function initialize() {
  if (!redisConnected) {
    await connectRedis();
    redisConnected = true;
    console.log("Redis conectado!");
  }
}

app.use(async (req, res, next) => {
  await initialize();
  next();
});

export default app;