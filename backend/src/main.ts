import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true, // Enable raw body for Stripe webhooks
    });

    // Enable CORS for frontend
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global prefix for API routes
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 GICH Backend running on http://localhost:${port}/api`);
}

bootstrap();
