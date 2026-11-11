import { expect, test } from "@playwright/test";

// Runs against the Firebase emulators with the real security rules:
//   pnpm test:e2e
test("ask, answer anonymously, see it live, close the question", async ({ browser }) => {
  // The asker and the person answering are two separate browsers.
  const askerCtx = await browser.newContext();
  const asker = await askerCtx.newPage();
  await asker.goto("/");

  await asker.getByRole("button", { name: "Who loves me?" }).click();
  await expect(asker.getByLabel("Your question")).toHaveValue("Who loves me?");
  await asker.getByRole("button", { name: "Create my link" }).click();

  await expect(asker).toHaveURL(/\/q\/[2-9a-hjkmnp-z]{8}\?new=1$/);
  await expect(asker.getByRole("heading", { level: 1 })).toHaveText("Who loves me?");
  await expect(asker.getByText("Your link is ready. Share it anywhere.")).toBeVisible();
  const link = await asker.getByLabel("Share link").inputValue();
  await expect(asker.getByText("No answers yet. Share your link")).toBeVisible();

  const visitorCtx = await browser.newContext();
  const visitor = await visitorCtx.newPage();
  await visitor.goto(link);
  await expect(visitor.getByRole("heading", { level: 1 })).toHaveText("Who loves me?");
  // Visitors can't manage the question.
  await expect(visitor.getByText("Share your link")).toHaveCount(0);

  await visitor.getByLabel("Your answer").fill("Everyone in the hostel, obviously");
  await visitor.getByRole("button", { name: "Send anonymously" }).click();
  await expect(visitor.getByText("Sent. Your answer is on the wall")).toBeVisible();

  // Shows up for the asker in realtime, without a reload.
  await expect(asker.getByText("Everyone in the hostel, obviously")).toBeVisible();
  await expect(asker.getByText("1 answer", { exact: true })).toBeVisible();

  // A second answer straight away is rate-limited.
  await visitor.getByLabel("Your answer").fill("Me too");
  await visitor.getByRole("button", { name: "Send anonymously" }).click();
  await expect(visitor.getByText("Wait 10 seconds before sending another")).toBeVisible();

  // Asker closes it; the visitor's page updates live.
  await asker.getByRole("button", { name: "Stop taking answers" }).click();
  await expect(visitor.getByText("This question isn't taking answers anymore.")).toBeVisible();

  // Asker deletes an answer.
  await asker.getByRole("button", { name: "Delete this answer" }).click();
  await expect(visitor.getByText("Everyone in the hostel, obviously")).toHaveCount(0);

  // The asker's home page lists the question.
  await asker.goto("/");
  await expect(asker.getByRole("link", { name: /Who loves me\?/ })).toBeVisible();

  // Delete the whole question.
  await asker.goto(link);
  await asker.getByRole("button", { name: "Delete question" }).click();
  await asker.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(asker).toHaveURL(/\/$/);
  await expect(visitor.getByText("This question was deleted.")).toBeVisible();
});

test("unknown links show a clear not-found page", async ({ page }) => {
  await page.goto("/q/zzzz2345");
  await expect(page.getByText("There's no question at this link.")).toBeVisible();
});
