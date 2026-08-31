import crypto from "crypto";
import path from "path";

import type { StorageService } from "./storage.service.js";

import { supabase } from "../../config/supabase.js";

const bucketName = process.env.SUPABASE_STORAGE_BUCKET;

if (!bucketName) {
  throw new Error("SUPABASE_STORAGE_BUCKET is not configured.");
}

function getBucketName(): string {
  if (!bucketName) {
    throw new Error("SUPABASE_STORAGE_BUCKET is not configured.");
  }

  return bucketName;
}

export class SupabaseStorageService implements StorageService {
  async upload(file: Express.Multer.File, folder: "resumes" | "avatars") {
    const extension = path.extname(file.originalname);

    const storedName = `${crypto.randomUUID()}${extension}`;

    const filePath = `${folder}/${storedName}`;

    const { error } = await supabase.storage
      .from(getBucketName())
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return {
      storedName,
      filePath,
    };
  }

  async delete(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(getBucketName())
      .remove([filePath]);

    if (error) {
      throw error;
    }
  }

  async getFileBuffer(filePath: string): Promise<Buffer> {
    return this.download(filePath);
  }

  async download(filePath: string): Promise<Buffer> {
    const { data, error } = await supabase.storage
      .from(getBucketName())
      .download(filePath);

    if (error) {
      throw error;
    }

    return Buffer.from(await data.arrayBuffer());
  }

  getFilePath(filePath: string): string {
    return filePath;
  }

  async getSignedUrl(filePath: string, expiresIn = 3600) {
    const { data, error } = await supabase.storage
      .from(getBucketName())
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw error;
    }

    return data.signedUrl;
  }
}
