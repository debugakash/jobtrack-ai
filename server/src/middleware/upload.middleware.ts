import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC and DOCX files are allowed."));
  }
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const avatarStorage = multer.memoryStorage();

const avatarFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and WEBP images are allowed."));
  }
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
