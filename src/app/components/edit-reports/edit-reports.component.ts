import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/service/upload.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-reports',
  templateUrl: './edit-reports.component.html',
  styleUrls: ['./edit-reports.component.css']
})
export class EditReportsComponent implements OnInit {

  env = environment.bucketName;

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
  submittedDeleteProject : boolean;

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

  deleteProject() {
    this.submittedDeleteProject = true;
    this.uploadService.bucket.deleteObject({Bucket: this.uploadService.bucketName, Key: this.projectEdit + "/"},
      (err, data) => {
        if (err) {
          //console.log("err: " + err);
          return;
        }
        //console.log("success: " + data);
      }
      );
    var idx;
    this.projectList.subscribe( elt => {
      for (idx = 0; idx < elt.length; ++idx) {
        if (elt[idx] == this.projectEdit) {
          elt.splice(idx,1);
          break;
        }
      }
    });
    setTimeout(() => {
      this.resetValuesEdit();
    }, 2000);
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
    });

      setTimeout(() => {
        this.resetValuesEdit();
      }, 2000);
 
  }

  resetValuesEdit() {
    this.submittedEdit = false;
    this.submittedDelete = false;
    this.submittedDeleteWarn = false;
    this.submittedDeleteProject = false;
    this.filesEdit = undefined;
    this.iterationListEdit = undefined;
    this.fileList = [];
    this.filesToDel = [];
    this.iterationChoice = 'Select Iteration';
    this.projectEdit = 'Select Project';
  }

}
