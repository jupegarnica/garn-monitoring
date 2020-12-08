import { SmtpClient } from 'https://deno.land/x/smtp@v0.6.0/mod.ts';
import { SMTP,BULK_WAIT } from '../config.ts';
import { debounce } from './helper.ts';
import { logger } from './logger.ts';

const client = new SmtpClient();
interface Email {
  from?: string;
  to?: string;
  subject: string;
  content: string;
}

const queue: Email[] = [];

const sendDebounced = debounce(sendInBulk, BULK_WAIT);

export function sendEmail(email: Email): void {
  queue.push(email);
  sendDebounced();
}

export async function sendInBulk(): Promise<void> {
  await client.connectTLS({
    hostname: SMTP.host,
    port: Number(SMTP.port),
    username: SMTP.username,
    password: SMTP.password,
  });
  let content = '';
  for (const email of queue) {
    const data: any = email;
    content += `<div class="record">${data.content}</div>`;
  }
  if (content) {
    logger.debug(`SENDING MAIL IN BULK.  after ${BULK_WAIT}`);
    await client.send({
      from: SMTP.from,
      to: SMTP.to,
      subject: 'garn-monitor logs',
      content,
    });
  }
  queue.length = 0;
  await client.close();
}
