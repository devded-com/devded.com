export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface StorageProvider {
  upload(file: File, path?: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}

export type StorageConfig = {
  provider: "LOCAL" | "S3";
  local?: {
    uploadDir: string;
    publicPath: string;
  };
  s3?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
};
