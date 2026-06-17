export default function identicalDOMTrees(nodeA: Node, nodeB: Node): boolean {
  //each Node has nodeType
  // for TEXT_NODE type, check textContext
  // you can typecast the Node as Element, 
  //then check tagName, childNodes.length, attributes.length
  //then check hasSameAttributes
  if(nodeA.nodeType !== nodeB.nodeType) return false;
  if(nodeA.nodeType === Node.TEXT_NODE) return nodeA.textContent === nodeB.textContent;

  let elA = nodeA as Element;
  let elB = nodeB as Element;

  if(elA.tagName != elB.tagName ||
    elA.children.length != elB.children.length ||
    elA.attributes.length != elB.attributes.length
  ) return false;

  let hasSameAttributes = true;
  for (const attrName of elA.getAttributeNames()) {
    if (elA.getAttribute(attrName) !== elB.getAttribute(attrName)) {
      hasSameAttributes = false;
      break;
    }
  }
  if(!hasSameAttributes) return false;
  for (let i = 0; i < elA.childNodes.length; i++) {
    if (!identicalDOMTrees(elA.childNodes[i], elB.childNodes[i])) {
      return false;
    }
  }
  return true;
}
