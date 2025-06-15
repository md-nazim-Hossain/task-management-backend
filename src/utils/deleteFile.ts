import path from 'path';
import fs from 'fs';

export const deleteFile = (filePath: string) => {
  const actualPath = path.join(process.cwd(), 'public', filePath);
  try {
    if (fs.existsSync(actualPath)) {
      fs.unlinkSync(actualPath);
      return true;
    }
  } catch (error) {
    return false;
  }
};
