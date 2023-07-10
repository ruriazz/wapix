import { Strings } from '@helpers/transform';
import { checkSchema } from 'express-validator';

const createEnrollSessionSchema = checkSchema({
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

export { createEnrollSessionSchema };
