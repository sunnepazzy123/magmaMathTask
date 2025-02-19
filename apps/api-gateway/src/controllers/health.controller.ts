import {
    Controller,
    Get,
    Inject,
    RequestTimeoutException,
  } from '@nestjs/common';
  import { APP, } from '@app/common/constants/events';
  import { ClientProxy } from '@nestjs/microservices';
  import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
  
  
  @Controller()
  export class HealthController {
    constructor(
      @Inject(APP.AUTH_SERVICE) private readonly userClient: ClientProxy, // Injecting the ClientProxy
      @Inject(APP.NOTIFICATION_SERVICE) private readonly notificationClient: ClientProxy, // Injecting the ClientProxy
    ) {}
  
    @Get('/auth/health')
    async checkAuth() {
      try {
        const result = await firstValueFrom(
          this.userClient.send(APP.AUTH_SERVICE, {}).pipe(
            timeout(3000),
            catchError((err) => {
                return throwError(() => new RequestTimeoutException('User service is timeout or might be temporarily unavailable'))
            })
          ),
        );
  
        return result; // Return the health status from Users Service
      } catch (error) {
        throw error; // Handle errors appropriately
      }
    }
  
  
    @Get('/notification/health')
    async checkNotification() {
      try {
        const result = await firstValueFrom(
          this.notificationClient.send(APP.NOTIFICATION_SERVICE, {}).pipe(
            timeout(3000),
            catchError((err) => {
                return throwError(() => new RequestTimeoutException('Notification service is timeout or might be temporarily unavailable'))
            })
          ),
        );
  
        return result; // Return the health status from Notification Service
      } catch (error) {
        throw error; // Handle errors appropriately
      }
    }
  
  }