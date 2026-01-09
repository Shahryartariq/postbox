"use server";

import { storePost } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  await storePost({
    imageUrl: "",
    title: title,
    content: content,
    userId: 1,
  });

  revalidatePath("/feed");

  redirect("/feed");
}
