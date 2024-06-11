// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://www.automationpractice.pl/index.php');
});

const EMAILS = [
  'blabla@123',
  `testmarijaspasovska123@gmail.com`
];

const LAST_NAMES = [
  "1234",
  "Spasovska"
];

const PASSWORDS = [
  "1234",
  "12345"
]


test.describe('Creating account on My Shop website', () => {
  test('create account and validate error validation messages', async ({ page }) => {
    // create a new login locator and click
    const login = page.locator('a:has-text("Sign in")');
    await login.click();

    // validate header
    const authHeader = page.locator('.page-heading');
    await expect(authHeader).toHaveText("Authentication");

    // create e-mail and create button locators
    const emailCreate = page.locator('#email_create');
    const submitBtn = page.locator('#SubmitCreate');

    // fill in the e-mail with first e-mail item
    await emailCreate.fill(EMAILS[0]);
    await submitBtn.click();

    // validate invalid e-mail validation message
    const errorCreateAccount = page.locator('#create_account_error');
    await expect(errorCreateAccount).toHaveText("Invalid email address.");

    // clear e-mail field and fill in with the second e-mail item
    await emailCreate.fill('');
    await emailCreate.fill(EMAILS[1]);
    await submitBtn.click();

    // click on register button 
    const submitCreatingAccount = page.locator('#submitAccount');
    await expect(submitCreatingAccount).toHaveText("Register");
    await submitCreatingAccount.click();

    // validation error messages
    const validationErrors = page.locator('.alert.alert-danger');
    await expect(validationErrors).toContainText("lastname is required.");
    await expect(validationErrors).toContainText("firstname is required.");
    await expect(validationErrors).toContainText("passwd is required.");

    // create registration input fields locators
    const firstNameInput = page.locator('#customer_firstname');
    const lastNameInput = page.locator('#customer_lastname');
    const passwordinput = page.locator('#passwd');

    // fill in the fields with valid and invalid data
    await firstNameInput.fill("Marija");
    await lastNameInput.fill(LAST_NAMES[0]);
    await passwordinput.fill(PASSWORDS[0]);
    await submitCreatingAccount.click();

    // validate error messages
    await expect(validationErrors).toContainText("lastname is invalid.");
    await expect(validationErrors).toContainText("passwd is invalid.");

    // fill in the fields with valid data only
    await lastNameInput.fill('');
    await lastNameInput.fill(LAST_NAMES[1]);
    await passwordinput.fill('');
    await passwordinput.fill(PASSWORDS[1]);
    await submitCreatingAccount.click();

    // validate successful registration
    const alertForSuccessRegistration = page.locator('.alert.alert-success');
    await expect(alertForSuccessRegistration).toHaveText(" Your account has been created. ");

  });

});

test.describe('Forgot password on existing account validations', () => {
  test('forgot password validations', async ({ page }) => {

    // click on Sign in button
    await page.click('a.login');

    // fill in e-mail field with registered e-mail
    const email = page.locator('#email');
    await email.fill(EMAILS[1]);

    // click on "Forgot your password?" link
    const forgotPassword = page.locator('.lost_password a');
    await forgotPassword.click();

    // enter invalid e-mail
    await email.fill(EMAILS[0]);

    // click on Retrieve password button
    await page.click('button.btn.btn-default.button.button-medium');

    // wait for validation message to appear
    await page.waitForSelector('.alert.alert-danger');
    const validationErrors = page.locator('.alert.alert-danger');

    // validation of error messages
    await expect(validationErrors).toContainText("Invalid email address.");

    // enter valid e-mail
    await email.fill(EMAILS[1]);

    // click on Retrieve password button
    await page.click('button.btn.btn-default.button.button-medium');

    // verify confirmation message appears
    await page.waitForSelector('.alert.alert-success');
    const validationSuccess = page.locator('.alert.alert-success');

    // validation of success message
    await expect(validationSuccess).toContainText(`A confirmation email has been sent to your address: ${EMAILS[1]}`);

  });
});

