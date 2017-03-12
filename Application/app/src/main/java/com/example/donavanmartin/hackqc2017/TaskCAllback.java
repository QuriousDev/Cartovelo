package com.example.donavanmartin.hackqc2017;

import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by donavanmartin on 17-03-11.
 */

public interface TaskCAllback {
     void done();
     void done(ArrayList<JSONObject> a);
}
