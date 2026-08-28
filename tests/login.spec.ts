import { test, expect } from '../fixtures/base';
import { USERS, INVALID_CREDENTIALS, NONEXISTENT_USER } from '../test-data/users';

test.describe('Login', () => {
  test('TC-01 valid user can log in and reach the inventory page', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('TC-02 locked-out user is blocked with a clear error message', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);

    // Negative scenario #1
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('TC-03 [negative] invalid password is rejected', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(INVALID_CREDENTIALS.username, INVALID_CREDENTIALS.password);

    // Negative scenario #2
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('TC-04 [negative] nonexistent username is rejected', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(NONEXISTENT_USER.username, NONEXISTENT_USER.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('TC-05 [negative] empty credentials show a required-field error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});
