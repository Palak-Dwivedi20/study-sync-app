import jwt from "jsonwebtoken";

const generateResetPasswordToken = (userId) => {
    return jwt.sign(
        {
            _id: userId,
            purpose: "passwordReset"
        },
        process.env.RESET_PASSWORD_TOKEN_SECRET,
        {
            expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRY
        }
    );
};

export { generateResetPasswordToken };