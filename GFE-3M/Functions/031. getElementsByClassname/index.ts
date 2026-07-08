export default function getElementsByClassName(
  element: Element,
  classNames: string,
): Element[] {
  const classes = classNames.trim().split(/\s+/);

  function func(element: Element): Element[] {
    const ans: Element[] = [];

    if (classes.every(cls => element.classList.contains(cls))) {
      ans.push(element);
    }

    for (const child of element.children) {
      ans.push(...func(child));
    }

    return ans;
  }

  return [...element.children].flatMap(func);
}
