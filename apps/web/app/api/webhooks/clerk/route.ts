import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { db } from "@repo/db";

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;
    if (eventType === "user.created") {
      const { id, email_addresses, image_url, first_name } = evt.data;
      // expression linting issue
      const email = email_addresses[0]?.email_address;

      if (!email) {
        throw new Error("Email doesn't existst.");
      }

      // check 1
      await db.user.upsert({
        create: {
          clerkId: id,
          email,
          profilePic: image_url,
          name: first_name,
        },
        update: {
          name: first_name,
        },
        where: {
          clerkId: id,
          email,
          profilePic: image_url,
          name: first_name,
        },
      });
    }
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    // console.error("Error verifying webhook:", err);
    console.log(err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
