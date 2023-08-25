import { body } from 'express-validator';

const registerValidation = () => {
  return [
    body('email').isEmail().withMessage('invalid email'),
    body('password')
      .isLength({ min: 6, max: 20 })
      .withMessage('password should be between 6 and 20 characters'),
    body('confirm_password').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password and password confirmation don't match");
      } else {
        return true;
      }
    }),
  ];
};

export { registerValidation };
