import { Router } from "express";
import {
  changePasswordController,
  deleteAccount,
  forgotPassword,
  googleAuth,
  googleCallback,
  googleExchange,
  login,
  me,
  register,
  resetPasswordController,
  updateAvatar,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";
import {
  authRateLimiter,
  passwordResetRateLimiter,
} from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.post("/google/exchange", googleExchange);

router.post("/forgot-password", passwordResetRateLimiter, forgotPassword);
router.post("/reset-password", authRateLimiter, resetPasswordController);

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
