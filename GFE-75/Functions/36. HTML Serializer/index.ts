type HTMLNode = string | HTMLElementNode;

type HTMLElementNode = {
  tag: string;
  children: HTMLNode[];
};

export default function serializeHTML(root: HTMLElementNode): string {
  return traverse(root);
}
function traverse(node: HTMLNode, depth = 0): string {
    const indentation = '\t'.repeat(depth);

    if (typeof node === 'string') {
      return `${indentation}${node}`;
    }

    // Each element contributes an opening tag, its serialized children, and a closing tag.
    return [
      `${indentation}<${node.tag.toLowerCase()}>`,
      ...node.children.map((child) => traverse(child, depth + 1)),
      `${indentation}</${node.tag.toLowerCase()}>`,
    ].join('\n');
  }
