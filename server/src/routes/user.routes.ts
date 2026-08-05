import { Router } from "express";

import {
  updateProfile,
  updateUserPreferencesController,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.patch("/me", authenticate, updateProfile);
router.patch("/me/preferences", authenticate, updateUserPreferencesController);

export default router;
