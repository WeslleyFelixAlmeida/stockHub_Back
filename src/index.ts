import { env } from "node:process";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./modules/user/routes/userRoutes";
import { connectRedis } from "./connections/redis";
import productRoutes from "./modules/product/routes/productRoutes";

async function serverInit() {
  try {
    await connectRedis(); 

    console.log("Redis conectado!"); 

    const server = express();

    const PORT = env.PORT || 8000;

    server.use(express.json({ limit: "10mb" })); // Limite para o tamanho do payload, principalmente por conta das imagens

    server.use(cookieParser());
    server.use(
      cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
      }),
    );
    
    server.use("/user", userRoutes);
    server.use("/product", productRoutes);

    server.listen(PORT, () => {
      console.log(`Servidor ligado na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);

    process.exit(1);
  }
}

serverInit();
