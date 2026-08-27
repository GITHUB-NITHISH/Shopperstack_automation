import * as fs from 'fs';
import * as path from 'path';

export class JsonUtil {
  static read<T = any>(relPath: string): T {
    const full = path.resolve(process.cwd(), relPath);
    return JSON.parse(fs.readFileSync(full, 'utf-8')) as T;
  }

  static write(relPath: string, data: unknown): void {
    const full = path.resolve(process.cwd(), relPath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, JSON.stringify(data, null, 2), 'utf-8');
  }
}
