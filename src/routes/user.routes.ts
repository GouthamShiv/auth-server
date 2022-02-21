import express from 'express';
import validate from '../middleware/validate';
import { createUserSchema, forgotPasswordSchema, verifyUserSchema } from '../schema/user.schema';
import { createUserHandler, forgotPasswordHandler, verifyUserHandler } from '../controller/user.controller';

const router = express.Router();

router.post('/api/users', validate(createUserSchema), createUserHandler);

router.get('/api/users/verify/:id/:verificationCode', validate(verifyUserSchema), verifyUserHandler);

router.post('/api/users/forgotpassword', validate(forgotPasswordSchema), forgotPasswordHandler);

export default router;
