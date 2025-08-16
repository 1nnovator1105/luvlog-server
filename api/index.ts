/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

const server = express();

let nestAppReady: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const allowedOrigins = ['https://luvlog.xyz', 'https://www.luvlog.xyz'];
  // Enable CORS - Allow all origins
  app.enableCors({
    origin: (origin, callback) => {
      // origin이 undefined일 수 있음 (예: Postman, same-origin 요청)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  await app.init();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!nestAppReady) {
    nestAppReady = bootstrap();
    await nestAppReady;
  }
  server(req, res);
}
