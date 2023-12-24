
## Description

This Repo implements the Token bucket algorithm for request rate limitation, using NestJs and Redis.


## Installation

```bash
# Start a redis via docker:
$ docker run -p 6379:6379 -it redis/redis-stack-server:latest
```

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# Generate apiKey
$ localhost:3000/generate-api-key

# Test List movies using the generated key.
$ localhost:3000/movies?apiKey=KEY


