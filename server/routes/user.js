import express from "express";
import { getallusers, updateprofile, getLoginHistory } from "../controller/users.js";

const router = express.Router();

router.get("/getallusers", getallusers);
router.patch("/update/:id", updateprofile);
router.get("/login-history/:userId", getLoginHistory);

export default router;