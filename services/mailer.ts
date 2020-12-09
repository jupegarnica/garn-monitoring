import { SmtpClient } from 'https://deno.land/x/smtp@v0.6.0/mod.ts';
import { SMTP,BULK_WAIT } from '../config.ts';
import { logger } from './logger.ts';

const client = new SmtpClient();
interface Email {
  from?: string;
  to?: string;
  subject: string;
  content: string;
}

const queue: Email[] = [];


export function addLogToQueue(email: Email): void {
  queue.push(email);
}

export async function sendInBulk(): Promise<void> {
  try {
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
      await client.send({
        from: SMTP.from,
        to: SMTP.to,
        subject: 'garn-monitor logs',
        content,
      });
      logger.debug(`sent  logs by email`);

    }
    queue.length = 0;
    await client.close();
  } catch (error) {
    logger.error(error)
  }
}
