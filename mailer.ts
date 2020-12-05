import { SmtpClient } from 'https://deno.land/x/smtp@v0.6.0/mod.ts';
import { SMTP } from './config.ts';
import { debounce } from './helper.ts';

const client = new SmtpClient();

interface Email {
  from?: string;
  to?: string;
  subject: string;
  content: string;
}

const queue: Email[] = [];

const sendDebounced = debounce(sendInBulk, 1000 * 5);

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
    content += data.content + '<br>';
  }
  await client.send({
    from: SMTP.from,
    to: SMTP.to,
    subject: 'garn-monitor logs',
    content: content,
  });
  queue.length = 0
  await client.close();
}
