import { Expose, Transform } from 'class-transformer';

const DEFAULT_AVATAR_PATH = '/static/default-avatar.png';

export class UserRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  @Transform(({ value }) => value ?? DEFAULT_AVATAR_PATH, { toClassOnly: true })
  public avatarPath!: string;

  @Expose()
  public type!: string;
}
