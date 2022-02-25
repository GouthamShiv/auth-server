import express from 'express';
import validate from '../middleware/validate';
import { createSessionSchema } from '../schema/auth.schema';
import { createSessionHandler, refreshAccessTokenHandler } from '../controller/auth.controller';

const router = express.Router();

router.post('/api/sessions', validate(createSessionSchema), createSessionHandler);

router.post('/api/sessions/refresh', refreshAccessTokenHandler);

export default router;
