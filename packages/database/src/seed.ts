import { db, User, Task, Priority, TaskStatus } from "./index";

const tasks = [
  {
    title: "Design landing page",
    description: "Create initial mockups for the new product's landing page.",
    scheduledDate: new Date("2025-04-15T10:00:00Z"),
    durationMins: 90,
    priority: Priority.HIGH,
    status: TaskStatus.PENDING,
  },
  {
    title: "Team sync meeting",
    description: "Weekly catch-up with the product and dev teams.",
    scheduledDate: new Date("2025-04-16T14:30:00Z"),
    durationMins: 60,
    priority: Priority.MEDIUM,
    status: TaskStatus.IN_PROGRESS,
  },
  {
    title: "Code review session",
    description: "Review pull requests for the new authentication module.",
    scheduledDate: new Date("2025-04-17T09:00:00Z"),
    durationMins: 45,
    priority: Priority.LOW,
    status: TaskStatus.COMPLETED,
  },
];

async function main() {
  await db.$transaction(async (prisma) => {
    const user: User = await prisma.user.create({
      data: {
        clerkId: "user_29w83sxmDNGwOuEthce5gg56FcC",
        email: "example@gmail.com",
        name: "Example",
        profilePic: "https://www.gravatar.com/avatar?d=mp",
      },
    });

    for (const task of tasks) {
      (await prisma.task.create({
        data: {
          ...task,
          userId: user.id,
        },
      })) as Task;
    }
  });
  console.log("Example data successfully created!");
}

main()
  .then(async () => {
    await db.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await db.$disconnect();
  })
  .finally(async () => {
    await db.$disconnect();
  });
