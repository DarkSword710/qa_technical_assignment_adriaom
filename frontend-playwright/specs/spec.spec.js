const {test, expect} = require('@playwright/test');
import specPage from '../page_objects/specPage';

test.describe('QA Technical Assignment', () => {

  //Need to find out how to ensure that I am logged out every iteration
  test.beforeAll(async () => {});

  test.beforeEach(async ({page}) => {

  });

  test('FRONTEND', async ({page}) => {

    // Navigate to the page
    await page.goto('https://www.saucedemo.com/');
    //Fill in the username field (need to make variable for the fill data)
    await page.locator('#user-name').fill('standard_user');
    //Fill in the password field (need to make variable for the fill data)
    await page.locator('#password').fill('secret_sauce');
    //Click the log in button (could be filtered better)
    await page.getByRole('button').click();
    //Waits for the inventory page to load
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    //Items are NOT in ID order, since they get sorted alphabetically within the page. Second item (Bike Light) is ID 0
    await page.locator('#item_0_title_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=0');
    //await page.getByRole();


  });

  test.afterAll(async () => {});

  test.afterEach(async ({page}) => {

  });
});
