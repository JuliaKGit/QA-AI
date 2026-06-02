function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Native browser confirm shown when deleting a program from the list. */
export function expectedDeleteMessage(programName: string): RegExp {
  return new RegExp(
    `Delete program "${escapeRegExp(programName)}"\\? All its semesters and courses will be removed\\. This cannot be undone\\.`,
  );
}
