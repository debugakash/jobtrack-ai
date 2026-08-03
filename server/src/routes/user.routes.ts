import { Router } from "express";

import { updateProfile } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.patch("/me", authenticate, updateProfile);

export default router;
