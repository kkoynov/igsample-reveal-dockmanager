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

    $.ig.RevealSdkSettings.setBaseUrl("https://localhost:5001/");
    $.ig.RevealSdkSettings.setAdditionalHeadersProvider(function (url) {
      var headers = {};
      headers["user-id"] = "demoUser";

      return headers;
    });
  }
}
