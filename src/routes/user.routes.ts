import express from 'express';
import validate from '../middleware/validate';
import { createUserSchema, verifyUserSchema } from '../schema/user.schema';
import { createUserHandler, verifyUserHandler } from '../controller/user.controller';

const router = express.Router();

router.post('/api/users', validate(createUserSchema), createUserHandler);

router.get('/api/users/verify/:id/:verificationCode', validate(verifyUserSchema), verifyUserHandler);

export default router;
