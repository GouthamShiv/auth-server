import { DocumentType, getModelForClass, modelOptions, pre, prop, Severity } from '@typegoose/typegoose';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import log from '../utils/logger';

@pre<User>('save', async function () {
  if (this.isModified('password')) {
    const hash = await argon2.hash(this.password);
    this.password = hash;
  }
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      log.error(e, 'Could not validate password');
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
