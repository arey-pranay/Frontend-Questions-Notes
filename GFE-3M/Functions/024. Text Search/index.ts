export default function textSearch(text: string, query: string): string {
  if (!query.trim()) return text;

  const lowerQuery = query.toLowerCase();
  let result = '';
  let i = 0;

  while (i < text.length) {
    const substr = text.slice(i, i + query.length);
    if (substr.toLowerCase() === lowerQuery) {
      result += `<b>${substr}</b>`;
      i += query.length;
    } else {
      result += text[i];
      i++;
    }
  }

  return result.replace(/<\/b><b>/g, '');
}
