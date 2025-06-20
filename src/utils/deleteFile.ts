/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';

export const deleteFile = (fileUrl?: string): boolean => {
  if (!fileUrl) {
    console.warn('deleteFile called with undefined fileUrl');
    return false;
  }
  const filePath = path.join(__dirname, '../../public', fileUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  } else {
    return false;
  }
};
