import crypto from "crypto";

const secret = "supersecreta123";
const base =
  "5e463101-55aa-4581-90bc-7d42b20c5fe8|2025-05-31T00:00:20.800Z|NB949576081170|BANK|NB890486847931|NB89|10000|CRC";

const hash = crypto.createHmac("md5", secret).update(base).digest("hex");

console.log("HMAC generado:", hash);
