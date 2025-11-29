function removeUndfined(obj: Record<string, any>) {
    for (var propName in obj) {
        if (obj[propName] === undefined) {
            delete obj[propName];
        }
    }

    return obj
}

export function recordToQuery(data: Record<string, any>) {
    const query = new URLSearchParams(removeUndfined(data));
    return query.toString()
}
