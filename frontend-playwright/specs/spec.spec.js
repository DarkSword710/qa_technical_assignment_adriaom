const {test, expect} = require('@playwright/test');
import specPage from '../page_objects/specPage';

test.describe('QA Technical Assignment', () => {

  //Need to find out how to ensure that I am logged out every iteration
  test.beforeAll(async () => {});

  test.afterEach(async ({page}) => {

  });

  test('FRONTEND', async ({page}) => {

    // Navigate to the page
    await page.goto('https://www.saucedemo.com/');
    //Fill in the username field (make variable for the fill data)
    await page.locator('#user-name').fill('standard_user');
    //Fill in the password field (need to make variable for the fill data)
    await page.locator('#password').fill('secret_sauce');
    //Click the log in button (could be filtered better)
    await page.getByRole('button').click();
    //await page.waitForURL('https://www.saucedemo.com/inventory.html');
    //await page.getByRole('button').click();

  });

  test.afterAll(async () => {});

  test.afterEach(async ({page}) => {

  });
});
