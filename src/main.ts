import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// eslint-disable-next-line
// @ts-ignore
import * as helmet from "helmet";
import { urlencoded, json } from "express";
import { get_db } from "./db";

if (
  !(
    process.env.DATABASE &&
    process.env.DATABASE_USER &&
    process.env.DATABASE_PASSWORD &&
    process.env.JWT_SECRET
  )
) {
  console.error(
    "Must set env flags DATABASE, DATABASE_USER, DATABASE_PASSWORD, JWT_SECRET"
  );
  process.exit(1);
}

async function bootstrap_server(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.enableCors();
  await app.listen(8050);
}

// Initialize our connections
get_db().then(bootstrap_server);
