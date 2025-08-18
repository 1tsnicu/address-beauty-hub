/**
 * Utilities pentru conversie între nume produs și slug URL-friendly
 */

/**
 * Convertește un nume de produs într-un slug URL-friendly
 * Aplică aceleași transformări ca în VIEW-ul SQL
 */
export function slugify(name: string): string {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .trim()
    // Înlocuiește diacriticele românești
    .replace(/[ăâ]/g, 'a')
    .replace(/[șş]/g, 's')
    .replace(/[țţ]/g, 't')
    .replace(/[îì]/g, 'i')
    // Elimină caracterele speciale (păstrează doar litere, cifre, spații și cratimă)
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    // Înlocuiește spațiile multiple cu o singură cratimă
    .replace(/\s+/g, '-')
    // Elimină cratimele multiple consecutive
    .replace(/-+/g, '-')
    // Elimină cratimele de la început și sfârșit
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Convertește un slug înapoi într-o formă care poate fi comparată cu numele
 * (pentru query-urile SQL care nu folosesc VIEW-ul)
 */
export function unslugify(slug: string): string {
  if (!slug || typeof slug !== 'string') return '';
  
  return slug
    .replace(/-/g, ' ')
    .trim();
}

/**
 * Compară un nume de produs cu un slug pentru a verifica dacă se potrivesc
 */
export function nameMatchesSlug(name: string, slug: string): boolean {
  return slugify(name) === slug.toLowerCase();
}

/**
 * Extrage numele din slug pentru afișare (capitalizează prima literă)
 */
export function displayNameFromSlug(slug: string): string {
  return unslugify(slug)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
