// utils/date.js

/**
 * Format a date string to dd/mm/yy HH:MM.
 * @param {string} value
 * @returns {string}
 */
export function formatDateCell(value) {
  if (typeof value !== "string") return value;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  if (!/\d{4}/.test(value) && !/GMT|T\d{2}:\d{2}/.test(value)) return value;
  const pad = n => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}