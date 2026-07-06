import { Page, Locator } from '@playwright/test';

export class RegistrationPage {
    private page: Page;
    private enteraccoutinformationText: Locator;
    private mrTitleradioButton: Locator;
    private nameTextField: Locator;
    private emailTextField: Locator;
    private PasswordTextField: Locator;
    private DOBDay: Locator;
    private DOBMonth: Locator;
    private DOBYear: Locator;
    private newsLetterCheckBox: Locator;
    private specialOffersCheckBox: Locator;
    private firstNameTextField: Locator;
    private lastNameTextField: Locator;
    private companyTextField: Locator;
    private addressText1TextField: Locator;
    private addressText2TextField: Locator;
    private countryDropDown: Locator;
    private stateTextField: Locator;
    private cityTextField: Locator;
    private zipCodeTextField: Locator;
    private mobileNumberTextField: Locator;
    private createAccountButton: Locator;
    private accountCreatedText: Locator;
    private continueButton: Locator;
    private loggedInAsText: Locator;
    private deleteAccountButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.enteraccoutinformationText = page.locator('b:has-text("ENTER ACCOUNT INFORMATION")');
        this.mrTitleradioButton = page.getByRole('radio', { name: 'Mr.' });
        this.nameTextField = page.locator('input[data-qa="name"]');
        this.emailTextField = page.locator('input[data-qa="email"]');
        this.PasswordTextField = page.locator('input[data-qa="password"]');
        this.DOBDay = page.locator('#days');
        this.DOBMonth = page.locator('#months');
        this.DOBYear = page.locator('#years');
        this.newsLetterCheckBox = page.getByRole('checkbox', { name: 'Sign up for our newsletter!' });
        this.specialOffersCheckBox = page.getByRole('checkbox', { name: 'Receive special offers from our partners!' });
        this.firstNameTextField = page.locator('input[data-qa="first_name"]');
        this.lastNameTextField = page.locator('input[data-qa="last_name"]');
        this.companyTextField = page.locator('input[data-qa="company"]');
        this.addressText1TextField = page.locator('input[data-qa="address"]');
        this.addressText2TextField = page.locator('input[data-qa="address2"]');
        this.countryDropDown = page.locator('select[data-qa="country"]');
        this.stateTextField = page.locator('input[data-qa="state"]');
        this.cityTextField = page.locator('input[data-qa="city"]');
        this.zipCodeTextField = page.locator('input[data-qa="zipcode"]');
        this.mobileNumberTextField = page.locator('input[data-qa="mobile_number"]');
        this.createAccountButton = page.locator('button[data-qa="create-account"]');
        this.accountCreatedText = page.getByText('Account Created!');
        this.continueButton = page.getByRole('link', { name: 'Continue' });
        this.loggedInAsText = page.getByText(/Logged in as/i);
        this.deleteAccountButton = page.getByRole('link', { name: 'Delete Account' });
    }

    async GetEnteraccoutinformationText(): Promise<Locator> {
        return this.enteraccoutinformationText;
    }

    async GetMrTitleradioButton(): Promise<Locator> {
        return this.mrTitleradioButton;
    }

    async ClickMrTitleradioButton(): Promise<void> {
        await this.mrTitleradioButton.click();
    }

    async GetNameTextField(): Promise<Locator> {
        return this.nameTextField;
    }

    async GetEmailTextField(): Promise<Locator> {
        return this.emailTextField;
    }

    async GetPasswordTextField(): Promise<Locator> {
        return this.PasswordTextField;
    }

    async EnterPaasword(password: string): Promise<void> {
        await this.PasswordTextField.fill(password);
    }

    async SelectDOBDay(day: string): Promise<void> {
        await this.DOBDay.selectOption(day);
    }

    async SelectDOBMonth(month: string): Promise<void> {
        await this.DOBMonth.selectOption(month);
    }

    async SelectDOBYear(year: string): Promise<void> {
        await this.DOBYear.selectOption(year);
    }

    async GetNewsLetterCheckBox(): Promise<Locator> {
        return this.newsLetterCheckBox;
    }

    async ClickNewsLetterCheckBox(): Promise<void> {
        await this.newsLetterCheckBox.check();
    }

    async GetSpecialOffersCheckBox(): Promise<Locator> {
        return this.specialOffersCheckBox;
    }

    async ClickSpecialOffersCheckBox(): Promise<void> {
        await this.specialOffersCheckBox.check();
    }

    async GetFirstNameTextField(): Promise<Locator> {
        return this.firstNameTextField;
    }

    async EnterFirstName(firstName: string): Promise<void> {
        await this.firstNameTextField.fill(firstName);
    }

    async GetLastNameTextField(): Promise<Locator> {
        return this.lastNameTextField;
    }

    async EnterLastName(lastName: string): Promise<void> {
        await this.lastNameTextField.fill(lastName);
    }

    async GetCompanyTextField(): Promise<Locator> {
        return this.companyTextField;
    }

    async EnterCompany(company: string): Promise<void> {
        await this.companyTextField.fill(company);
    }

    async GetAddress1TextField(): Promise<Locator> {
        return this.addressText1TextField;
    }

    async EnterAddress1(address1: string): Promise<void> {
        await this.addressText1TextField.fill(address1);
    }

    async GetAddress2TextField(): Promise<Locator> {
        return this.addressText2TextField;
    }

    async EnterAddress2(address2: string): Promise<void> {
        await this.addressText2TextField.fill(address2);
    }

    async GetCountryDropDown(): Promise<Locator> {
        return this.countryDropDown;
    }

    async SelectCountry(country: string): Promise<void> {
        await this.countryDropDown.selectOption(country);
    }

    async GetStateTextField(): Promise<Locator> {
        return this.stateTextField;
    }

    async EnterState(state: string): Promise<void> {
        await this.stateTextField.fill(state);
    }

    async GetCityTextField(): Promise<Locator> {
        return this.cityTextField;
    }

    async EnterCity(city: string): Promise<void> {
        await this.cityTextField.fill(city);
    }

    async GetZipCodeTextField(): Promise<Locator> {
        return this.zipCodeTextField;
    }

    async EnterZipCode(zipCode: string): Promise<void> {
        await this.zipCodeTextField.fill(zipCode);
    }

    async GetMobileNumberTextField(): Promise<Locator> {
        return this.mobileNumberTextField;
    }

    async EnterMobileNumber(mobileNumber: string): Promise<void> {
        await this.mobileNumberTextField.fill(mobileNumber);
    }

    async GetCreateAccountButton(): Promise<Locator> {
        return this.createAccountButton;
    }

    async ClickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }

    async GetAccountCreatedText(): Promise<Locator> {
        return this.accountCreatedText;
    }

    async ClickContinueButton(): Promise<void> {
        await this.continueButton.click();
    }

    async GetLoggedInAsText(): Promise<Locator> {
        return this.loggedInAsText;
    }

    async ClickDeleteAccountButton(): Promise<void> {
        await this.deleteAccountButton.click();
    }
}