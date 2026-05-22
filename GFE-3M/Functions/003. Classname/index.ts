export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export default function classNames(...args: Array<ClassValue>): string {
  // Each recursive call returns one space-joined segment; the parent call keeps
  // those segments in the original left-to-right order.
  const classes: Array<string> = [];

  args.forEach((arg) => {
    // Ignore falsey values.
    if (!arg) {
      return;
    }

    const argType = typeof arg;

    // Handle string and numbers.
    if (argType === 'string' || argType === 'number') {
      classes.push(String(arg));
      return;
    }

    // Arrays recurse before objects because `typeof []` is `'object'`.
    if (Array.isArray(arg)) {
      classes.push(classNames(...arg));
      return;
    }

    // Only own truthy keys contribute classes.
    if (argType === 'object') {
      const objArg = arg as ClassDictionary;
      for (const key in objArg) {
        if (Object.hasOwn(objArg, key) && objArg[key]) {
          classes.push(key);
        }
      }

      return;
    }
  });

  return classes.join(' ');
}
