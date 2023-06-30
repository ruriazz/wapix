import { checkSchema } from 'express-validator';

const authSchema = checkSchema({
    email: {
        in: ['body'],
        notEmpty: true,
        isEmail: true,
        errorMessage: 'Invalid email',
    },
    password: {
        in: ['body'],
        notEmpty: true,
        errorMessage: 'Invalid password',
    },
});

const refreshTokenSchema = checkSchema({
    refreshToken: {
        in: ['body'],
        notEmpty: true,
        errorMessage: 'refreshToken data is required',
    },
});

const updateInfoSchema = checkSchema({
    newName: {
        optional: {
            options: { nullable: true },
        },
        isEmpty: {
            negated: true,
            errorMessage: 'New nameame cannot be blank',
        },
        isLength: {
            options: { min: 3, max: 75 },
            errorMessage: 'New name should be at least 3 - 50 chars',
        },
    },
    newEmail: {
        optional: {
            options: { nullable: true },
        },
        isEmpty: {
            negated: true,
            errorMessage: 'New email cannot be blank',
        },
        isEmail: {
            negated: false,
            errorMessage: 'Invalid new email',
        },
    },
    newPassword: {
        optional: {
            options: { nullable: true },
        },
        isEmpty: {
            negated: true,
            errorMessage: 'New password cannot be blank',
        },
        isLength: {
            options: { min: 6 },
            errorMessage: 'New password should be at least 6 chars',
        },
    },
    password: {
        isEmpty: {
            negated: true,
            errorMessage: 'Password cannot be blank',
        },
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password should be at least 6 chars',
        },
    },
});

export { authSchema, refreshTokenSchema, updateInfoSchema };
