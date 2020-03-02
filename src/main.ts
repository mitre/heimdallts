import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// eslint-disable-next-line
// @ts-ignore
import * as helmet from "helmet";
import { init } from "hdf-db-sequelize";
import { urlencoded, json } from "express";
import { MulterModule } from "@nestjs/platform-express";
import passport = require("passport");

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

// Bring up sequelize instance
async function bootstrap_db(): Promise<void> {
  const sequelize = init(
    "localhost",
    5432,
    process.env.DATABASE as string,
    process.env.DATABASE_USER as string,
    process.env.DATABASE_PASSWORD as string,
    false
  );
  await sequelize.sync({ force: false });
}

async function bootstrap_server(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.enableCors();
  await app.listen(8050);
}

bootstrap_db().then(bootstrap_server);
