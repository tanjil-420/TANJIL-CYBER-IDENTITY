
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const QRCode = require("qrcode");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(express.json({ limit: "10kb" }));

// Health check for Render and monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "online",
    project: "TANJIL CYBER IDENTITY",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Dynamic QR Code Generator
app.get("/api/qr", async (req, res) => {
  try {
    const text = String(req.query.text || "");

    if (!text || text.length > 2000) {
      return res.status(400).json({
        error: "Invalid QR content"
      });
    }

    const png = await QRCode.toBuffer(text, {
      type: "png",
      errorCorrectionLevel: "H",
      width: 700,
      margin: 3,
      color: {
        dark: "#08111F",
        light: "#FFFFFF"
      }
    });

    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(png);

  } catch (error) {
    console.error("QR Error:", error.message);
    res.status(500).json({
      error: "QR generation failed"
    });
  }
});

// Portfolio static files
app.use(express.static(path.join(__dirname, "public")));

// Main route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// Server start
app.listen(PORT, "0.0.0.0", () => {
  console.log("----------------------------------");
  console.log("TANJIL CYBER IDENTITY");
  console.log("Server: ONLINE");
  console.log(`Port: ${PORT}`);
  console.log("----------------------------------");
});
