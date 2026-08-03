import { Router } from "express";
import {
  login,
  me,
  register,
  updateAvatar,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, me);

router.patch(
  "/me/avatar",
  authenticate,
  uploadAvatar.single("avatar"),
  updateAvatar,
);

export default router;
