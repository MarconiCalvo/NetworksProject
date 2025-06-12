import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import https from "https";
import fs from "fs";
import path from "path";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import accountRoutes from "./routes/account.routes";
import transactionsRoutes from "./routes/transaction.routes";
import externalRoutes from "./routes/external.routes";
import messageRoutes from "./routes/messages.routes";
import phoneLinkRoutes from "./routes/phoneLink.routes";
import sinpeRoutes from "./routes/sinpe.routes";

const app = express();
const HTTP_PORT = 3001;
const HTTPS_PORT = 3443;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://localhost:5173",
    "https://127.0.0.1:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json());

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", accountRoutes);
app.use("/api", transactionsRoutes);
app.use("/api", externalRoutes);
app.use("/api", messageRoutes);
app.use("/api", phoneLinkRoutes);
app.use("/api", sinpeRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    bank_code: "119",
    timestamp: new Date().toISOString(),
    services: ["http", "https", "sinpe", "transfers"]
  });
});

app.listen(HTTP_PORT, "0.0.0.0", () => {
  console.log(`🌐 Servidor HTTP escuchando en http://0.0.0.0:${HTTP_PORT}`);
});

try {
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../certs/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../certs/cert.pem'))
  };

  https.createServer(sslOptions, app).listen(HTTPS_PORT, "0.0.0.0", () => {
    console.log(`🔒 Servidor HTTPS escuchando en https://0.0.0.0:${HTTPS_PORT}`);
    console.log(`✅ SSL habilitado exitosamente!`);
  });

} catch (error: any) {
  console.log(`⚠️ No se pudo iniciar servidor HTTPS: ${error.message}`);
  console.log(`📝 El servidor HTTP sigue funcionando normalmente en el puerto ${HTTP_PORT}`);
}
