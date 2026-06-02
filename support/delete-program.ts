import type { Page, Response } from '@playwright/test';

export type Program = {
  id: string;
  name: string;
};

export type DeleteResult = {
  id: string;
  ok: boolean;
  status: number;
  message: string;
};

function getBaseUrl(): string {
  return process.env.DIDAXIS_URL ?? 'https://test.didaxis.studio';
}

function getAuthHeaders(): HeadersInit {
  const token = process.env.DIDAXIS_API_TOKEN;
  if (!token) {
    throw new Error('DIDAXIS_API_TOKEN is not set in .env');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function extractProgramId(body: unknown): string {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid program create response');
  }

  const record = body as Record<string, unknown>;
  const data = record.data;

  if (data && typeof data === 'object' && data !== null) {
    const id = (data as Record<string, unknown>).id;
    if (typeof id === 'string' && id.length > 0) {
      return id;
    }
  }

  if (typeof record.id === 'string' && record.id.length > 0) {
    return record.id;
  }

  throw new Error('Could not extract program id from create response');
}

export function waitForProgramCreate(page: Page): Promise<Response> {
  return page.waitForResponse(
    (response) =>
      response.url().includes('/api/programs') &&
      response.request().method() === 'POST' &&
      response.ok(),
  );
}

export function waitForProgramDelete(page: Page): Promise<Response> {
  return page.waitForResponse(
    (response) =>
      /\/api\/programs\/[^/]+$/.test(response.url()) &&
      response.request().method() === 'DELETE' &&
      response.ok(),
  );
}

export async function getAllPrograms(): Promise<Program[]> {
  const response = await fetch(`${getBaseUrl()}/api/programs`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`GET /api/programs failed: ${response.status} ${response.statusText}`);
  }

  const body = (await response.json()) as { data?: Program[] };
  return body.data ?? [];
}

export async function deleteProgramById(id: string): Promise<DeleteResult> {
  const response = await fetch(`${getBaseUrl()}/api/programs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  let message = response.statusText;
  try {
    const body = await response.json();
    message = typeof body.message === 'string' ? body.message : JSON.stringify(body);
  } catch {
    message = await response.text().catch(() => response.statusText);
  }

  return {
    id,
    ok: response.ok,
    status: response.status,
    message,
  };
}

export async function deleteProgramsByIds(ids: string[]): Promise<DeleteResult[]> {
  const uniqueIds = [...new Set(ids.filter((id) => id.trim().length > 0))];
  const results: DeleteResult[] = [];

  for (const id of uniqueIds) {
    results.push(await deleteProgramById(id));
  }

  return results;
}
