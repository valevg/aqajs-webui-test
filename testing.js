const { Builder, By, until } = require('selenium-webdriver');

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.usernameInput = By.css('#user-name');
    this.passwordInput = By.xpath("//input[@id='password']");
    this.loginButton = By.css('.btn_action');
  }

  async enterUsername(username) {
    await this.driver.findElement(this.usernameInput).sendKeys(username);
  }

  async enterPassword(password) {
    await this.driver.findElement(this.passwordInput).sendKeys(password);
  }

  async clickLoginButton() {
    await this.driver.findElement(this.loginButton).click();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}

class LoginPageTests {
  constructor(driver) {
    this.driver = driver;
    this.loginPage = new LoginPage(driver);
  }

  async testSuccessfulLogin() {
    await this.loginPage.login('standard_user', 'secret_sauce');
    await this.driver.wait(until.urlContains('inventory.html'), 10000);
    console.log('Successful login test passed.');
  }

  async testUnsuccessfulLogin() {
    await this.loginPage.login('locked_out_user', 'secret_sauce');
    const errorMessage = await this.driver.findElement(By.css("[data-test='error']")).getText();
    if (errorMessage === 'Epic sadface: Sorry, this user has been locked out.') {
      console.log('Unsuccessful login test passed.');
    } else {
      console.log('Unsuccessful login test failed.');
    }
  }
}

// Пример использования Page Object и тестов
async function runTests() {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://www.saucedemo.com/');

  const loginTests = new LoginPageTests(driver);

  await loginTests.testSuccessfulLogin();
  await loginTests.testUnsuccessfulLogin();

  await driver.quit();
}

runTests().catch((error) => console.error(error));