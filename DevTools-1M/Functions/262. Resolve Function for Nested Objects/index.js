function resolveObjectFunctions(input, argsMap = {}) {
    // order matters
    // as in the next condition of typeof input !== "object"
    // will be true for functions
    // If input itself is a function, execute it
    // e.g. input = () => 1
    if (typeof input === "function") {
        const result = input(...(argsMap[""] || []));
        return resolveObjectFunctions(result, argsMap);
    }

    // return as it is if
    // primitive, null, undefined
    if (input == null || typeof input !== "object") {
        return input;
    }

    // Arrays → resolve each element
    if (Array.isArray(input)) {
        return input.map((item) => resolveObjectFunctions(item, argsMap));
    }

    // Objects → resolve each key
    const result = {};

    // looping over input
    // { total: (a, b) => a + b }
    for (const key of Object.keys(input)) {
        // (a, b) => a + b;
        const value = input[key];

        // if value is a function
        if (typeof value === "function") {
            // args['total'] => [2, 3] or []
            const args = argsMap[key] || [];
            // (2, 3) => 2 + 3 => 5
            const resolvedValue = value(...args);
            // result['total'] = resolveObjectFunctions(5, argsMap)
            // why calling again?
            // because resolvedValue could be an object that needs
            // further resolution
            result[key] = resolveObjectFunctions(resolvedValue, argsMap);
        } else {
            // if value is not a function
            // invoke again to see if need to further resolve
            // if primitive we will get the value as it is
            // if object further resolve
            result[key] = resolveObjectFunctions(value, argsMap);
        }
    }

    return result;
}
