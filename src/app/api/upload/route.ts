import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createStorageProvider } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const storage = createStorageProvider();
    const result = await storage.upload(file);

    // Save media to database
    const media = await prisma.media.create({
      data: {
        filename: result.filename,
        url: result.url,
        key: result.key,
        size: result.size,
        mimeType: result.mimeType,
        type: "IMAGE",
        provider: process.env.STORAGE_PROVIDER === "S3" ? "S3" : "LOCAL",
        width: result.width,
        height: result.height,
      },
    });

    return NextResponse.json({
      url: result.url,
      id: media.id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
