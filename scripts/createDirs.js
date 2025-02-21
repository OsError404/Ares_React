import fs from 'fs/promises';
import path from 'path';

const createUploadDirs = async () => {
  const dirs = [
    'uploads',
    'uploads/signatures',
    'uploads/documents',
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
      console.log(`Created directory: ${dir}`);
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error(`Error creating directory ${dir}:`, error);
      }
    }
  }
};

createUploadDirs();