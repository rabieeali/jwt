import { Router } from 'express';
import { login, register, profile,refresh, logout } from '../controllers/auth.controller';
import { validationMapper } from '../validations/validateMapper';
import { registerValidation } from '../validations/register.validation';

const router = Router();

router
  .route('/register')
  .post(registerValidation(), validationMapper, register);

router.route('/login').post(login);

router.route('/logout').post(logout);

router.route('/me').post(profile)

router.route('/refresh').post(refresh)

export default router;
