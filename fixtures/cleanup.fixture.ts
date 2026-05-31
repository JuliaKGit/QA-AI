import { test as base, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { deleteProgramsByIds } from '../support/delete-program';

dotenv.config();

type CleanupFixtures = {
  trackProgram: (uuid: string) => void;
};

export const test = base.extend<CleanupFixtures>({
  trackProgram: async ({}, use) => {
    const trackedIds = new Set<string>();

    await use((uuid: string) => {
      const id = uuid.trim();
      if (!id) {
        throw new Error('trackProgram requires a non-empty program UUID');
      }
      trackedIds.add(id);
    });

    if (trackedIds.size === 0) {
      return;
    }

    const results = await deleteProgramsByIds([...trackedIds]);

    for (const result of results) {
      if (result.ok || result.status === 404) {
        continue;
      }

      console.warn(
        `[cleanup] Failed to delete program ${result.id}: ${result.status} ${result.message}`,
      );
    }
  },
});

export { expect };
