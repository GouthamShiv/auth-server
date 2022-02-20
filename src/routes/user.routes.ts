import express from 'express';

const router = express.Router();

router.post('/api/users', (req, res) => res.sendStatus(201));

export default router;
