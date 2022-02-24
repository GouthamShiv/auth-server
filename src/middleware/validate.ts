import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import log from '../utils/logger';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  log.debug(
    `Validating user input with relevant schema for user with Id: ${JSON.stringify(req.body.id || req.params.id)}`,
  );
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e: any) {
    log.error(
      `Input validation failed against the schema for user with Id: ${JSON.stringify(
        req.body.id || req.params.id,
      )}\nError:${JSON.stringify(e.errors)}`,
    );
    res.status(400).json(e.errors);
  }
};

export default validate;
