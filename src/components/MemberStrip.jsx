// src/components/MemberStrip.jsx
import fs from 'fs';
import path from 'path';
import { MemberStripClient } from './MemberStripClient';

const VALID_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

export function MemberStrip() {
  const dirPath = path.join(
    process.cwd(),
    'public',
    'logos',
    'Every Masjid Logo bg removed'
  );

  let logos = [];

  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    logos = files
      .filter((dirent) => dirent.isFile())
      .filter((dirent) => {
        const ext = path.extname(dirent.name).toLowerCase();
        return VALID_EXTENSIONS.includes(ext);
      })
      .map((dirent) => ({
        id: dirent.name,
        src: `/logos/Every Masjid Logo bg removed/${encodeURIComponent(dirent.name)}`,
        alt: path.parse(dirent.name).name,
      }));
  }

  return <MemberStripClient logos={logos} />;
}