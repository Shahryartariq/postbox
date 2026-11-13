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

test("after deleting a question, the home form is ready again", async ({ page }) => {
  // Same path a real user takes: no page reloads in between.
  await page.goto("/");
  await page.getByLabel("Your question").fill("Delete me right away");
  await page.getByRole("button", { name: "Create my link" }).click();
  await expect(page.getByText("Your link is ready. Share it anywhere.")).toBeVisible();

  await page.getByRole("button", { name: "Delete question" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);

  await expect(page.getByRole("button", { name: "Create my link" })).toBeVisible();
  await expect(page.getByLabel("Your question")).toHaveValue("");
});

test("public pages have no serious accessibility problems", async ({ page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const path of ["/", "/ideas", "/privacy", "/terms"]) {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${path}: ${v.id}`)).toEqual([]);
  }
});

test("an idea from /ideas lands in the question box", async ({ page }) => {
  await page.goto("/ideas");
  await page.getByRole("link", { name: "Ask this: Describe me in three words" }).click();
  await expect(page).toHaveURL(/\/\?q=/);
  await expect(page.getByLabel("Your question")).toHaveValue("Describe me in three words");
});

test("SEO basics: sitemap, robots, canonical, noindex on questions", async ({ page, request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap:");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/ideas", "/privacy", "/terms"]) expect(sitemap).toContain(p);
  expect(sitemap).not.toContain("/q/");

  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

  await page.getByLabel("Your question").fill("Is this page indexed?");
  await page.getByRole("button", { name: "Create my link" }).click();
  await expect(page.getByText("Your link is ready. Share it anywhere.")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
