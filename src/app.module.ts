import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ApiKeyMiddleware } from './shared/middleware/api-key.middleware';
import { PrismaService } from './shared/prisma/prisma.service';
import { HelpersService } from './shared/helpers/helpers.service';
import { ServiceOrdersModule } from './modules/service-orders/service-orders.module';
import { PatientsModule } from './modules/patients/patients.module';
import { CountersModule } from './modules/counters/counters.module';

import { PricingTableModule } from './modules/pricing-table/pricing-table.module';
import { MedicalFeesModule } from './modules/medical-fees/medical-fees.module';
import { ServiceOrderItemsModule } from './modules/service-order-items/service-order-items.module';
import { ProcessingModule } from './modules/processing/processing.module';
import { TestModule } from './modules/test/test.module';

import { LoggerModule } from 'nestjs-pino';
import { PatientQueueModule } from './modules/patient-queue/patient-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente disponíveis globalmente
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { singleLine: true, colorize: true },
              }
            : undefined,
        formatters: {
          level: (label) => ({ level: label }),
        },
        timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
        mixin: () => ({
          context: 'HTTP',
        }),
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
          censor: '***',
        },
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
            user_agent: req.headers['user-agent'],
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
          err: (err) => ({
            type: err.type,
            message: err.message,
            stack: err.stack,
          }),
        },
      },
    }),
    PatientQueueModule,
    ServiceOrdersModule,
    PatientsModule,
    CountersModule,
    PricingTableModule,
    MedicalFeesModule,
    ServiceOrderItemsModule,
    ProcessingModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, HelpersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*');
  }
}
