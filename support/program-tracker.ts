import fs from 'node:fs';
import path from 'node:path';

const TRACKER_PATH = path.join(process.cwd(), '.program-tracker.json');

export function initTracker(): void {
  fs.writeFileSync(TRACKER_PATH, '[]\n', 'utf-8');
}

export function readTrackedPrograms(): string[] {
  if (!fs.existsSync(TRACKER_PATH)) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf-8'));
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

export function appendToTracker(id: string): void {
  const ids = readTrackedPrograms();
  if (!ids.includes(id)) {
    ids.push(id);
    fs.writeFileSync(TRACKER_PATH, `${JSON.stringify(ids, null, 2)}\n`, 'utf-8');
  }
}
