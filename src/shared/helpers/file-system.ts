import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export function getCurrentModuleDirectoryPath(): string {
  const filepath = fileURLToPath(import.meta.url);
  return dirname(filepath);
}
