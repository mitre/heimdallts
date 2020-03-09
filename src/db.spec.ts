import { get_db, TEST_DB } from "./db";

describe("Database", () => {
  it(`should have env variable set to "${TEST_DB}"`, () => {
    expect(process.env.DATABASE).toBe(TEST_DB);
  });

  it("should be respected by sequelize", async () => {
    let db = await get_db();
    expect(db.config.database).toBe(TEST_DB);
  });
});
