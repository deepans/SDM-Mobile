package com.irh;

import android.app.Activity;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.File;

public class HomeActivity extends Activity
{

    public static final String URL = "file:///android_asset/www/cycletel.html";

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        WebView webView = (WebView)findViewById(R.id.cycletel);

        WebViewClient webViewClient = new WebViewClient() {

            public void onPageFinished(WebView view, String url) {
                if(URL.equals(url))
                    view.loadUrl("javascript:$.cycletel.public_api.render('tablet');");
            }
        };
        webView.setWebViewClient(webViewClient);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.loadUrl(URL);

    }

}
