# NestJS Microservice Monorepo

This repository is a **NestJS Monorepo** designed for a scalable microservices architecture. The project is divided into multiple services and shared libraries, enabling modular development and efficient code sharing.

---

## **Table of Contents**
- [Overview](#overview)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Services](#services)
- [Libraries](#libraries)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)

---

## **Overview**
This project is built using the **NestJS** framework and follows a modular architecture. The monorepo structure supports multiple independent services (applications) and shared libraries, making it ideal for developing a microservices-based ecosystem.

Key Features:
- Modular service design
- Shared libraries for common functionality
- Hot-reloading with Webpack
- Configurable environment files for each service
- Scalable architecture for future growth

---

## **Monorepo Structure**
The repository is structured as follows:

```bash
apps/                # Applications
  api-gateway/       # API Gateway for communication between services
  auth/              # Authentication and user management
  notification/      # Notification service

libs/                # Shared libraries
  common/            # Common utilities and modules shared across services

nest-cli.json        # Configuration file for Nest CLI
tsconfig.json        # TypeScript configuration
package.json         # Project metadata and scripts

```

## **Dependencies**
- [Docker](https://www.docker.com/products/docker-desktop/)

### Docker Approach
This application rely on the installation of Docker in the Host machine...Kindly download this before running the program...
After Docker is installed, at the root level of the repo folder, open your terminal and run the below command

### ***To Pull from Git repo***
```
git clone https://github.com/sunnepazzy123/magmaMathTask
cd microservices-ecommerce
```

### ***To Start all Services***
```
  docker compose up -d
```
| Service                          | URL / Credentials                                         |
|-----------------------------------|-----------------------------------------------------------|
| **API Gateway**                   | <a href="http://localhost:3001/api/docs" target="_blank">localhost:3001/api/docs</a> |
| **RabbitMQ Admin**                | <a href="http://localhost:15672" target="_blank">localhost:15672</a> |
| **RabbitMQ Email**                | `admin`                                                   |
| **RabbitMQ Password**             | `admin`                                                   |
| **System Architecture Design**    | <a href="https://app.diagrams.net/#G1kUPl7k6GozjpArDuke6BprujtHld5S9H#%7B%22pageId%22%3A%22SBDJbytT5LhzHjiACsQx%22%7D" target="_blank">Diagrams.net Design</a> |


### ***To View all running Services***
```
  docker ps
```

### ***To Stop all Services***
```
  docker compose down
```