package com.example.donavanmartin.hackqc2017.Network;

import android.os.AsyncTask;
import android.util.Log;

import com.example.donavanmartin.hackqc2017.TaskCAllback;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

/**
 * Created by donavanmartin on 17-03-11.
 */

public class getIssueTask extends AsyncTask<Void, Void, Void> {
    private TaskCAllback callback;
    private ArrayList<JSONObject> JO_list;
    public getIssueTask(TaskCAllback callback){
        this.callback = callback;
    }

    @Override
    protected Void doInBackground(Void... params) {
        InputStream s = null;
        try{
            URL url = new URL("http://ec2-52-14-137-171.us-east-2.compute.amazonaws.com:3000/api/issues");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            //conn.connect();

// read the response
            String response = "";
            System.out.println("Response Code: " + conn.getResponseCode());
            InputStream in = new BufferedInputStream(conn.getInputStream());

            JO_list = new ArrayList<>();
            if (in != null) {
                StringBuilder sb = new StringBuilder();
                String line;
                try {
                    BufferedReader reader = new BufferedReader(
                            new InputStreamReader(in));
                    while ((line = reader.readLine()) != null) {
                        sb.append(line);
                    }
                    reader.close();
                } finally {
                    in.close();
                }
                response = sb.toString();
                JSONObject mainObject = new JSONObject(response);
                JSONArray uniObject = mainObject.getJSONArray("issues");

                int nb = uniObject.length();
                for(int index = 0 ; index<nb ; index++){
                    JO_list.add(uniObject.getJSONObject(index));
                }
                onPostExecute();
            }

            //String response = org.apache.commons.io.IOUtils.toString(in, "UTF-8");
            System.out.println(response);
        }catch(Exception e){
            Log.e("log_tag", "Error in http connection "+e.toString());
        }
        return null;
    }

    protected void onPostExecute() {
        callback.done(JO_list);
    }
}