import express from "express";
import cors from "cors";
import summarizeRoutes from "./routes/summarizeRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/summarize", summarizeRoutes);


app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
});
