import 'server-only'
import { db } from '@repo/db'

export async function createTest() {
  try {
    await db.test.create({
      data: {
        test: "test example",
        testname: "test Name",
      },
    });
  } catch (error) {
    console.error("error testing: ", error);
    console.log("something went wrong");
  }
}
