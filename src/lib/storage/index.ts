import { LocalStorageProvider } from "./local";
import { S3StorageProvider } from "./s3";
import { StorageProvider, StorageConfig } from "./types";

export function createStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || "LOCAL";

  if (provider === "S3") {
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!bucket || !region || !accessKeyId || !secretAccessKey) {
      throw new Error("S3 configuration is incomplete");
    }

    return new S3StorageProvider({
      bucket,
      region,
      accessKeyId,
      secretAccessKey,
    });
  }

  // Default to local storage
  const uploadDir = process.env.UPLOAD_DIR || "./public/uploads";
  return new LocalStorageProvider(uploadDir);
}

export * from "./types";
export { LocalStorageProvider, S3StorageProvider };
