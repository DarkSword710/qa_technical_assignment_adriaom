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
    const cartPath = 'cart.html';
    const checkoutPath_1 = 'checkout-step-one.html';
    const checkoutPath_2 = 'checkout-step-two.html';
    const checkoutPath_complete = 'checkout-complete.html';
    
    //Login credentials
    const username = 'standard_user';
    const password = 'secret_sauce';

    //Buyer info
    const firstName = 'Adrià';
    const lastName = 'Ortiz';
    const zipCode = '00000';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Navigate to the page
    await page.goto(link);

    //Fill in the login credentials and press the button
    await page.getByPlaceholder('username').fill(username);
    await page.getByPlaceholder('password').fill(password);
    await page.getByRole('button', {name: 'login'}).click();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Waits for the inventory page to load
    await expect(page).toHaveURL(link+inventoryPath);

    //Items are NOT in ID order, since they get sorted alphabetically within the page. Second item (Bike Light) is ID 0
    await page.locator('data-test=inventory-item-name').nth(1).click();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Would need to find the ID of the item in order to check this URL
    //await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=0');

    //Check that the item has a name title, description and price and that they are visible and have text in them
    const titleLocator = page.locator('data-test=inventory-item-name');
    const descLocator = page.locator('data-test=inventory-item-desc');
    const priceLocator = page.locator('data-test=inventory-item-price');

    await expect(titleLocator).toBeVisible();
    await expect(titleLocator).not.toBeEmpty();

    await expect(descLocator).toBeVisible();
    await expect(descLocator).not.toBeEmpty();

    await expect(priceLocator).toBeVisible();
    await expect(priceLocator).not.toBeEmpty();

    //Store the product name to use for checking later

    const itemName = await titleLocator.textContent();
    //console.log(itemName);

    //Add the item to cart, check that both the button and the cart change accordingly, then go to the cart
    await page.getByRole('button', {name: 'add to cart'}).click();

    await expect(page.getByRole('button', {name: 'add to cart'})).toBeHidden();
    await expect(page.getByRole('button', {name: 'remove'})).toBeVisible();

    await expect(page.locator('data-test=shopping-cart-badge')).toBeVisible();
    await expect(page.locator('data-test=shopping-cart-badge')).toHaveText('1');

    await page.locator('data-test=shopping-cart-link').click();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    await expect(page).toHaveURL(link+cartPath);

    //Check that the item is listed and that the cart still displays it, then go to checkout
    await expect(page.locator('data-test=shopping-cart-badge')).toBeVisible();
    await expect(page.locator('data-test=shopping-cart-badge')).toHaveText('1');

    await expect(page.getByText(itemName)).toBeVisible();

    await expect(page.locator('data-test=item-quantity')).toBeVisible();
    await expect(page.locator('data-test=item-quantity')).toHaveText('1');

    await page.getByRole('button', {name: 'checkout'}).click();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    await expect(page).toHaveURL(link+checkoutPath_1);

    await page.getByPlaceholder('first name').fill(firstName);
    await page.getByPlaceholder('last name').fill(lastName);
    await page.getByPlaceholder('zip/postal code').fill(zipCode);

    await page.getByRole('button', {name: 'continue'}).click();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    await expect(page).toHaveURL(link+checkoutPath_2);

    await page.getByRole('button', {name: 'finish'}).click();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    await expect(page).toHaveURL(link+checkoutPath_complete);

    //PURCHASE COMPLETED!

  });

  test.afterAll(async () => {});

  test.afterEach(async ({page}) => {

  });
});
