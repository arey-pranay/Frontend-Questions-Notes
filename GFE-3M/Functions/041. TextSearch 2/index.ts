export default function textSearch(
  text: string,
  queries: Array<string>,
): string {
  if (text.trim() === '') {
    return text;
  }

  const bold = new Set<number>();

  for (const query of queries) {
    if (query.trim() === '') continue;
    for (let i = 0; i < text.length; ) {
      const substr = text.slice(i, i + query.length);
      if (substr.toLowerCase() === query.toLowerCase()) {
         // Start from next character if there's a match since one
        // character cannot match the same query more than once.
        for (let j = i; j < i + query.length; j++) bold.add(j);
        i += query.length;
      } else {
        i++;
      }
    }
  }

  let highlightedString = '';
  for (let i = 0; i < text.length; i++) {
    const shouldAddOpeningTag = bold.has(i) && !bold.has(i - 1);
    const shouldAddClosingTag = bold.has(i) && !bold.has(i + 1);
    let char = text[i];
    if (shouldAddOpeningTag) char = '<b>' + char;
    if (shouldAddClosingTag) char = char + '</b>';
    highlightedString += char;
  }

  return highlightedString;
}
