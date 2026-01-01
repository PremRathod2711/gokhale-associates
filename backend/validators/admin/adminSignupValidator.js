import { body } from 'express-validator';

export const adminSignupValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required'),

    body('email')
        .isEmail()
        .withMessage('Valid email is required'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('phone')
        .notEmpty()
        .withMessage('Phone number is required')
];
