import express from "express";
import { askquestion, getallquestion, deletequestion, votequestion } from "../controller/Question.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/Ask', auth, askquestion);
router.get('/get', getallquestion);
router.delete("/delete/:id", auth, deletequestion);
router.patch("/vote/:id", auth, votequestion);

export default router;