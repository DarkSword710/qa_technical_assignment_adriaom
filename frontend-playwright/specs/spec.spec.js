const {test, expect} = require('@playwright/test');
import specPage from '../page_objects/specPage';

test.describe('QA Technical Assignment', () => {

  //Need to find out how to ensure that I am logged out every iteration
  test.beforeAll(async () => {});

  test.beforeEach(async ({page}) => {

  });

  test('FRONTEND', async ({page}) => {

    //Links and paths
    const link = 'https://www.saucedemo.com/';
    const inventoryPath = 'inventory.html';
    const inventoryItemPath = 'inventory-item.html';
    const inventoryItemQuery = '?id=';
    
    //Login credentials
    const username = 'standard_user';
    const password = 'secret_sauce';

    //Navigate to the page
    await page.goto(link);
    //Fill in the login credentials and press the button
    await page.getByPlaceholder('username').fill(username);
    await page.getByPlaceholder('password').fill(password);
    await page.getByRole('button', {name: 'login'}).click();
    //Waits for the inventory page to load
    await expect(page).toHaveURL(link+inventoryPath);
    //Items are NOT in ID order, since they get sorted alphabetically within the page. Second item (Bike Light) is ID 0
    await page.locator('data-test=inventory-item-name').nth(1).click();
    //await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=0');
    //Check that the item has a name title, description and price and that they are visible
    const titleLocator = page.locator('data-test=inventory-item-name');
    const descLocator = page.locator('data-test=inventory-item-desc');
    const priceLocator = page.locator('data-test=inventory-item-price');

    await expect(titleLocator).toBeVisible();
    await expect(descLocator).toBeVisible();
    await expect(priceLocator).toBeVisible();
    await expect(page.getByRole('button', {name: 'add to cart'})).toBeVisible();

  });

  test.afterAll(async () => {});

  test.afterEach(async ({page}) => {

  });
});
