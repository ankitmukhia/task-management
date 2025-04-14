import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { db, User } from "@repo/db";

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;
    if (eventType === "user.created") {
      const { id, email_addresses, image_url, first_name } = evt.data;
      const email = email_addresses[0]?.email_address!;

      // check 1
      await db.user.create({
        data: {
          clerkId: id,
          email,
          profilePic: image_url,
          name: first_name,
        },
      });
    }
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
