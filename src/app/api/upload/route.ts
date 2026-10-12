import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided for upload" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "images", "products");

    // Ensure the destination directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Read existing files to detect the highest current admin_<number>
    const existingFiles = await fs.readdir(uploadDir);
    let maxCounter = 0;

    const adminRegex = /^admin_(\d+)\.[a-zA-Z0-9]+$/;
    for (const filename of existingFiles) {
      const match = filename.match(adminRegex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxCounter) {
          maxCounter = num;
        }
      }
    }

    const uploadedPaths: string[] = [];

    for (const file of files) {
      maxCounter += 1;
      const originalExtension = path.extname(file.name) || ".jpg";
      const sanitizedExtension = originalExtension.startsWith(".")
        ? originalExtension.toLowerCase()
        : `.${originalExtension.toLowerCase()}`;

      const newFileName = `admin_${maxCounter}${sanitizedExtension}`;
      const filePath = path.join(uploadDir, newFileName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.writeFile(filePath, buffer);

      // Store relative public path
      uploadedPaths.push(`/images/products/${newFileName}`);
    }

    return NextResponse.json({
      success: true,
      paths: uploadedPaths,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to process and store files" },
      { status: 500 }
    );
  }
}