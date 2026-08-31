export interface StorageService {
  upload(
    file: Express.Multer.File,
    folder: "resumes" | "avatars",
  ): Promise<{
    storedName: string;
    filePath: string;
  }>;

  delete(filePath: string): Promise<void>;

  getFileBuffer(filePath: string): Promise<Buffer>;

  download(filePath: string): Promise<Buffer>;

  getFilePath(filePath: string): string;

  getSignedUrl(filePath: string, expiresIn?: number): Promise<string>;
}
