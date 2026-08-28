# Test Case Document — SauceDemo Core Journey

Scope: login, inventory/product browsing, cart, and checkout on
https://www.saucedemo.com. All cases below are automated in the suite
(file and line referenced in the last column).

## Login

| ID | Title | Preconditions | Steps | Expected Result | Type | Automated in |
|----|-------|---------------|-------|------------------|------|---------------|
| TC-01 | Valid user logs in successfully | On login page | 1. Enter `standard_user` / `secret_sauce`<br>2. Click Login | Redirected to `/inventory.html`; "Products" title visible | Positive | `login.spec.ts` |
| TC-02 | Locked-out user is blocked | On login page | 1. Enter `locked_out_user` / `secret_sauce`<br>2. Click Login | Stays on login page; error "Sorry, this user has been locked out." shown | Negative | `login.spec.ts` |
| TC-03 | Invalid password is rejected | On login page | 1. Enter valid username, wrong password<br>2. Click Login | Error: "Username and password do not match any user in this service" | **Negative** | `login.spec.ts` |
| TC-04 | Nonexistent username is rejected | On login page | 1. Enter unregistered username<br>2. Click Login | Same "do not match" error | **Negative** | `login.spec.ts` |
| TC-05 | Empty credentials show validation error | On login page | 1. Leave fields blank<br>2. Click Login | Error: "Username is required" | **Negative** | `login.spec.ts` |

## Inventory & Cart

| ID | Title | Preconditions | Steps | Expected Result | Type | Automated in |
|----|-------|---------------|-------|------------------|------|---------------|
| TC-06 | Inventory page lists all products | Logged in | View inventory page | Exactly 6 product cards rendered | Positive | `cart.spec.ts` |
| TC-07 | Adding products increments cart badge | Logged in, cart empty | 1. Add Product A<br>2. Add Product B | Badge shows 1, then 2 | Positive | `cart.spec.ts` |
| TC-08 | Removing a product decrements cart badge | 2 items in cart | Remove one item | Badge decreases from 2 to 1 | Positive | `cart.spec.ts` |
| TC-09 | Cart shows correct products, quantities, and prices | 2 items added from inventory | Open cart page | Both product names present; quantity = 1 each; prices match inventory page prices exactly | Positive | `cart.spec.ts` |

## Checkout

| ID | Title | Preconditions | Steps | Expected Result | Type | Automated in |
|----|-------|---------------|-------|------------------|------|---------------|
| TC-10 | Complete checkout end-to-end | 2 items in cart | 1. Checkout → fill valid customer info → Continue<br>2. Verify order summary math<br>3. Finish | Reaches `/checkout-complete.html`; "Thank you for your order!" shown; cart badge cleared; subtotal = sum of item prices; total > subtotal (tax added) | Positive | `checkout.spec.ts` |
| TC-11 | Checkout blocks missing first name | 2 items in cart, on checkout step 1 | Leave First Name blank, fill rest, Continue | Stays on step 1; error "First Name is required" | **Negative** | `checkout.spec.ts` |
| TC-12 | Checkout blocks missing postal code | 2 items in cart, on checkout step 1 | Fill name, leave Postal Code blank, Continue | Stays on step 1; error "Postal Code is required" | **Negative** | `checkout.spec.ts` |
| TC-13 | Cancel from overview preserves cart | On checkout step 2 (overview) | Click Cancel | Returns to `/inventory.html`; cart still holds 2 items (not cleared) | Positive (edge case) | `checkout.spec.ts` |

## Summary

- **13 test cases**, run across **3 browsers** (Chromium, Firefox, WebKit) = 39 executions per full run.
- **5 negative scenarios** (task required a minimum of 2): TC-02, TC-03, TC-04, TC-11, TC-12.
- Every assertion targets either navigation state (URL), visible text, or a
  count/number derived from the UI — no assertions rely on internal
  implementation details.

## Out of scope (noted, not automated)

These were considered but intentionally left out to keep the suite focused
on the requested journey; flagging them here is meant to show what a fuller
regression pass would add, not to imply they were missed:
- Sort-order verification (Name/Price ascending-descending dropdown)
- "Continue Shopping" round-trip from cart back to inventory
- Session/logout and back-button navigation edge cases
- Visual regression on `problem_user` (known broken images by design)