test.describe('Adding Addresses', () => {
  test('adding first address on an already existing account on My Shop', async ({ page }) => {
    // create a new login locator and click
    const login = page.locator('a:has-text("Sign in")');
    await login.click();

    // validate header
    const authHeader = page.locator('.page-heading');
    await expect(authHeader).toHaveText("Authentication");

    // fill in e-mail field with registered e-mail
    const email = page.locator('#email');
    await email.fill(EMAILS[1]);

    // fill in password field with registered password
    const password = page.locator('#passwd');
    await password.fill(PASSWORDS[1]);

    // click on login button
    const loginButton = page.locator('#SubmitLogin');
    await loginButton.click();

    //click on add my first address button
    const addNewAddress = page.locator('a[href="http://www.automationpractice.pl/index.php?controller=address"]');
    await addNewAddress.click();

    // input all required fields
    await page.fill('input#firstname', 'Marija');
    await page.fill('input#lastname', 'Spasovska');
    await page.fill('input#address1', 'Bulevar Partizanski Odredi');
    await page.fill('input#city', 'Skopje');
    await page.fill('input#postcode', '35013');
    await page.selectOption('select#id_state', { value: '1' });
    await page.fill('input#phone', '123');

    // click on Save button
    await page.click('button[name="submitAddress"]');

    // validate my addresses header
    const myAddressesHeader = page.locator('.page-heading');
    await expect(myAddressesHeader).toHaveText("My addresses");

    const newAddressBox = page.locator('.col-xs-12.col-sm-6.address');
    const addressText = await newAddressBox.textContent();
    if (!addressText?.includes('Marija Spasovska') ||
      !addressText.includes('Bulevar Partizanski Odredi') ||
      !addressText.includes('Skopje') ||
      !addressText.includes('Alabama') ||
      !addressText.includes('35013') ||
      !addressText.includes('United States') ||
      !addressText.includes('123')) {
      console.error('Newly added address details are not displayed correctly.');
    } else {
      console.log('Newly added address details verified:', addressText);
    }

    // verify Update and Delete buttons below the address
    const updateButton = await page.$('a[title="Update"]');
    if (updateButton) {
      console.log('Update button found.');
    } else {
      console.log('Update button not found.');
    }

    const deleteButton = await page.$('a[title="Delete"]');
    if (deleteButton) {
      console.log('Delete button found.');
    } else {
      console.log('Delete button not found.');
    }

  });
});

test.describe('Adding items to cart', () => {
  test('adding products to cart and then remove it', async ({ page }) => {

    // Hover over the Dresses link
    const dresses = page.locator('a.sf-with-ul[title="Dresses"]').nth(1);
    await dresses.hover();

    // const eveningDressesLinks = await page.$$('a[title="Evening Dresses"]');
    await page.waitForTimeout(500);
    const eveningDresses = page.locator('a[title="Evening Dresses"]').nth(1);
    await eveningDresses.click();

    // hover over the listed dress and click on More button
    const printedDress = page.locator('a[title="Printed Dress"]').nth(1);
    await printedDress.hover();
    await page.waitForTimeout(500);
    const moreButton = page.locator('a.button.lnk_view[title="View"]').nth(0);
    await moreButton.click();

    // verify warning message block
    await page.waitForTimeout(1000);
    const availabilityMessage = page.locator('#availability_value');
    await expect(availabilityMessage).toHaveText('This product is no longer in stock with those attributes but is available with others.');

    // click on the Size drop down and choose M size
    await page.selectOption('select#group_1', '2');

    // verify dress is available message
    await expect(availabilityMessage).toHaveText('In stock');

    // verify Add to cart button appeared
    await expect(page.locator('#add_to_cart')).toBeVisible();

    // click on Add to cart button
    // await page.waitForSelector('#add_to_cart button[type="submit"]');
    const addToCartBtn = page.locator('#add_to_cart button[type="submit"]').nth(0);
    await addToCartBtn.click();

    // verify message "Product successfully added to your shopping cart"
    await page.waitForTimeout(500);
    const successfullyAddedItemToCartMessage = page.locator('.layer_cart_product');
    await expect(successfullyAddedItemToCartMessage).toContainText('Product successfully added to your shopping cart');

    // click on Cancel button
    await page.click('.cross');

    // hover over the Cart button in the right top corner
    const shoppingCart = page.locator('a[title="View my shopping cart"]');
    await page.waitForTimeout(500);
    await shoppingCart.hover();

    // verify Checkout button is enabled
    const checkoutButton = page.locator('#button_order_cart');
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();

    // verify quantity is correct (1)
    await expect(page.locator('.cart_quantity_input.form-control')).toHaveValue('1');

    // verify unit price is correct
    await expect(page.locator('.price .price')).toHaveText('$51');

    // verify total price is correct
    await expect(page.locator('.cart_total .price')).toHaveText('$51');

    // hover over Cart button again
    await page.waitForTimeout(500);
    await shoppingCart.hover();

    // click on X button to remove the item from Cart
    await page.waitForTimeout(500);
    await page.click('a.ajax_cart_block_remove_link');

    // verify item is removed from Cart and cart is empty
    await expect(page.locator('a[title = "View my shopping cart"]')).toContainText('empty');

  });
});
