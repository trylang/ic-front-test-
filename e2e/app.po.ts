import { browser, element, by } from 'protractor';

export class Angular4Page {
  public  navigateTo() {
    return browser.get('/');
  }

  public getParagraphText() {
    return element(by.css('ic-app')).getText();
  }
}
