/**
 * Get a random hex color string.
 * @returns {string}
 */
export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Calculate the contrast color (black/white) for a given hex color.
 * @param {string} hexcolor
 * @returns {string}
 */
export function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace('#', '');
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 180) ? '#000' : '#fff';
}

/**
 * Calculate the Euclidean distance between two hex colors.
 * @param {string} hex1
 * @param {string} hex2
 * @returns {number}
 */
export function colorDistance(hex1, hex2) {
  hex1 = hex1.replace('#', '');
  hex2 = hex2.replace('#', '');
  const r1 = parseInt(hex1.substr(0,2),16);
  const g1 = parseInt(hex1.substr(2,2),16);
  const b1 = parseInt(hex1.substr(4,2),16);
  const r2 = parseInt(hex2.substr(0,2),16);
  const g2 = parseInt(hex2.substr(2,2),16);
  const b2 = parseInt(hex2.substr(4,2),16);
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

const domainColorMap = {};

/**
 * Assign a unique random color to each domain, ensuring minimum distance.
 * @param {string} domain
 * @param {number} threshold
 * @returns {string}
 */
export function getDomainColor(domain, threshold = 2000) {
  if (!domain) return '#f5f5f5';
  if (domainColorMap[domain]) return domainColorMap[domain];
  let color;
  let attempts = 0;
  do {
    color = getRandomColor();
    attempts++;
  } while (
    (Object.values(domainColorMap).some(existing => colorDistance(color, existing) < threshold)) && attempts < 100
  );
  domainColorMap[domain] = color;
  return color;
}

/**
 * Get the font color for a domain color.
 * @param {string} domain
 * @returns {string}
 */
export function getDomainFontColor(domain) {
  const color = getDomainColor(domain);
  return getContrastYIQ(color);
}
