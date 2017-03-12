package com.example.donavanmartin.hackqc2017;

import android.*;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.example.donavanmartin.hackqc2017.Network.getIssueTask;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback, TaskCAllback  {

    private GoogleMap mMap;
    private Button report;

    /*@Override
    protected void onResume(){
        getIssueTask getMarker = new getIssueTask(this);
        getMarker.execute();
    }*/

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        report = (Button) this.findViewById(R.id.btn_conferma);
        report.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v){
                openPhoto();
            }
        });
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        LocationManager lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION},
                    1);
            ActivityCompat.requestPermissions(this,
                    new String[]{android.Manifest.permission.ACCESS_COARSE_LOCATION},
                    1);
        }

        Location location = null;
        Location locationGPS = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        Location locationNet = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);

        long GPSLocationTime = 0;
        if (null != locationGPS) {
            GPSLocationTime = locationGPS.getTime();
        }
        long NetLocationTime = 0;

        if (null != locationNet) {
            NetLocationTime = locationNet.getTime();
        }

        if ( 0 < GPSLocationTime - NetLocationTime ) {
            location = locationGPS;
        }
        else {
            location = locationNet;
        }

        double longitude = location.getLongitude();
        double latitude = location.getLatitude();

        mMap = googleMap;
        // Add a marker in Sydney and move the camera
        LatLng sydney = new LatLng(latitude, longitude);
        mMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
        mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));
        getIssueTask getMarker = new getIssueTask(this);
        getMarker.execute();
    }

    private void openPhoto(){
        Intent i = new Intent(this, PhotoIntentActivity.class);
        this.startActivity(i);
    }

    @Override
    public void done() {
    }

    @Override
    public void done(ArrayList<JSONObject> a) {
        for(JSONObject js : a){
            LatLng sydney = null;
            try {
                sydney = new LatLng(Double.valueOf((String)js.get("latitude")), Double.valueOf((String)js.get("longitude")));
                mMap.addMarker(new MarkerOptions().position(sydney).title(js.get("comment")));
                mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

    }
}
