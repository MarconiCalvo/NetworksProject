import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import accountRoutes from "./routes/account.routes";
import transactionsRoutes from "./routes/transaction.routes";
import externalRoutes from "./routes/external.routes";
import messageRoutes from "./routes/messages.routes"; // ✅ importa el router de mensajes

const app = express();
const PORT = 3001;

// Configuración de CORS para permitir requests desde el frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.2.10:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

//app.use(express.json()); // 👈 Esto es obligatorio para que req.body funcione

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", accountRoutes);
app.use("/api", transactionsRoutes);
app.use("/api", externalRoutes);
app.use("/api", messageRoutes); // ✅ usa directamente el router exportado

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor API escuchando en http://0.0.0.0:${PORT}`);
});