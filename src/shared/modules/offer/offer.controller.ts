import {
  BaseController,
  HttpError,
  HttpMethod,
  RequestQuery
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { prepareOffer } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CommentService } from '../comment/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CreateCommentDto } from '../comment/dto/create-comment.dto.js';

type OfferIdParam = {
  offerId: string;
};

type OfferCityParam = {
  city: string;
};

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.find });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.findPremium });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.findFavorite });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Post, handler: this.addToFavorite });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Delete, handler: this.deleteFromFavorite });
    this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Get, handler: this.findComments });
    this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Post, handler: this.createComment });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
  }

  public async create(
    req: Request,
    res: Response
  ): Promise<void> {
    const body = req.body as CreateOfferDto;
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, prepareOffer(result)));
  }

  public async find(
    req: Request,
    res: Response
  ): Promise<void> {
    const query = req.query as RequestQuery;
    const limit = Number(query.limit);
    const offers = await this.offerService.find(Number.isNaN(limit) || limit <= 0 ? undefined : limit);
    this.ok(res, fillDTO(OfferRdo, offers.map((offer) => prepareOffer(offer))));
  }

  public async show(
    req: Request,
    res: Response
  ): Promise<void> {
    const params = req.params as OfferIdParam;
    const offerId = params.offerId.trim();
    const existsOffer = await this.offerService.findById(offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, prepareOffer(existsOffer)));
  }

  public async update(
    req: Request,
    res: Response
  ): Promise<void> {
    const params = req.params as OfferIdParam;
    const body = req.body as UpdateOfferDto;
    const existsOffer = await this.offerService.findById(params.offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    const result = await this.offerService.updateById(params.offerId, body);
    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, prepareOffer(result)));
  }

  public async delete(
    req: Request,
    res: Response
  ): Promise<void> {
    const params = req.params as OfferIdParam;
    const existsOffer = await this.offerService.findById(params.offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    await this.offerService.deleteById(params.offerId);
    await this.commentService.deleteByOfferId(params.offerId);
    this.noContent(res, null);
  }

  public async findPremium(
    req: Request,
    res: Response
  ): Promise<void> {
    const params = req.params as OfferCityParam;
    const offers = await this.offerService.findPremiumByCity(params.city);
    this.ok(res, fillDTO(OfferRdo, offers.map((offer) => prepareOffer(offer))));
  }

  public async findFavorite(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = this.getUserId(req);
    const offers = await this.offerService.findFavorite(userId);
    this.ok(res, fillDTO(OfferRdo, offers.map((offer) => prepareOffer(offer))));
  }

  public async addToFavorite(
    req: Request,
    res: Response
  ): Promise<void> {
    const params = req.params as OfferIdParam;
    const userId = this.getUserId(req);
    const existsOffer = await this.offerService.exists(params.offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    await this.offerService.addToFavorite(params.offerId, userId);
    const result = await this.offerService.findById(params.offerId);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, prepareOffer(result)));
  }

  public async deleteFromFavorite(
    req: Request,
    res: Response
  ): Promise<void> {
    const params = req.params as OfferIdParam;
    const userId = this.getUserId(req);
    const existsOffer = await this.offerService.exists(params.offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    await this.offerService.deleteFromFavorite(params.offerId, userId);
    const result = await this.offerService.findById(params.offerId);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, prepareOffer(result)));
  }

  public async findComments(
    req: Request,
    res: Response
  ): Promise<void> {
    const params = req.params as OfferIdParam;
    const existsOffer = await this.offerService.exists(params.offerId);
    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, comments);
  }

  public async createComment(
    req: Request,
    res: Response
  ): Promise<void> {
    const params = req.params as OfferIdParam;
    const body = req.body as CreateCommentDto;
    const existsOffer = await this.offerService.exists(params.offerId);
    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    const userId = this.getUserId(req);
    const result = await this.commentService.create({
      ...body,
      offerId: params.offerId,
      authorId: userId,
    });

    await this.offerService.incCommentCount(params.offerId);
    await this.offerService.recalculateRating(params.offerId);
    this.created(res, result);
  }

  private getUserId(req: Request): string {
    const userId = req.headers['x-user-id'];
    const value = Array.isArray(userId) ? userId[0] : userId;

    if (!value) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized user',
        'OfferController',
      );
    }

    return value;
  }
}
