import { INestApplication } from '@nestjs/common'; // Add the necessary import
import { RmqService } from '../rmq/rmq.service'; // Assuming RmqService is correctly imported
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

// Promisify scrypt to use with async/await
const scrypt = promisify(_scrypt);

export const connectMicroservicesQueues = async (
  app: INestApplication,
  queues: string[],
) => {
  const rmqService = app.get<RmqService>(RmqService);
  try {
    queues.forEach((queue) => {
      // Establishing connection to RabbitMQ service
      app.connectMicroservice(rmqService.getOptions(queue));
      console.log(`configure to connect ${queue} microservices`);
    });
    // Start all microservices asynchronously
    await app.startAllMicroservices();
    console.log('Microservices connected and started successfully');
  } catch (error) {
    // Catch and log errors
    console.error('Error in setting up app microservices: ', error);
    throw error; // Optional: rethrow to allow further handling upstream if needed
  }
};


export const hashPassword = async (
  password: string,
  salt: string,
): Promise<{ salt: string; hash: string; saltHash: string }> => {
  // Generate the hash using scrypt
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  return {
    salt,
    hash: hash.toString('hex'),
    saltHash: `${salt}.${hash.toString('hex')}` // Ensuring hash is a hex string before concatenating
  };
}