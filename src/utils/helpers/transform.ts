import parsePhoneNumber, { PhoneNumber } from 'libphonenumber-js';

const Strings = {
    toTitleCase(str: string): string {
        return str.replace(/\b\w/g, (match) => match.toUpperCase());
    },
    removeExtraWhitespace(str: string): string {
        return str.replace(/\s+/g, ' ').trim();
    },
    parsePhoneNumber(str: string): PhoneNumber | undefined {
        if (!str.startsWith('+')) {
            str = `+${str}`;
        }

        try {
            const parsed = parsePhoneNumber(str);
            return parsed;
        } catch (error) {
            console.log('ERROR', error);
        }
    },
};

export { Strings };
