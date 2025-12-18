import { StorageProvider, UploadResult } from "./types";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;
  private publicPath: string;

  constructor(uploadDir: string, publicPath: string = "/uploads") {
    this.uploadDir = uploadDir;
    this.publicPath = publicPath;
  }

  async upload(file: File, filePath?: string): Promise<UploadResult> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = filePath || `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
    const fullPath = path.join(this.uploadDir, filename);

    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    // Write file
    await writeFile(fullPath, buffer);

    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;

    if (file.type.startsWith("image/")) {
      try {
        const metadata = await sharp(buffer).metadata();
        width = metadata.width;
        height = metadata.height;
      } catch (error) {
        console.error("Error getting image dimensions:", error);
      }
    }

    return {
      url: `${this.publicPath}/${filename}`,
      key: filename,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      width,
      height,
    };
  }

  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, key);
    try {
      await unlink(fullPath);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  getUrl(key: string): string {
    return `${this.publicPath}/${key}`;
  }
}
