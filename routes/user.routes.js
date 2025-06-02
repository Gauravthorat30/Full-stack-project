import express from "express";
import {registerUser} from "../controllers/user.controllers.js";
import {verifyUser} from "../controllers/user.controllers.js"
import {login} from "../controllers/user.controllers.js"
import { getMe } from "../controllers/user.controllers.js";
import { isLoggedin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.get("/verify" , verifyUser);

router.post("/login" , login);

router.post("me" , isLoggedin , getMe);



export default router;