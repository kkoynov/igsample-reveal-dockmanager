import { Component } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Reveal + IgniteUI for Angular';

  constructor() {

    // Set the base url of reveal back-end
    $.ig.RevealSdkSettings.setBaseUrl("https://localhost:5001/");

    // The code bellow illustrate how you could provide additional headers
    // to the requests Reveal Client is sending to the back-end
    // This is useful to send authentication headers to the back-end. 
    $.ig.RevealSdkSettings.setAdditionalHeadersProvider(function (url) {
      var headers = {};
      headers["user-id"] = "demoUser";

      return headers;
    });
  }
}
