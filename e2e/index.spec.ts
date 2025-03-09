import { test, expect } from "@playwright/test";

// 🧑‍🏫 Add your e2e tests here

test.describe.serial("Todo tests", () => {
  test.afterEach(async ({ request }) => {
    await request.delete("/api/todos?reset=true"); 
  });
  test.beforeEach(async ({ request }) => {
    await request.delete("/api/todos?reset=true"); // using a standard
  });

  test("should navigate to index page and have correct title", async ({
    page,
  }) => {
    // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts) 
    await page.goto("/");
    // The page should contain a title element with the text "TODO 📃"
    await expect(page.title()).resolves.toMatch("TODO 📃");
  });


  // Test that validates the TODO list is empty
  test("should display an empty TODO list", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("ul li")).toHaveCount(0);
  });


  // Test that adds a new item to the list
  test("should add a new item to the TODO list", async ({ page }) => {
    await page.goto("/");

    await page.fill('input[placeholder="Add a new todo..."]', "FIEN");
    await page.click('button:has-text("Add ✨")');

    await expect(page.locator("ul li").last()).toContainText("FIEN");
  });

  // Test that removes one item from the list
  test("should add a second item to the TODO list independently", async ({ page }) => {
    await page.goto("/");
  
    await page.fill('input[placeholder="Add a new todo..."]', "FIEN");
    await page.click('button:has-text("Add ✨")');
  
    await expect(page.locator("ul li")).toHaveCount(1);
  
    await page.fill('input[placeholder="Add a new todo..."]', "Sing the Blues");
    await page.click('button:has-text("Add ✨")');
  
    await expect(page.locator("ul li")).toHaveCount(2);
  
    await expect(page.locator("ul li")).toContainText(["FIEN", "Sing the Blues"]);
  });
  test("should remove one item from the TODO list", async ({ page }) => {
    await page.goto("/");
  
    await page.fill('input[placeholder="Add a new todo..."]', "FIEN");
    await page.click('button:has-text("Add ✨")');
    await page.fill('input[placeholder="Add a new todo..."]', "Sing the Blues");
    await page.click('button:has-text("Add ✨")');
    await expect(page.locator("ul li")).toHaveCount(2, { timeout: 10000 });
      
    await page.locator("ul li").first().locator('button:has-text("Delete 🗑️")').click();
  
    await expect(page.locator("ul li")).toHaveCount(1);
  });

});