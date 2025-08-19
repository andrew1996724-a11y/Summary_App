import express from "express";
const router =  express.Router();
import {
    getAllSummarises,
    createSummarize,
} from "../controllers/summarizeController.js";

router.get("/getSummarises", getAllSummarises);
router.post("/createOne", createSummarize);

export default router;