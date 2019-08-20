import { EditReport } from '../edit-report/editReport.po';
import { AppPage } from './../app.po';
import { browser } from 'protractor';

describe('A user can delete an empty project', () => {

  const appPage = new AppPage();
  const editReport = new EditReport();

  beforeAll(() => {
    appPage.navigateTo();
  });

  it('should be navigate to the edit tab', () => {
    editReport.getEditReportTab().click();
    browser.sleep(2000);
    expect(editReport.getProjectBtn()).toBeTruthy();
  });

  it('should be able select last project', () => {
    editReport.getProjectBtn().click();
    const lastElementText = editReport.getLastProject().getText();
    editReport.getLastProject().click();
    expect(editReport.getProjectBtn().getText()).toBe("zztest");
  });

  it('should be able select first iteration', () => {
    editReport.getItterationBtn().click();
    const firstIterationText = editReport.getFirstItteration().getText();
    editReport.getFirstItteration().click();
    expect(editReport.getItterationBtn().getText()).toBe(firstIterationText);
  });

  it('should be able to delete iterations', () => {
    editReport.getRemoveIterationBtn().click();
    browser.sleep(2000);
    editReport.getremoveIterationConfirmBtn().click();
    browser.sleep(2500);
  });
  
  it('should be able to delete empty projects', () => {
    editReport.getProjectBtn().click();
    const lastElementText = editReport.getLastProject().getText();
    editReport.getLastProject().click();
    expect(editReport.getProjectBtn().getText()).toBe("zztest");
	editReport.getItterationBtn().click();
	editReport.getProjectDeleteBtn().click();
	browser.sleep(2000);
  });
  
});
