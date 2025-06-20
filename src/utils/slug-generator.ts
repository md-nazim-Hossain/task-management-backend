import { Model } from 'mongoose';
import slugify from 'slugify';

/**
 * Generate a unique slug for a Mongoose model
 * @param {string} text - The original string (e.g. title)
 * @param {Model} model - Mongoose model to check uniqueness
 * @param {string} field - The slug field name in the schema
 * @returns {string} - A unique slug
 */
export async function generateUniqueSlug<T>(
  text: string,
  model: Model<T>,
  field = 'slug'
): Promise<string> {
  const baseSlug = slugify(text, { lower: true, strict: true });
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (await model.exists({ [field]: uniqueSlug } as any)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
