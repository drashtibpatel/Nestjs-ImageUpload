import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import s3Storage = require("multer-sharp-s3");
import config from "../config/config";

// AWS config used in Multer
const AWS_S3_BUCKET_NAME = config.AWS_S3_BUCKET_NAME || 'user-for-interview-test-cases';

AWS.config.update({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3(); // S3 bucket Object

@Injectable() 
export class ImageUploadService {
  constructor() {}

  fileFilter = (_req, file, cb) => {
    cb(null, true);
    // Only JPG, JPEG and PNG File format allowed
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPG, JPEG and PNG is allowed!'), false);
    }
  }

  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function(error) {
        if (error) {
          console.log(error);
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        // console.log(req.files);
        return res.status(201).json(`Image Successfully Stored in S3 Bucket`);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  upload = multer({
    fileFilter: this.fileFilter,
    limits:{
      files: 1, // allow only 1 file per request
      fileSize: 1024 * 1024 * 10 // 10 MB (max file size)
    },
    storage: s3Storage({
      s3: s3,
      Bucket: AWS_S3_BUCKET_NAME,
      ACL: 'public-read',
      Key: function(request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
      multiple: true, // flag required to store multiple images
      resize: [ // this will resize and store image to 3 images with suffix
        { suffix: 'xlg', width: 2048, height: 2048 },
        { suffix: 'lg', width: 1024, height: 1024 },
        { suffix: 'sm', width: 300, height: 300 },
      ],
    }),
  }).array('upload', 1);
}
