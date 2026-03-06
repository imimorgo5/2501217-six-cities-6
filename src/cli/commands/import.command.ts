import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { createOffer, getMongoURI } from '../../shared/helpers/index.js';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { DefaultUserService, UserModel } from '../../shared/modules/user/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Offer } from '../../shared/types/index.js';

export class ImportCommand implements Command {
  private readonly userService: UserService;
  private readonly offerService: OfferService;
  private readonly databaseClient: DatabaseClient;
  private readonly logger: Logger;
  private salt!: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private buildMongoURI(args: string[]): { uri: string; salt: string } {
    if (args.length === 2) {
      const [uri, salt] = args;
      return { uri, salt };
    }

    if (args.length === 5) {
      const [login, password, host, dbName, salt] = args;

      const uri = getMongoURI(
        login,
        password,
        host,
        DEFAULT_DB_PORT,
        dbName
      );

      return { uri, salt };
    }

    throw new Error(
      'Invalid number of arguments for --import command'
    );
  }

  public async execute(
    fileName: string,
    ...params: string[]
  ): Promise<void> {
    const { uri, salt } = this.buildMongoURI(params);

    this.salt = salt;

    this.logger.info('Trying to connect to MongoDB…');

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(fileName.trim());
    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      this.logger.error(`Can't import data from file: ${fileName}`, error as Error);
    }
  }

  private async onImportedLine(line: string, resolve: () => void): Promise<void> {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number): void {
    this.logger.info(`${count} rows imported`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer): Promise<void> {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      previewPath: offer.previewPath,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      price: offer.price,
      conveniences: offer.conveniences,
      authorId: user.id,
      commentsCount: offer.commentsCount,
      coordinates: offer.coordinates
    });
  }
}
