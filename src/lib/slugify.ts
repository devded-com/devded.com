import slugify from "slugify";
import { prisma } from "./prisma";

export async function generateUniqueSlug(title: string, existingSlug?: string): Promise<string> {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  // If we're updating an existing post and the slug hasn't changed, return it
  if (existingSlug === baseSlug) {
    return baseSlug;
  }

  // Check if slug exists
  const existing = await prisma.post.findUnique({
    where: { slug: baseSlug },
  });

  if (!existing) {
    return baseSlug;
  }

  // If slug exists, append a number
  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;

  while (await prisma.post.findUnique({ where: { slug: newSlug } })) {
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }

  return newSlug;
}
