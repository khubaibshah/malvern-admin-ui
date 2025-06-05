export function getUkRegistrationLabel(regDate: string): string {
  if (!regDate) return '';

  const date = new Date(regDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const regCode = month < 9 ? String(year % 100).padStart(2, '0') : String((year % 100) + 50);

  return `${year} (${regCode} reg)`;
}
