import 'reflect-metadata';
import { Container } from 'inversify';
import { createRestApplicationContainer, RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';

async function bootstrap(): Promise<void> {
  const appContainer = new Container();
  createRestApplicationContainer(appContainer);
  createUserContainer(appContainer);
  createOfferContainer(appContainer);
  createCommentContainer(appContainer);

  const application: RestApplication = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
