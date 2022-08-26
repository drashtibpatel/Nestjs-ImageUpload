# Description

A sample project to demonstrate image upload to S3

# Getting Started

Clone the repo:

$ git clone http://192.168.2.107/kinjal.n.modi/node-typeorm.git

cd Nestjs-ImageUpload


# Install the dependencies:

$ npm install


Set the config variables in config/config.ts file:

Copy below code and paste it with your credentials
export default {
    "AWS_ACCESS_KEY_ID": ACCESS_KEY,
    "AWS_SECRET_ACCESS_KEY": SECRET_ACCESS_KEY,
    "AWS_S3_BUCKET_NAME": BUCKET_NAME
}



### Running the app
# development
$ npm run start

# watch mode

$ npm run start:dev

# production mode
npm run start:prod


### Test
# unit tests
$ npm run test