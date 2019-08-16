import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-edit-reports',
  templateUrl: './edit-reports.component.html',
  styleUrls: ['./edit-reports.component.css']
})
export class EditReportsComponent implements OnInit {

  jsFile: File;
  @Input() projectList: Observable<Array<string>>;

  // Edit reports
  iterationListEdit: string[];
  filesEdit: Array<string>;
  fileList: File[];
  filesToDel: Array<string>;
  projectEdit: string;
  iterationChoice: string;
  iterationViewShow = false;

  // Edit validations
  submittedEdit: boolean;
  submittedDelete: boolean;
  submittedDeleteWarn: boolean;
  completeEdit: boolean;

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
    this.iterationChoice = 'Select Iteration';
    this.projectEdit = 'Select Project';
    this.fileList = [];
    this.filesToDel = [];
  }

  // Edit Reports methods

  setProjectEdit(project: string) {
    this.submittedDeleteWarn = false;
    this.projectEdit = project;
    this.uploadService.getProjectSprints(project).subscribe(iter => {
      this.iterationListEdit = iter;
    })
    this.iterationChoice = 'Select Iteration';
    this.filesEdit = [];
  }

  setIteration(iter: string) {
    this.submittedDeleteWarn = false;
    this.iterationChoice = iter;
    this.filesEdit = this.uploadService.getIterationFiles(this.projectEdit, iter);
  }

  addFile(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.fileList.push(event.target.files.item(i));
      this.filesEdit.push(event.target.files.item(i).name);
    }

  }

  removeFile(file: string) {
    this.filesEdit = this.filesEdit.filter((value) => {
      return value != file;
    });
    this.filesToDel.push(file);
  }

  deletionWarning() {
    this.submittedDeleteWarn = true;
  }

  resetDelete() {
    this.submittedDeleteWarn = false;
  }

  deleteIteration() {
    this.submittedDeleteWarn = false;
    this.submittedDelete = true;
    const uservice = this.uploadService;
    this.filesEdit.forEach((file) => {
      uservice.deleteFiles(this.projectEdit, this.iterationChoice, file);
    });
    this.uploadService.deleteIteration(this.projectEdit, this.iterationChoice);
    setTimeout(() => {
      this.resetValuesEdit();
    }, 2000);
  }

  submitEdit() {
    this.submittedDeleteWarn = false;
    this.submittedEdit = true;



   // this.jsFile = new File(
    //  [`document.write(\`<b>Files:</b> ${this.filesEdit.map(file => `<br><a href='report/${file}' target='_blank'>${file}</a>`)}\`)`]
    //  , 'files.js', { type: 'application/javascript' });
    const uservice = this.uploadService;

    this.fileList.forEach((file) => {
      uservice.uploadReport(file, this.projectEdit, this.iterationChoice + '/report/' + file.name);
    });
    this.filesToDel.forEach((file) => {
      uservice.deleteFiles(this.projectEdit, this.iterationChoice, file);
  //    console.log(file);
    });

    this.uploadService.bucket.getObject({ Bucket: this.uploadService.bucketName, Key: this.projectEdit + "/" + this.iterationChoice + '/files.js' }, (err, file) => {

      let obj = JSON.parse(<string>file.Body);
      let indexFile = new File(
        [`
        <html>
          <head>
            <title>Sprint Report - ${obj.iteration}</title>
          </head>
          <body>
            <h1>Sprint Metrics:</h1>
            <b>Project:</b> ${this.projectEdit} <br>
            <b>Iteration:</b> ${this.iterationChoice}<br>
            <b>Trainer(s):</b> ${obj.trainerList} <br>
            <b>Observer(s):</b> ${obj.observerList} <br>
            <b>Start Date:</b> ${obj.startDate}<br>
            <b>End Date:</b> ${obj.endDate} <br>
            <b>Duration:</b> ${obj.days} day(s) <br>
            <b>Velocity:</b> ${obj.velocity} user stories per day <br>` +
            //this.filesEdit.map(file => `<br><a href='report/${file}
          this.filesEdit.map(file => {
            let link = this.uploadService.bucket.getSignedUrl('getObject', { Bucket: this.uploadService.bucketName, Key: this.projectEdit + '/' + this.iterationChoice + '/report/' + file });
            return `<br><a href="${link}">${file}</a>`;
          })
          +
          `</body>
        </html>
        `]
        , 'index.html', { type: 'text/html' });

      this.uploadService.uploadReport(indexFile, this.projectEdit, this.iterationChoice + '/index.html');
      setTimeout(() => {
        this.resetValuesEdit();
      }, 2000);
    });

  }

  resetValuesEdit() {
    this.submittedEdit = false;
    this.submittedDelete = false;
    this.submittedDeleteWarn = false;
    this.filesEdit = undefined;
    this.iterationListEdit = undefined;
    this.fileList = [];
    this.filesToDel = [];
    this.iterationChoice = 'Select Iteration';
    this.projectEdit = 'Select Project';
  }

}
