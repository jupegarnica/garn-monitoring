import { SmtpClient } from 'https://deno.land/x/smtp@v0.6.0/mod.ts';
import {SMTP} from './config.ts'

const client = new SmtpClient();

interface Email {
  from?: string;
  to?: string;
  subject: string;
  content: string;
}

export async function sendEmail({
  from = SMTP.from || '',
  to = SMTP.to || '',
  subject,
  content,
}: Email): Promise<void> {
  await client.connectTLS({
    hostname: SMTP.host || '',
    port: Number(SMTP.port || ''),
    username: SMTP.username || '',
    password: SMTP.password || '',
  });

  await client.send({
    from,
    to,
    subject,
    content,
  });

  await client.close();
}
