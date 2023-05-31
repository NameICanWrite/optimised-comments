import { UploadedFile } from "express-fileupload";
import sharp from "sharp";
import fsPromises from 'fs/promises'

export const resizeIfNecessary = async (file: UploadedFile, isAnimated?: boolean) => {
  const image = sharp(file.tempFilePath, {animated: isAnimated});
  const metadata = await image.metadata();

  if (metadata.width && metadata.height && (metadata.width > 320 || metadata.height > 240)) {
    const resizedImage = await image.resize(320, 240).toBuffer();
    await fsPromises.writeFile(file.tempFilePath, resizedImage)
  }
}