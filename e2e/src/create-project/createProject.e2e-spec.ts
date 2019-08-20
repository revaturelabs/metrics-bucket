import { UploadTabPage } from '../upload-report/uploadReport.po';
import { AppPage } from './../app.po';
import { browser, by, element } from 'protractor';

describe('A user is able to create a new project', () => {

  const appPage = new AppPage();
  const UploadTab = new UploadTabPage();

  beforeAll(() => {
    appPage.navigateTo();
  });

  it('should be able to navigate to upload tab', () => {
    UploadTab.navigateuploadtab().click();
    expect(UploadTab.getstardate()).toBeTruthy();
  });

  it('should be able to enter a start date', () => {
    UploadTab.selectstartdate().sendKeys('08/03/2019');
    expect(UploadTab.getstardate().getAttribute('value')).not.toBe('');
  });

  it('should be able to enter a end date', () => {
    UploadTab.selectendtdate().sendKeys('08/06/2019');
    expect(UploadTab.selectendtdate().getAttribute('value')).not.toBe('');
  });

  it('should be able to enter completedsp number', () => {
    UploadTab.entercompletedsp().sendKeys('2');
    expect(UploadTab.entercompletedsp().getAttribute('value')).not.toBe('');
  });

  it('should be able to enter assignedsp number', () => {
    UploadTab.enterassignedsp().sendKeys('2');
    expect(UploadTab.enterassignedsp().getAttribute('value')).not.toBe('');
  });

  it('should be able to create a new project ', () => {
    UploadTab.selectprojectbtn().click();
    UploadTab.getNewProjectInput().click();
    UploadTab.getNewProjectInput().sendKeys("zztest");
	UploadTab.getNewProjectButton().click();
    expect(UploadTab.selectprojectbtn().getText()).toBe('zztest');
  });

  it('should be able to enter an iteration name ', () => {
    UploadTab.enterprojectiteration().click();
    UploadTab.enterprojectiteration().sendKeys('FirstIteration');
    expect(UploadTab.enterprojectiteration().getText()).not.toEqual(0);
  });

  it('should be able to send the report by clicking submit button ', () => {
	element(by.css("#bucket-container")).click(); // click background to enable button (interesting "feature")
    UploadTab.sendreport().click();
    browser.sleep(5000);
    expect(UploadTab.getuploadedfile().isPresent()).toBe(false);
  });

});
