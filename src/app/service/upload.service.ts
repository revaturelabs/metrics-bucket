import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { Observable } from 'rxjs';
import { of as observableOf } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) {
    //this.getToken();

  }

  bucketName = environment.bucketName;
  bucket: S3 = new S3();
  //projectList;

  getToken() {
    return this.http.get<any>("http://ec2-18-191-211-170.us-east-2.compute.amazonaws.com:9999/tokens").toPromise();
  }

  uploadReport(file, project: string, filepath: string) {
    const params = {
      Bucket: this.bucketName,
      Key: project + '/' + filepath,
      Body: file,
      ACL: "bucket-owner-full-control",
      ContentType: "undefined"
    };
    this.bucket.upload(params, (err, data) => {
      if (err) {
        return false;
      }
      return true;
    });
  }
  getProjectList(): Observable<Array<string>> {

    const projects = new Array<string>();

    const params = {
      Bucket: this.bucketName,
      Prefix: '',
      Delimiter: '/'
    };


    this.bucket.listObjects(params, (err, data) => {

      if (err) {
        return;
      }

      data.CommonPrefixes.forEach((file) => {
        if (file.Prefix !== environment.s3appfolder + '/')//ignores s3 application on bucket
          projects.push(file.Prefix.replace('/', ''));
      });

    });

    return observableOf(projects);
  }

  getProjectSprints(project: string): Observable<Array<string>> {
    const sprints = new Array<string>();
    const params = {
      Bucket: this.bucketName,
      Prefix: project + '/',
      Delimiter: '/'
    };

    this.bucket.listObjects(params, (err, data) => {
      if (err) {
        return;
      }


      data.CommonPrefixes.forEach((file) => {
        sprints.push(file.Prefix.replace(project + '/', '').replace('/', ''));
      });
    });

    return observableOf(sprints);

  }

  getIterationFiles(project: string, iter: string): Array<string> {

    const files = new Array<string>();
    const prefix = project + '/' + iter + '/report/';
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix
    };

    this.bucket.listObjects(params, (err, data) => {
  

      if (err) {
        return;
      }

      data.Contents.forEach((file) => {
        files.push(file.Key.replace(prefix, ''));
      });
    });

    return files;
  }

  deleteFiles(project: string, iter: string, filename: string) {

    const key = project + '/' + iter + '/report/' + filename;

    const params = {
      Bucket: this.bucketName,
      Key: key
    };

    this.bucket.deleteObject(params, (err, data) => {
      if (err) {
        return;
      }
    });
  }

  deleteIteration(project: string, iter: string) {
    this.deleteIndex(project, iter);
    this.deleteJS(project, iter);
    const key = project + '/' + iter + '/';

    const params = {
      Bucket: this.bucketName,
      Key: key
    };

    this.bucket.deleteObject(params, (err, data) => {
      if (err) {
        return;
      }
    });
  }
  deleteIndex(project: string, iter: string) {
    const key = project + '/' + iter + '/index.html';

    const params = {
      Bucket: this.bucketName,
      Key: key
    };

    this.bucket.deleteObject(params, (err, data) => {
  
      if (err) {
        return;
      }
    });
  }
  deleteJS(project: string, iter: string) {

    const key = project + '/' + iter + '/files.js';

    const params = {
      Bucket: this.bucketName,
      Key: key
    };

    this.bucket.deleteObject(params, (err, data) => {

      if (err) {
        return;
      }
    });
  }
}

