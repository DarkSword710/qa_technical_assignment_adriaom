const {test, expect} = require('@playwright/test');
import specPage from '../page_objects/specPage';

test.describe('QA Technical Assignment', () => {

    //VARIABLES
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

    //Item to buy in the inventory screen (starts at 0)
    const itemToBuy = 1;

    test.beforeAll(async () => {});

    //Checking that we are not logged in already before the test case
    test.beforeEach(async ({page}) => {

        //Go to the page
        await page.goto(link);

        //Fill in the login credentials and press the button (uncomment to test that the logout works)
        /*await page.getByPlaceholder('username').fill(username);
        await page.getByPlaceholder('password').fill(password);
        await page.getByRole('button', {name: 'login'}).click();*/

        //If for some reason you are redirected out of the login page, logout
        if(page.url() != link){
            await page.locator('id=react-burger-menu-btn').click();
            console.log(page.url());
            await page.getByText('logout').click();
        }

    });

    //I assumed this to be one big test case rather than several small ones because each test reloads the page,
    //which would make no sense since the buying process would be interrupted between each case
    test('FRONTEND', async ({page}) => {

        //LOGIN PAGE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Navigate to the page
        await page.goto(link);

        //Check that we did not get redirected because we were already logged in
        await expect(page).toHaveURL(link);

        //Fill in the login credentials and press the button
        await page.getByPlaceholder('username').fill(username);
        await page.getByPlaceholder('password').fill(password);
        await page.getByRole('button', {name: 'login'}).click();

        //INVENTORY PAGE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Waits for the inventory page to load and have the expected link
        await expect(page).toHaveURL(link+inventoryPath);

        //Items are NOT in ID order, since they get sorted alphabetically within the page by default. Second item alphabetically (Bike Light) is ID 0
        //Checking all the items with inventory-item-name as their data-test returns a list of all products in their current order. Click on the desired one
        await page.locator('data-test=inventory-item-name').nth(itemToBuy).click();

        //PDP (PRODUCT DETAILS PAGE)////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Would need to find the ID of the item in order to check this URL
        //await expect(page).toHaveURL(link+inventoryItemPath+inventoryItemQuery+);

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

        //Function that checks that the cart badge (the red circle with the number of items) updates accordingly.
        //Since the cart icon appears in most pages of the website I made it a function to not repeat the same 2 lines in all pages.
        async function checkCartBadge(){
            await expect(page.locator('data-test=shopping-cart-badge')).toBeVisible();
            await expect(page.locator('data-test=shopping-cart-badge')).toHaveText('1');
            return;
        }

        await checkCartBadge();

        await page.locator('data-test=shopping-cart-link').click();

        //CART PAGE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        await expect(page).toHaveURL(link+cartPath);

        //Check that the item is listed and that the cart still displays it, then go to checkout
        await checkCartBadge();

        await expect(page.getByText(itemName)).toBeVisible();

        await expect(page.locator('data-test=item-quantity')).toBeVisible();
        await expect(page.locator('data-test=item-quantity')).toHaveText('1');

        await page.getByRole('button', {name: 'checkout'}).click();

        //CHECKOUT STAGE ONE PAGE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        await expect(page).toHaveURL(link+checkoutPath_1);

        await checkCartBadge();

        //Fill in the information needed for checkout, then continue
        await page.getByPlaceholder('first name').fill(firstName);
        await page.getByPlaceholder('last name').fill(lastName);
        await page.getByPlaceholder('zip/postal code').fill(zipCode);

        await page.getByRole('button', {name: 'continue'}).click();

        //CHECKOUT STAGE 2 PAGE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        await expect(page).toHaveURL(link+checkoutPath_2);

        await checkCartBadge();

        //Check that the item is still listed before finishing the order
        await expect(page.getByText(itemName)).toBeVisible();

        await page.getByRole('button', {name: 'finish'}).click();

        //CHECKOUT COMPLETE PAGE///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        await expect(page).toHaveURL(link+checkoutPath_complete);

        //Check that the checkout process is displayed as complete
        await expect(page.getByText('Checkout: Complete!')).toBeVisible();

        //CHECKOUT COMPLETED!

    });

    test.afterAll(async () => {});

    test.afterEach(async ({page}) => {

    });
});
