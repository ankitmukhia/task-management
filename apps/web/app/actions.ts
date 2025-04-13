"use server";

import { taskSchema } from "@/lib/defination";
import { createTest } from "./action";

export const createTask = async (
  state: any,
  formData: FormData,
  token: string,
) => {
  const { success, error, data } = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    due_date: new Date(formData.get("due_date")!.toString()),
  });

  if (!success) {
    return {
      message: "Error with schema.",
      error: error.format(),
    };
  }

  const res = await fetch("http://localhost:8080/create-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const jsonData = await res.json();
  console.log("json data: ", jsonData);
};

export const test = async () => {
  await createTest();
};
