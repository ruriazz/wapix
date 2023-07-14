import { Strings } from '@helpers/transform';
import { isUUID } from '@src/utils/helpers/ids';
import { checkSchema } from 'express-validator';

export const createEnrollSessionSchema = checkSchema({
    name: {
        in: ['body'],
        trim: true,
        isEmpty: {
            negated: true,
            errorMessage: 'name cannot be blank',
        },
        isLength: {
            options: { min: 2, max: 50 },
            errorMessage: 'Name must be between 2 and 50 characters',
        },
    },
    phoneNumber: {
        in: ['body'],
        isEmpty: {
            negated: true,
            errorMessage: 'phoneNumber cannot be blank',
        },
        isMobilePhone: {
            negated: false,
            errorMessage: 'phoneNumber is invalid',
        },
        custom: {
            options: (val: string) => {
                const phone = Strings.parsePhoneNumber(val);

                if (!phone) {
                    throw new Error('invalid mobile phone');
                }

                return val;
            },
        },
        customSanitizer: {
            options: (val: string) => {
                if (val.startsWith('+')) {
                    return val.substring(1);
                }

                return val;
            },
        },
        trim: true,
    },
});

export const getClientDetailSchema = checkSchema({
    uid: {
        in: ['params'],
        isEmpty: {
            negated: true,
            errorMessage: 'client uid cannot be blank',
        },
        custom: {
            options: (val: string) => {
                if (!isUUID(val)) {
                    throw new Error('invalid client uid');
                }

                return val;
            },
        },
        trim: true,
    },
});

export const updateClientInfoSchema = checkSchema({
    uid: {
        in: ['params'],
        isEmpty: {
            negated: true,
            errorMessage: 'client uid cannot be blank',
        },
        custom: {
            options: (val: string) => {
                if (!isUUID(val)) {
                    throw new Error('invalid client uid');
                }

                return val;
            },
        },
        trim: true,
    },
    name: {
        in: ['body'],
        trim: true,
        isString: true,
        optional: { options: { nullable: true } },
        errorMessage: 'Name must be a string and cannot be empty',
        custom: {
            options: (val: string) => {
                if (val !== '') {
                    if (val.length < 2 || val.length > 50) {
                        throw new Error('Name must be between 2 and 50 characters');
                    }
                }

                return val;
            },
        },
    },
});
