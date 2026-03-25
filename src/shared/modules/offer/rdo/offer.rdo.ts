import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

class LocationRdo {
  @Expose()
  public latitude!: number;

  @Expose()
  public longitude!: number;
}

class CityRdo {
  @Expose()
  public name!: string;

  @Expose()
  @Type(() => LocationRdo)
  public location!: LocationRdo;
}

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: string;

  @Expose({ name: 'roomsCount' })
  public rooms!: number;

  @Expose({ name: 'guestsCount' })
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose({ name: 'conveniences' })
  public amenities!: string[];

  @Expose({ name: 'previewPath' })
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public commentsCount!: number;

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public host!: UserRdo;

  @Expose()
  @Type(() => CityRdo)
  public city!: CityRdo;

  @Expose({ name: 'coordinates' })
  public location!: {
    latitude: number;
    longitude: number;
  };
}
