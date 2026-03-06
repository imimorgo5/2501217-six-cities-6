import { Container } from 'inversify';
import { createRestApplicationContainer, RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';

async function bootstrap(): Promise<void> {
  const appContainer = new Container();
  appContainer.load(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
  );

  const application: RestApplication = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
