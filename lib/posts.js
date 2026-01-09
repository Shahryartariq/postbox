import sql from "@/lib/db";
import { DELAY_COUNT } from "@/constants/index";

const delay = () => new Promise((resolve) => setTimeout(resolve, DELAY_COUNT));

export async function getPosts(maxNumber) {
  await delay();

  if (maxNumber) {
    return await sql`
      SELECT 
        posts.id,
        posts.image_url AS image,
        posts.title,
        posts.content,
        posts.created_at AS "createdAt",
        users.first_name AS "userFirstName",
        users.last_name AS "userLastName",
        COUNT(likes.post_id) AS likes
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      GROUP BY posts.id, users.id
      ORDER BY posts.created_at DESC
      LIMIT ${maxNumber};
    `;
  }

  return await sql`
    SELECT 
      posts.id,
      posts.image_url AS image,
      posts.title,
      posts.content,
      posts.created_at AS "createdAt",
      users.first_name AS "userFirstName",
      users.last_name AS "userLastName",
      COUNT(likes.post_id) AS likes
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id, users.id
    ORDER BY posts.created_at DESC;
  `;
}

export async function storePost(post) {
  const [createdPost] = await sql`
    INSERT INTO posts (image_url, title, content, user_id)
    VALUES (${post.imageUrl}, ${post.title}, ${post.content}, ${post.userId})
    RETURNING *;
  `;

  await delay();
  return createdPost;
}

export async function updatePostLikeStatus(postId, userId) {
  await delay();

  const [existing] = await sql`
    SELECT COUNT(*) AS count
    FROM likes
    WHERE post_id = ${postId} AND user_id = ${userId};
  `;

  if (existing.count === 0) {
    await sql`
      INSERT INTO likes (post_id, user_id)
      VALUES (${postId}, ${userId});
    `;
    return { liked: true };
  } else {
    await sql`
      DELETE FROM likes
      WHERE post_id = ${postId} AND user_id = ${userId};
    `;
    return { liked: false };
  }
}

export async function getPostById(postId) {
  await delay();

  const [post] = await sql`
    SELECT 
      posts.id,
      posts.image_url AS image,
      posts.title,
      posts.content,
      posts.created_at AS "createdAt",
      users.first_name AS "userFirstName",
      users.last_name AS "userLastName",
      COUNT(likes.post_id) AS likes
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.id = ${postId}
    GROUP BY posts.id, users.id;
  `;

  return post || null;
}
