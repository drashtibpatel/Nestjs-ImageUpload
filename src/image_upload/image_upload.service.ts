import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import s3Storage = require("multer-sharp-s3");
import config from "../config/config";

const AWS_S3_BUCKET_NAME = config.AWS_S3_BUCKET_NAME || 'doyenhub-demo';

AWS.config.update({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

@Injectable() 
export class ImageUploadService {
  constructor() {}

  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function(error) {
        if (error) {
          console.log(error);
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json(req.files[0].location);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }



  upload = multer({
    storage: s3Storage({
      s3: s3,
      Bucket: AWS_S3_BUCKET_NAME,
      ACL: 'public-read',
      Key: function(request, file, cb) {
        // Only .png, .jpg and .jpeg format allowed
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          const fileSize = parseInt(request.headers['content-length']);
          if (fileSize > 1048576) { // File size restricted to 10MB
            cb(null, false);
            return cb(new Error('Maximum 10MB image size Allowed!'));
          } else {
            cb(null, `${Date.now().toString()} - ${file.originalname}`);
          }
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
        
      },
      resize: { // we will resize image to 300x300
        width: 300,
        height: 300,
      },
    }),
  }).array('upload', 1);
}
