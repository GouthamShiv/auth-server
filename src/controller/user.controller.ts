import { Request, Response } from 'express';
import log from '../utils/logger';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
  const { body } = req;

  try {
    const user = await createUser(body);
    log.info(`New user created with ID: ${user.email}`);
    res.status(201).send('User successfully created');
  } catch (e: any) {
    // to check if unique constraint has violated
    if (e.code === 11000) {
      res.status(409).send('Account already exists');
    }
    res.status(500).json(e);
  }
}

export default createUserHandler;
