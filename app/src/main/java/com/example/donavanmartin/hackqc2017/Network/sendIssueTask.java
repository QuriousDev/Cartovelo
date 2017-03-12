package com.example.donavanmartin.hackqc2017.Network;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.donavanmartin.hackqc2017.TaskCAllback;

import org.json.JSONObject;

import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by donavanmartin on 17-03-11.
 */

public class sendIssueTask extends AsyncTask<Void, Void, Void>  {

    private final String urlSubmit = "http://ec2-52-14-137-171.us-east-2.compute.amazonaws.com:3000/api/issues/submit";
    private String urlPhoto = "http://ec2-52-14-137-171.us-east-2.compute.amazonaws.com:3000/api/upload";

    private Context context;
    private RequestQueue queue;
    private String title = "";
    private String lat = "";
    private String lon = "";
    private String descr = "";
    private String Date = "";
    private File imgFile;
    private TaskCAllback mCallback;


    public sendIssueTask(TaskCAllback callback, Context context, String title, String latitude, String longitude, String description, String Date, File imgFile) {
        mCallback = callback;
        this.title = title;
        this.lat = latitude;
        this.lon = longitude;
        this.descr = description;
        if(descr.isEmpty()){
            descr = " ";
        }
        this.Date = Date;
        this.context = context;
        this.imgFile =imgFile;
        queue = Volley.newRequestQueue(context);
    }

    @Override
    protected Void doInBackground(Void... params) {
        InputStream s = null;
        String url = urlSubmit;
        StringRequest postRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        // response
                        Log.d("Response", response);
                        try{
                            JSONObject obj = new JSONObject(response);
                            sendPhoto(obj.getString("id"));
                            onPostExecute();
                        }
                        catch(Exception e){

                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                        Log.d("Error.Response", error.toString());
                    }
                }
        ) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<String, String>();
                params.put("title", title);
                params.put("longitude", lon);
                params.put("latitude", lat);
                params.put("description", descr);
                params.put("comment", "message");

                return params;
            }
        };
        queue.add(postRequest);

        return null;
    }
    private void sendPhoto(String id){
        PhotoMultipartRequest uploader = new PhotoMultipartRequest(context,imgFile.getPath(),id);
    }

    protected void onPostExecute() {
        mCallback.done();
    }
}