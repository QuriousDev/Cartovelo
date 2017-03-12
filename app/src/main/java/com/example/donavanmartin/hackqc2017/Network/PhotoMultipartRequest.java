package com.example.donavanmartin.hackqc2017.Network;

import android.content.Context;

import net.gotev.uploadservice.MultipartUploadRequest;
import net.gotev.uploadservice.UploadNotificationConfig;

import java.util.UUID;

public class PhotoMultipartRequest {
    private final static String bucket = "hackqc-images";


    public PhotoMultipartRequest(Context c, String path, String id) {
        String upload = "http://ec2-52-14-137-171.us-east-2.compute.amazonaws.com:3000/api/issues/"+id+"/image";
        try {
            String uploadId = UUID.randomUUID().toString();
            System.out.print(path);
            //Creating a multi part request
            MultipartUploadRequest muf = new MultipartUploadRequest(c, uploadId, upload)
                    .addFileToUpload("/storage/emulated/0/DCIM/qurious.jpg", "image") //Adding file
                    .addParameter("name", "test") //Adding text parameter to the request
                    .setNotificationConfig(new UploadNotificationConfig())
                    .setMaxRetries(2);
            muf.setAutoDeleteFilesAfterSuccessfulUpload(false);
            muf.setMethod("POST");
            muf.startUpload(); //Starting the upload

        } catch (Exception exc) {
            System.out.print("Erreur:" + exc.toString());
        }
    }

}