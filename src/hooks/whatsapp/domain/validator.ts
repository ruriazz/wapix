import { checkSchema } from 'express-validator';

export const postAuthenticatedClientSchema = checkSchema({
    number: {
        in: ['body'],
        notEmpty: true,
        trim: true,
        errorMessage: 'Number is required',
    },
    auth: {
        in: ['body'],
        notEmpty: true,
        trim: true,
        errorMessage: 'Auth collection is required',
    },
});
