import { HealthCheckService } from '@chris.araneo/health-check';
import { Logger, LogLevel } from '@chris.araneo/logger';
import express from 'express';
import Mustache from 'mustache';
import Mailjet from 'node-mailjet';

const {
  MJ_APIKEY_PUBLIC,
  MJ_APIKEY_PRIVATE,
  SENDER,
  NAME,
  SUBJECT,
  RECEIVER,
  TEXT_TEMPLATE,
  HTML_TEMPLATE,
  EMAIL_SERVICE_PORT,
  LOG_LEVEL,
  EMAIL_SERVICE_HEALTH_CHECK_PORT,
} = process.env;

const logger = new Logger((LOG_LEVEL || 'debug') as LogLevel);

logger.info('Email Service v0.0.1');

logger.debug(
  `Environmental variables: ${JSON.stringify({ ...process.env, ['MJ_APIKEY_PRIVATE']: undefined })}`,
);

const app = express();
const mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

app.get('/', (request, respone) => {
  const body = request.body;

  const text = Mustache.render(TEXT_TEMPLATE, body);
  const html = Mustache.render(HTML_TEMPLATE, body);

  mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: SENDER,
            Name: NAME,
          },
          To: [
            {
              Email: RECEIVER,
            },
          ],
          Subject: SUBJECT,
          TextPart: text,
          HTMLPart: html,
        },
      ],
    })
    .then((result) => {
      logger.info(`Result: ${result.body}`);

      respone.send({ status: 'success' });
    })
    .catch((error) => {
      logger.error(`Result: ${JSON.stringify(error)}`);

      respone.send({ status: 'error', message: error });
    });
});

app.listen(EMAIL_SERVICE_PORT);

logger.info(`Server running at port ${EMAIL_SERVICE_PORT}`);

if (EMAIL_SERVICE_HEALTH_CHECK_PORT) {
  new HealthCheckService(
    '/health',
    Number(EMAIL_SERVICE_HEALTH_CHECK_PORT),
    logger,
  ).listen();
}
