/** Reduce syntaxic items to use an imported route directly from `require` */
export function req(path: string) {
    return require(path).default;
}

/** Does the same as req from `./routes/api/` */
export function reqapi(path: string) {
    return req("./routes/api/" + path);
}
