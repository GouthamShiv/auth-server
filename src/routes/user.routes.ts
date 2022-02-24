import express from 'express';
import validate from '../middleware/validate';
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from '../schema/user.schema';
import {
  createUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from '../controller/user.controller';

const router = express.Router();

router.post('/api/users', validate(createUserSchema), createUserHandler);

router.get('/api/users/verify/:id/:verificationCode', validate(verifyUserSchema), verifyUserHandler);

router.post('/api/users/forgotpassword', validate(forgotPasswordSchema), forgotPasswordHandler);

router.post('/api/users/resetpassword/:id/:passwordResetCode', validate(resetPasswordSchema), resetPasswordHandler);

export default router;
