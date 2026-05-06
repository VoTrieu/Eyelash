export const toTimeOnly = (value: Date | string | null | undefined): (string | null) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}


export const toDateOnly = (value: Date | string | null | undefined): (string | null) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const toDateFromTimeString = (time: string | null | undefined): Date | null => {
  if (!time) return null;

  const parts = time.split(':').map(Number);
  const [h, m, s = 0] = parts;

  const date = new Date();
  date.setHours(h, m, s, 0);

  return date;
}
