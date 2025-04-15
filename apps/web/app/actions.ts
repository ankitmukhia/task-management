"use server";

import { taskSchema, promptSchema } from "@/lib/defination";
import { apiUrl } from "@/lib/constants";

export const createTask = async (
  state: any,
  formData: FormData,
  token: string,
) => {
  const { success, error, data } = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    scheduledDate: new Date(formData.get("scheduledDate")!.toString()),
    priority: formData.get("priority"),
    status: formData.get("status"),
    durationMins: Number(formData.get("durationMins")),
  });

  if (!success) {
    return {
      message: "Error with schema.",
      error: error.format(),
    };
  }

  const res = await fetch(`${apiUrl}/task/create-task`, {
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

export const prompted = async (state: any, formData: FormData, token: string) => {
  const { success, error, data } = promptSchema.safeParse({
    prompt: formData.get("prompt"),
  });

  if (!success) {
    return {
      message: "Error with schema.",
      error: error.format(),
    };
  }

  const res = await fetch(`${apiUrl}/ai/prompt`, {
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
