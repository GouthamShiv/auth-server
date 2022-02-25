import express from 'express';
import validate from '../middleware/validate';
import { createSessionSchema } from '../schema/auth.schema';
import { createSessionHandler } from '../controller/auth.controller';

const router = express.Router();

router.post('/api/session', validate(createSessionSchema), createSessionHandler);

export default router;
