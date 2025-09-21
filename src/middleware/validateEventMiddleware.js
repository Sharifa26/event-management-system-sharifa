import { body, validationResult } from 'express-validator';

export const validateEvent = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date'),

    body('time')
        .notEmpty().withMessage('Time is required')
        .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:mm format'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required'),

    body('capacity')
        .optional()
        .isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
