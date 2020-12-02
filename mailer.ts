import { SmtpClient } from 'https://deno.land/x/smtp@v0.6.0/mod.ts';
import  './config.ts'

const client = new SmtpClient();

interface Email {
  from?: string;
  to?: string;
  subject: string;
  content: string;
}

export async function sendEmail({
  from = Deno.env.get('SMTP_FROM') || '',
  to = Deno.env.get('SMTP_TO') || '',
  subject,
  content,
}: Email): Promise<void> {
  await client.connectTLS({
    hostname: Deno.env.get('SMTP_HOST') || '',
    port: Number(Deno.env.get('SMTP_PORT') || ''),
    username: Deno.env.get('SMTP_USERNAME') || '',
    password: Deno.env.get('SMTP_PASSWORD') || '',
  });

  await client.send({
    from,
    to,
    subject,
    content,
  });

  await client.close();
}
