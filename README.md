## S3 Metrics Bucket App Instructions:

0. Clone Metrics-Bucket to a local machine
1. install node:
```bash
npm install -y
```
2. set src/environment/environment.prod.ts and src/environment/environment.ts variables -- prod is for your production server, see environment.ts for more details:

        backend         (domain name of backend server, excluding http and port, ie: ec2-127-0-0-1.us-east-2.compute.amazonaws.com)
        bucketName      (name of bucket)
        region	        (check region name and use region column -- region name of s3, not ec2: 
                            https://docs.aws.amazon.com/general/latest/gr/rande.html)
        s3appfolder     (the folder you want to send build application to) (We don't use this currently)

3. `ng serve` to host it locally, then navigate to localhost:4200
4. *OPTIONAL* ng build (or) ng build --prod
5. *OPTIONAL* copy output in dist folder to a *DIFFERENT* *public* s3 bucket or find a different host
6. *OPTIONAL* *OPTIONAL* setting up the public s3 bucket for static website hosting and connecting to the app: 

		from the s3 management console:
		click permissions
		under public access, uncheck block all and uncheck all of the sub-boxes aswell
		click properties
		click static website hosting
		select "use this bucket to host a website"
		set index document to index.html
		set error document to index.html
		copy the endpoint link
		save
		click overview
		select all
		pick actions
		make public
		navigate to the endpoint link you saved earlier
  
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
