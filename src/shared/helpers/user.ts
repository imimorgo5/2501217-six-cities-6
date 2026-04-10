import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from '../modules/user/user.entity.js';

export function prepareUser(user: DocumentType<UserEntity>) {
  return {
    ...user.toObject(),
    id: String(user._id),
  };
}
