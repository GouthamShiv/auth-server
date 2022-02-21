import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import log from '../utils/logger';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  log.debug('Validating user input with relevant schema');
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e: any) {
    log.error(`User input failed to validate against the schema:\n${e.errors}`);
    res.status(400).json(e.errors);
  }
};

export default validate;
