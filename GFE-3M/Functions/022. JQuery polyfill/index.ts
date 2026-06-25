interface JQuery {
  css: (
    prop: string,
    value?: boolean | string | number,
  ) => JQuery | string | undefined;
}
export default function $(selector: string): JQuery {
  const element = document.querySelector(selector) as HTMLElement | null;

  const jquery: JQuery = {
    css(prop, value) {
      if (value === undefined) {
        if (!element) return undefined;

        const currentValue = element.style[prop as any];
        return currentValue === "" ? undefined : currentValue;
      }

      if(element) element?.style[prop as any] = String(value);
      return jquery;
    },
  };

  return jquery;
}
