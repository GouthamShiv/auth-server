import express from 'express';
import validate from '../middleware/validate';
import { createUserSchema } from '../schema/user.schema';
import { createUserHandler } from '../controller/user.controller';

const router = express.Router();

router.post('/api/users', validate(createUserSchema), createUserHandler);

export default router;
