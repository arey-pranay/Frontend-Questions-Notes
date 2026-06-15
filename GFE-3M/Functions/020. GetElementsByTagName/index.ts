export default function getElementsByTagName(
  el: Element,
  tagNameParam: string,
): Array<Element> {
  const elements: Array<Element> = [];
  const tagName = tagNameParam.toUpperCase();

  function traverse(el : Element){
    if(el == null) return;
    if(el.tagName === tagName) elements.push(el)
    for(const child of el.children)traverse(child)
  }

  for(const child of el.children)traverse(child);
  return elements;
  // throw 'Not implemented!';
}
