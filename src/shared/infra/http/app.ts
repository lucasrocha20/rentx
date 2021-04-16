import "reflect-metadata";
import "dotenv/config";
import cors from 'cors';
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUi from 'swagger-ui-express';

import rateLimiter from "@shared/infra/http/middlewares/rateLimiter";
import { router } from "./routes";
import swaggerFile from '../../../swagger.json';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import createConnection from "@shared/infra/typeorm";

import '@shared/container';
import { AppError } from "@shared/errors/AppError";
import uploads from "@config/uploads";

createConnection();
const app = express();

app.use(rateLimiter);

Sentry.init({
    dsn: process.env.SENTRY_DNS,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app })
    ],

    tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/avatar', express.static(`${uploads.tmpFolder}/avatar`));
app.use('/cars', express.static(`${uploads.tmpFolder}/cars`));

app.use(cors());
app.use(router);

app.use(Sentry.Handlers.errorHandler());

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if(err instanceof AppError) {
        return response.status(err.statusCode).json({
            message: err.message,
        });
    }

    return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`,
    })
});

export { app }