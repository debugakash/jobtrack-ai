import { Router } from "express";
import {
  changePasswordController,
  deleteAccount,
  forgotPassword,
  login,
  me,
  register,
  resetPasswordController,
  updateAvatar,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password", asyncHandler(resetPasswordController));

router.get("/me", authenticate, me);

router.patch(
  "/me/avatar",
  authenticate,
  uploadAvatar.single("avatar"),
  updateAvatar,
);

router.patch("/me/password", authenticate, changePasswordController);

router.delete("/me", authenticate, deleteAccount);

export default router;
