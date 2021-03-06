import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from 'src/app/service/upload.service';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips'
import { nextTick } from 'q';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-upload-reports',
  templateUrl: './upload-reports.component.html',
  styleUrls: ['./upload-reports.component.css']
})
export class UploadReportsComponent implements OnInit {

  @Input() projectList: Observable<Array<string>>;
  //projectList = this.uploadService.getProjectList();

  fileList: File[];
  indexFile: File;
  jsFile: File;
  iteration: string;
  project: string;
  inputStartDate: string;
  inputEndDate: string;
  completedStoryPoints: number;
  assignedStoryPoints: number;
  submitted: boolean;
  complete: boolean;
  projectSelected: boolean;
  incorrectDateAlert: boolean;
  incorrectStoryPointsAlert: boolean;
  trainerVisible = true;
  trainerSelectable = true;
  trainerRemovable = true;
  trainerAddOnBlur = true;
  readonly trainerSeparatorKeysCodes: number[] = [ENTER, COMMA];
  observerVisible = true;
  observerSelectable = true;
  observerRemovable = true;
  observerAddOnBlur = true;
  readonly observerSeparatorKeysCodes: number[] = [ENTER, COMMA];
  trainers: string[];
  observers: string[];
  newProjectName: string;

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
    this.project = 'Project';
    this.fileList = [];
    this.trainers = [];
    this.observers = [];
  }

  selectFiles(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.fileList.push(event.target.files.item(i));
    }
  }

  removeFromFileList(file: File) {
    const index = this.fileList.indexOf(file);
    this.fileList.splice(index, 1);
  }

  setProject(project: string) {
    this.projectSelected = true;
    this.project = project;
    this.validate();
   // if (this.complete) {
      let add = true;
      this.projectList.subscribe(
        elt => { 
          elt.forEach(e => {if (project == e) { add = false; }}
          );}
      );
      if (add) {
        this.projectList.subscribe(
          current => { current.push(project); }
        );
      }
  //  }
  }

  validate() {
    // if start date is after end date
    if (this.getDuration() < 1) {
      this.incorrectDateAlert = true;
      this.complete = false;
    } else {
      this.incorrectDateAlert = false;
    }

    // if completed story points are greater than assigned story points
    if (this.completedStoryPoints > this.assignedStoryPoints) {
      this.incorrectStoryPointsAlert = true;
      this.complete = false;
    } else {
      this.incorrectStoryPointsAlert = false;
    }

    // if all fields are completed
    if (this.inputStartDate && this.inputEndDate && this.assignedStoryPoints &&
      this.completedStoryPoints && this.projectSelected && this.iteration &&
      !this.incorrectStoryPointsAlert && !this.incorrectDateAlert && this.project != "Project") {
      this.complete = true;
    } else {
      this.complete = false;
    }


  }

  getDuration(): number {
    const startDate = new Date(this.inputStartDate);
    const endDate = new Date(this.inputEndDate);
    const days = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;
    return days;
  }

  addTrainer(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.trainers.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  removeTrainer(trainer: string): void {
    const index = this.trainers.indexOf(trainer);

    if (index >= 0) {
      this.trainers.splice(index, 1);
    }
  }

  addObserver(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.observers.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  removeObserver(observer: string): void {
    const index = this.observers.indexOf(observer);

    if (index >= 0) {
      this.observers.splice(index, 1);
    }
  }




  submit() {
    // send this.fileList, this.iteration, this.project, and this.index to S3 bucket
    this.submitted = true;

    const startDate = new Date(this.inputStartDate).toDateString();
    const endDate = new Date(this.inputEndDate).toDateString();
    const days = this.getDuration();
    const velocity = (this.completedStoryPoints / days).toFixed(2);
    let trainerList = this.trainers.map(trainer => trainer).join(' ');
    let observerList = this.observers.map(observer => observer).join(' ');

    if (!trainerList) {
      trainerList = "Unspecified";
    }
    if (!observerList) {
      observerList = "Unspecified";
    }
    if (!this.projectSelected) {
      this.projectSelected = true;
    }



    let json = '{"trainerList": "' + trainerList + '", "observerList": "' + observerList + '", "startDate": "' + startDate + '", "endDate": "' + endDate + '", "duration": "' + days + '", "velocity": "' + velocity + '"}'; 

    this.jsFile = new File(
      // tslint:disable-next-line: max-line-length
      [json]
      , 'files.js', { type: 'application/javascript' });
    const proj = this.project;
    const iter = this.iteration;
    const uservice = this.uploadService;
    this.fileList.forEach((file) => {
      uservice.uploadReport(file, proj, iter + '/report/' + file.name);
    });
    this.uploadService.uploadReport(this.jsFile, this.project, this.iteration + '/files.js');
    setTimeout(() => {
      this.resetValues();
    }, 2000);
  }

  resetValues() {
    this.submitted = false;
    this.fileList = [];
    this.trainers = [];
    this.observers = [];
    this.project = 'Project';
    this.iteration = '';
    this.inputStartDate = '';
    this.inputEndDate = '';
    this.assignedStoryPoints = undefined;
    this.completedStoryPoints = undefined;
  }

}
