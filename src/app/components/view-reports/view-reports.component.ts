import { Component, OnInit, Input, ViewEncapsulation, ElementRef, PipeTransform, Pipe } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/service/upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { S3 } from 'aws-sdk/clients/all';
@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}


@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.css']
})

export class ViewReportsComponent implements OnInit {

  @Input() projectList: Observable<Array<string>>;
//  projectList = this.uploadService.getProjectList();

  bucketName: string;
  projectChoice: string;
  iterationList: string[];
  iterationLink: string;
  selectedIteration: string;
  iterationViewShow = false;
  testing: any;
  resp: any;

  constructor(private uploadService: UploadService) { }

  ngOnInit() {

    this.bucketName = "metrics-bucket1906";
    this.projectChoice = 'Select Project';
    this.selectedIteration = ' Select Iteration';
  }

  createLink(iter: string) {
    this.iterationViewShow = true;
    this.selectedIteration = iter;
    
    this.uploadService.bucket.getObject({ Bucket: this.uploadService.bucketName, Key: this.projectChoice + "/" + this.selectedIteration + '/files.js' }, (err, file) => {


      this.uploadService.bucket.listObjects({
        Bucket: this.bucketName,
        Prefix: this.projectChoice + "/" + this.selectedIteration + "/report/",
        Delimiter: '/'
      }, (errinner, data) => {
      let obj = JSON.parse(<string>file.Body);
      this.resp = `
        <h1>Sprint Metrics:</h1>
        <b>Project:</b> ${this.projectChoice} <br>
        <b>Iteration:</b> ${this.selectedIteration}<br>
        <b>Trainer(s):</b> ${obj.trainerList} <br>
        <b>Observer(s):</b> ${obj.observerList} <br>
        <b>Start Date:</b> ${obj.startDate}<br>
        <b>End Date:</b> ${obj.endDate} <br>
        <b>Duration:</b> ${obj.duration} day(s) <br>
        <b>Velocity:</b> ${obj.velocity} user stories per day <br>`;

        data.Contents.forEach(element => {
          // gets the file name from the aboslute path
          let matches = element.Key.match(/.+\/(.+?)$/);
          let link = this.uploadService.bucket.getSignedUrl('getObject', { Bucket: this.uploadService.bucketName, Key: element.Key });
          this.resp += `<br><a href="${link}">${matches[1]}</a>`;
        });
      });
    });
  }

  showIterations(project: string) {
    this.selectedIteration = 'Select Iteration';
    this.projectChoice = project;
    this.uploadService.getProjectSprints(project).subscribe(iter => {
      this.iterationList = iter;
    });
    this.iterationViewShow = false;
  }

  resetValues() {
    this.iterationViewShow = false;
    this.iterationList = undefined;
    this.projectChoice = 'Select Project';
    this.selectedIteration = 'Select Iteration';
  }


}
