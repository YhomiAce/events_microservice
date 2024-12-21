# NestJS Microservices Application

This repository contains two NestJS-based microservices designed to demonstrate a scalable and modular architecture. These microservices communicate with each other using RabbitMQ and rely on Docker for containerization, PostgreSQL for database management, and Redis for caching.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Environment Configuration](#environment-configuration)
  - [Run with Docker](#run-with-docker)
- [Microservices Overview](#microservices-overview)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- Microservice architecture using NestJS.
- Communication between services via RabbitMQ.
- PostgreSQL database for reliable storage.
- Redis for caching.
- Dockerized setup for easy deployment.

## Technologies Used

- **NestJS**: Framework for building efficient, scalable Node.js server-side applications.
- **PostgreSQL**: Relational database management system.
- **Redis**: In-memory data structure store used as a cache and message broker.
- **RabbitMQ**: Message broker for inter-service communication.
- **Docker**: Containerization platform for application deployment.

## Prerequisites

Before starting, ensure you have the following installed on your system:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/YhomiAce/events_microservice.git
cd events_microservice
```

### Environment Configuration

Each microservice has its own `.env` file located in their respective directories. Use the `.env.example` file in each directory as a template:

```bash
cp .env.example .env
cp users_events_service/.env.example users_events_service/.env
cp email_notification_service/.env.example email_notification_service/.env
```

Set the following environment variables in each `.env` file for users_events_service:

- **DATABASE_URL**: PostgreSQL connection string.
- **REDIS_HOST**: Redis connection string.
- **REDIS_PORT**: Redis connection string.
- **RABBITMQ_URL**: RabbitMQ connection string.
- **JWT_ACCESS_SECRET**: Jwt access secret token.
- **JWT_REFRESH_SECRET**: Jwt refresh secret token.
- **JWT_ACCESS_TTL**: Jwt access token expiry.
- **JWT_REFRESH_TTL**: Jwt refresh token expiry.

Set the following environment variables in each `.env` file for email_notification_service:

- **SMTP_USER**: Mail user name.
- **SMTP_PASSWORD**: Mail user password.
- **SMTP_PORT**: Mail Stmp port e.g 587, 465.
- **SMTP_HOST**: Mail host e.g smtp.gmail.com.
- **MAIL_FROM**: Mail Sender from.
- **RABBITMQ_URL**: RabbitMQ connection string.

Note: If you change any variable in the repo .env file, please be sure to adjust the value in the microservices .env file.
Also Ensure the services name specified in the docker-compose.yml file is used as the host

Example:

```env
DATABASE_URL=postgres://postgres:postgres@postgres:5432/task_assessment_db
REDIS_HOST=redis
REDIS_PORT=6379
RABBITMQ_URL=amqp://user:password@rabbitmq:5672
```

### Run with Docker

Build and run the application using Docker Compose:

```bash
docker-compose up --build
```
For newer versions of docker
```bash
docker compose up --build
```

This command will:
- Start both microservices.
- Initialize PostgreSQL, Redis, and RabbitMQ.

### Access the Services

- **User and Event Service**: `http://localhost:3000`
  - Swagger Documentation: `http://localhost:3000/api/docs`
- **Email Notification Service**: `http://localhost:3001`
  - Swagger Documentation: Does not expose any http method

## Microservices Overview

### User and Event Service
Handles user registration, authentication, event creation,
join requests, and request management.

- **Port**: `3000`
- **Dependencies**: PostgreSQL, Redis, RabbitMQ

### Email Notification Service
Manages email notifications for join requests and their
acceptance or rejection

- **Port**: `3001`
- **Dependencies**: RabbitMQ

## Endpoints

### User and Event Service

- **Swagger Doc** `http://localhost:3000/api/docs` 

### Email Notification Service

- Does not Expose Any Endpoint

## Testing

To ensure the stability and correctness of the application, unit tests is included.

### Run Tests

Navigate to a specific microservice directory and run the tests:

```bash
cd users_events_service
npm run test

cd email_notification_service
npm run test
```

