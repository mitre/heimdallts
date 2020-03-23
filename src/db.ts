import { init } from "heimdallts-db";
import { sleep } from "./utils";

export type Sequelize = ReturnType<typeof init>;
export const TEST_DB = "heimdallts_jest_testing_service_db";

// Bring up sequelize instance
let sequelize: Sequelize | null = null;
let ready: "dormant" | "syncing" | "ready" = "dormant";

/** Tricky, but we need a way to always have access to the current db, even if it hasn't been initialized yet!
 * Do this by checking readyness, and if not ready initializing and polling on that.
 */
export async function get_db(): Promise<Sequelize> {
  // If already initialized, go
  if (ready === "ready") {
    return sequelize!;
  } else if (ready === "dormant") {
    ready = "syncing";
    sequelize = init(
      "localhost",
      5432,
      process.env.DATABASE as string,
      process.env.DATABASE_USER as string,
      process.env.DATABASE_PASSWORD as string,
      false // console.log
    );
    if (process.env.DATABASE === TEST_DB) {
      // Additionally wipe the DB
      await sequelize.drop({ cascade: true });
    }
    return sequelize.sync({ force: false }).then(s => {
      ready = "ready";
      return s;
    });
  } else {
    return sleep(500).then(() => get_db());
  }
}
