## S3 Metrics Bucket App Instructions:

1. npm install -y
2. set src/environment/environment.prod.ts and src/environment/environment.ts variables:

        backend         (domain name of backend server, excluding http and port, ie: ec2-127-0-0-1.us-east-2.compute.amazonaws.com)
        bucketName      (name of bucket)
        region	        (check region name and use region column -- region name of s3, not ec2: 
                            https://docs.aws.amazon.com/general/latest/gr/rande.html)
        s3appfolder     (the folder you want to send build application to)

3. ng build --baseHref="./"
4. copy output in dist folder to a *DIFFERENT* *public* s3 bucket or find a different host

# S3BucketApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
