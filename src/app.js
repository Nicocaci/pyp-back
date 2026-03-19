import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import productRouter from "./router/product.router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = [
  "http://localhost:5173",
  "https://www.cfhomedeco.com"
];

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Base de datos conectada correctamente");
  })
  .catch((error) => {
    console.log("Error al conectar la base de datos", error);
  });

//Middlewares
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (por ejemplo, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS no permitido por este dominio"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static("./src/public"));

//Rutas
app.get("/", (req, res) => {
  res.send("Bienvenido turrito");
});
app.use("/api/products", productRouter);
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
