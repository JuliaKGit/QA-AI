function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Native browser confirm shown when deleting a semester from the panel. */
export function expectedDeleteSemesterMessage(semesterName: string): RegExp {
  return new RegExp(
    `Delete semester "${escapeRegExp(semesterName)}"\\? All its sessions and holidays will be removed\\. This cannot be undone\\.`,
  );
}
