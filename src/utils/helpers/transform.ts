const Strings = {
    toTitleCase(str: string): string {
        return str.replace(/\b\w/g, (match) => match.toUpperCase());
    },
    removeExtraWhitespace(str: string): string {
        return str.replace(/\s+/g, ' ').trim();
    },
};

export { Strings };
