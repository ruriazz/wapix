import { checkSchema } from "express-validator";

const authSchema = checkSchema({
    email: {
        in: ["body"],
        notEmpty: true,
        isEmail: true,
        errorMessage: "Invalid email",
    },
    password: {
        in: ["body"],
        notEmpty: true,
        errorMessage: "Invalid password",
    },
});

export { authSchema };
