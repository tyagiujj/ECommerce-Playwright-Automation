import { Page, Locator } from '@playwright/test';

export class CartAndCheckOutPage {
    private readonly page: Page;
    private readonly ProceedToCheckoutButton: Locator;
    private readonly registerAndLoginLink: Locator;
    private readonly addressDetailsHeading: Locator;
    private readonly deliveryAddress: Locator;
    private readonly billingAddress: Locator;
    private readonly reviewYourOrderHeading: Locator;
    private readonly orderTable: Locator;
    private readonly orderProducts: Locator;
    private readonly commentTextArea: Locator;
    private readonly placeOrderButton: Locator;
    private readonly nameOnCard: Locator;
    private readonly cardNumber: Locator;
    private readonly cvvNumber: Locator;
    private readonly ExpirationMonth: Locator;
    private readonly ExpirationYear: Locator;
    private readonly payAndConfirmOrderButton: Locator;
    private readonly orderSuccessMessage: Locator;
    private readonly removeProductButton: Locator;
    private readonly cartIsEmptyMessage : Locator;

    constructor(page: Page) {
        this.page = page;
        this.ProceedToCheckoutButton = page.getByText('Proceed To Checkout', { exact: true });
        this.registerAndLoginLink = page.getByText('Register / Login', { exact: true });

        // Checkout Page
        this.addressDetailsHeading = page.getByRole('heading', { name: 'Address Details' });
        this.deliveryAddress = page.locator("#address_delivery");
        this.billingAddress = page.locator("#address_invoice");
        this.reviewYourOrderHeading = page.getByRole('heading', { name: 'Review Your Order' });
        this.orderTable = page.locator("#cart_info table");
        this.orderProducts = page.locator("#cart_info tbody tr[id^='product-']");
        this.commentTextArea = page.locator("textarea[name='message']");
        this.placeOrderButton = page.locator("a.check_out[href='/payment']");

        // Name on Card
        this.nameOnCard = page.locator("//input[@name='name_on_card']");

        // Card Number
        this.cardNumber = page.locator('[name="card_number"]');

        // CVV Number
        this.cvvNumber = page.getByRole('textbox', { name: 'ex. 311' });

        // Expiration Month
        this.ExpirationMonth = page.getByRole('textbox', { name: 'MM' });

        // Expiration Year
        this.ExpirationYear = page.getByRole('textbox', { name: 'YYYY' });

        // Pay and Confirm Order Button
        this.payAndConfirmOrderButton = page.getByRole('button', { name: 'Pay and Confirm Order' });

        // Order Success Message
        this.orderSuccessMessage = page.locator('[data-qa="order-placed"]');

        // Remove Product Button
       this.removeProductButton = page.locator("a.cart_quantity_delete");

        // Cart is Empty Message
        this.cartIsEmptyMessage = page.getByText('Cart is empty! Click here to buy products.', { exact: true });
    }

    async ClickOnProceedToCheckoutButton() {
        await this.ProceedToCheckoutButton.click();
    }

    async ClickOnRegisterAndLoginLink() {
        await this.registerAndLoginLink.click();
    }

    // Verify Address Details Heading
    async GetAddressDetailsHeading(): Promise<Locator> {
        return this.addressDetailsHeading;
    }

    // Verify Delivery Address
    async GetDeliveryAddress(): Promise<Locator> {
        return this.deliveryAddress;
    }

    // Verify Billing Address
    async GetBillingAddress(): Promise<Locator> {
        return this.billingAddress;
    }

    // Verify Review Your Order Heading
    async GetReviewYourOrderHeading(): Promise<Locator> {
        return this.reviewYourOrderHeading;
    }

    // Verify Order Table
    async GetOrderTable(): Promise<Locator> {
        return this.orderTable;
    }

    // Verify Products exist in Order
    async VerifyProductsPresentInOrder(): Promise<void> {
        const count = await this.orderProducts.count();

        if (count === 0) {
            throw new Error("No products found in Review Your Order section.");
        }

        console.log(`Products found in Review Order : ${count}`);

        for (let i = 0; i < count; i++) {
            await this.orderProducts.nth(i).scrollIntoViewIfNeeded();
            await this.orderProducts.nth(i).waitFor({ state: "visible" });

            const productName = await this.orderProducts
                .nth(i)
                .locator(".cart_description h4")
                .textContent();

            console.log(`Product ${i + 1}: ${productName?.trim()}`);
        }
    }

    // Get Comment Text Area
    async GetCommentTextArea(): Promise<Locator> {
        return this.commentTextArea;
    }

    // Enter Comment
    async EnterComment(comment: string): Promise<void> {
        await this.commentTextArea.fill(comment);
    }

    // Get Place Order Button
    async GetPlaceOrderButton(): Promise<Locator> {
        return this.placeOrderButton;
    }

    // Click Place Order
    async ClickPlaceOrderButton(): Promise<void> {
        await this.placeOrderButton.click();
    }

    async EnterNameOnCard(name: string): Promise<void> {
        await this.nameOnCard.fill(name);
    }

    async EnterCardNumber(cardNumber: string): Promise<void> {
        await this.cardNumber.fill(cardNumber);
    }

    async EnterCVVNumber(cvvNumber: string): Promise<void> {
        await this.cvvNumber.fill(cvvNumber);
    }

    async EnterExpirationMonth(expirationMonth: string): Promise<void> {
        await this.ExpirationMonth.fill(expirationMonth);
    }

    async EnterExpirationYear(expirationYear: string): Promise<void> {
        await this.ExpirationYear.fill(expirationYear);
    }

    async ClickPayAndConfirmOrderButton(): Promise<void> {
        await this.payAndConfirmOrderButton.waitFor({
            state: "visible"
        });

        await this.payAndConfirmOrderButton.click();

        await this.page.waitForLoadState("domcontentloaded");
    }

    async GetOrderSuccessMessage(): Promise<Locator> {
        return this.orderSuccessMessage;
    }

    async ClickRemoveProductButton(): Promise<void> {
        await this.removeProductButton.click();
    }

    async GetCartIsEmptyMessage(): Promise<Locator> {
        return this.cartIsEmptyMessage;
    }
}