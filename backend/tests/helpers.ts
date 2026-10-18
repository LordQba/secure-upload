import { readdir, rm, stat } from 'node:fs/promises';
import { pool } from '../src/db.js';

export async function resetTestData() {
  await pool.query("DELETE FROM files WHERE version IN ('vulnerable', 'secure')");
  for (const dir of ['uploads/vulnerable', 'uploads/secure']) {
    const files = await readdir(dir).catch(() => [] as string[]);
    await Promise.all(files.map((f) => rm(`${dir}/${f}`).catch(() => undefined)));
  }
  await rm('pwned.txt').catch(() => undefined);
}

export async function pathExists(path: string) {
  return stat(path)
    .then(() => true)
    .catch(() => false);
}
