import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import admin from "firebase-admin";
import crypto from "crypto";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
// In this environment, we can often use the default credentials or initialize with project ID
if (!admin.apps.length) {
  admin.initializeApp({
    // projectID is usually available in the environment or config
    // For now, we'll assume it's set up via the platform
  });
}

const db = admin.firestore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(helmet({
    contentSecurityPolicy: false, // For development and iframe compatibility
  }));
  app.use(express.json());
  app.use(cookieParser());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use("/api/", limiter);

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Paystack Webhook (Simulated)
  app.post("/api/v1/orders/verify", async (req, res) => {
    const { reference, orderId } = req.body;
    // In a real app, you'd verify the signature and call Paystack API
    try {
      const orderRef = db.collection("orders").doc(orderId);
      await orderRef.update({
        status: "PAID",
        paymentRef: reference,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Generate Receipt
      const orderSnap = await orderRef.get();
      const orderData = orderSnap.data();
      if (orderData) {
        const receiptId = `UNN-RCT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        const stampHash = crypto.createHmac('sha256', process.env.RECEIPT_STAMP_SECRET || 'default_secret')
          .update(receiptId + orderId)
          .digest('hex');

        await db.collection("receipts").doc(receiptId).set({
          receiptNumber: receiptId,
          orderId: orderId,
          userId: orderData.userId,
          stampHash: stampHash,
          isVerified: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      res.json({ status: "success" });
    } catch (error) {
      console.error("Order verification failed:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Receipt Verification Endpoint (Public)
  app.get("/api/v1/receipts/:receiptId/verify", async (req, res) => {
    const { receiptId } = req.params;
    try {
      const receiptSnap = await db.collection("receipts").doc(receiptId).get();
      if (!receiptSnap.exists) {
        return res.status(404).json({ error: "Receipt not found" });
      }
      const receiptData = receiptSnap.data();
      const orderSnap = await db.collection("orders").doc(receiptData?.orderId).get();
      const orderData = orderSnap.data();
      const userSnap = await db.collection("users").doc(receiptData?.userId).get();
      const userData = userSnap.data();

      res.json({
        verified: true,
        receipt: receiptData,
        order: orderData,
        user: userData,
        verificationTimestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
