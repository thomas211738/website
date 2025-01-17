import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import { PORT } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import usersRoute from "./routes/userRoutes.js";
import websitePicsRoute from "./routes/websitePicsRoute.js";
import emailRoute from "./routes/emailRoute.js";
import eventsRoute from "./routes/eventsRoute.js";

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "https://ktpbostonu.com",
    "website-swart-ten-95.vercel.app",
    "http://localhost:5173",
  ]
}
));

const mongoDBURL = process.env.mongoDBURL;


app.use("/users", usersRoute);
app.use("/websitePics", websitePicsRoute);
app.use("/api/email", emailRoute);
app.use("/events", eventsRoute);


app.get("/", (request, response) => {
  return response.status(234).send("NEW KTP WEBSITE!");
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });