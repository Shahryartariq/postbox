"use server";

import { storePost } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(prevstate, formData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  let errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title us required");
  }

  if (!content || content.trim().length === 0) {
    errors.push("Content us required");
  }

  if (!image || image.size === 0) {
    errors.push("Image is required");
  }

  if (errors.length > 0) {
    return { errors };
  }

  await storePost({
    imageUrl: "",
    title: title,
    content: content,
    userId: 1,
  });

  revalidatePath("/feed");
  redirect("/feed");
}
