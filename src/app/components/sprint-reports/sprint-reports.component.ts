import { Component, OnInit } from '@angular/core';
import { UploadService } from 'src/app/service/upload.service';
import { Observable } from 'rxjs';
import { S3 } from 'aws-sdk/clients/all';

@Component({
  selector: 'app-sprint-reports',
  templateUrl: './sprint-reports.component.html',
  styleUrls: ['./sprint-reports.component.css']
})

export class SprintReportsComponent implements OnInit {

  projectList: Observable<Array<string>>;

  constructor(
    private uploadService: UploadService) { }

  ngOnInit() {
    this.uploadService.getToken().then(
      (result) => {
        this.uploadService.bucket = new S3({
          accessKeyId: result.arr[0].accessKeyId,
          secretAccessKey: result.arr[0].secretAccessKey,
          sessionToken: result.arr[0].sessionToken,
          region: "us-east-2",
          endpoint: "s3.us-east-2.amazonaws.com/",
          signatureVersion: "v4"
        });

        this.projectList = this.uploadService.getProjectList();
      });
  }

}
