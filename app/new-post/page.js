import { createPost } from "@/action/postAction";
import PostForm from "@/components/post-form";

export default function NewPostPage() {
  return <PostForm action={createPost} />;
}
