import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import { OnInit } from '@angular/core';
import { Constants } from './config/constants';
import { ApiHttpService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ParseService } from './parse.service';
import internal from 'node:stream';
import { end } from '@popperjs/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LogoButtonComponent, NgbModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']


})
export class AppComponent implements OnInit {
  importedbillingData: any = null;
  importedmeterData: any = null;
  apiTitle = Constants.TitleOfSite;
  title = 'World';
  file!: File;
  fileText!: any;
  displayFile!: String;
  authToken: String = '';
  accessToken: String = 'access_token=3959c8c3f5a44d9cad67534d9910d1b9'; // this is the authorization authToken for the account that we are using for testing. Change this code to use a different account
  formUid: any;
  referralId: any;
  authForm: any;
  meterForm: any;
  billsForm: any;
  billingData: any = {
    "uid": "12382",
    "meter_uid": "58",
    "authorization_uid": "23",
    "created": "2015-03-19T20:50:41.206253+00:00",
    "updated": "2015-03-19T20:50:41.206253+00:00",
    "utility": "DEMO",
    "blocks": [
      "base",
      "sources",
      "line_items",
      "tiers"
    ],
    "base": {
      "service_identifier": "1234567890",
      "service_tariff": "E1 XB Residential Service",
      "service_class": "res-electric",
      "service_address": "123 Main St #100, Anytown, CA 94612",
      "meter_numbers": [
        "A987654321"
      ],
      "billing_contact": "ACME, INC.",
      "billing_address": "123 Main St #100, Anytown, CA 94612",
      "billing_account": "100-200-33333",
      "bill_start_date": "2015-01-07T00:00:00.000000-08:00",
      "bill_end_date": "2015-02-05T00:00:00.000000-08:00",
      "bill_total_kwh": 837.0,
      "bill_total_unit": "kwh",
      "bill_total_volume": 837.0,
      "bill_total_cost": 194.78
    },
    "sources": [
      {
        "type": "pdf",
        "raw_url": "https://utilityapi.com/api/v2/files/abc123abc123abc123"
      }
    ],
    "line_items": [
      {
        "cost": 52.88,
        "end": "2015-02-05T08:00:00.000000+00:00",
        "name": "Tier 1 Usage",
        "rate": 0.1617,
        "start": "2015-01-07T08:00:00.000000+00:00",
        "unit": "kwh",
        "volume": 327.0
      },
      {
        "cost": 18.14,
        "end": "2015-02-05T08:00:00.000000+00:00",
        "name": "Tier 2 Usage",
        "rate": 0.18491,
        "start": "2015-01-07T08:00:00.000000+00:00",
        "unit": "kwh",
        "volume": 98.1
      },
      {
        "cost": 62.54,
        "end": "2015-02-05T08:00:00.000000+00:00",
        "name": "Tier 3 Usage",
        "rate": 0.27322,
        "start": "2015-01-07T08:00:00.000000+00:00",
        "unit": "kwh",
        "volume": 228.9
      },
      {
        "cost": 60.98,
        "end": "2015-02-05T08:00:00.000000+00:00",
        "name": "Tier 4 Usage",
        "rate": 0.33322,
        "start": "2015-01-07T08:00:00.000000+00:00",
        "unit": "kwh",
        "volume": 183.0
      },
      {
        "cost": 0.24,
        "end": "2015-02-05T08:00:00.000000+00:00",
        "name": "Energy Commission Tax",
        "rate": null,
        "start": "2015-01-07T08:00:00.000000+00:00",
        "unit": null,
        "volume": null
      }
    ],
    "tiers": [
      {
        "name": "Tier 1 Usage",
        "level": 1,
        "cost": 52.88,
        "volume": 327.0,
        "unit": "kwh"
      },
      {
        "name": "Tier 2 Usage",
        "level": 2,
        "cost": 18.14,
        "volume": 98.1,
        "unit": "kwh"
      },
      {
        "name": "Tier 3 Usage",
        "level": 3,
        "cost": 62.54,
        "volume": 228.9,
        "unit": "kwh"
      },
      {
        "name": "Tier 4 Usage",
        "level": 4,
        "cost": 60.98,
        "volume": 183.0,
        "unit": "kwh"
      }
    ]
  }


  constructor(public exportServ: ExportService, public apiServ: ApiHttpService, public http: HttpClient) {
    console.log(Constants.API_ENDPOINT);


  }

  onChange(event: any) {
    console.log(event);
    const files = event.target.files;

    if (files.length == 2) {
      console.log("Both files received");

      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();

        reader.onload = () => {
          const fileText = reader.result as string;
          const jsonData = JSON.parse(fileText);

          // Distinguish the files by their content
          try {
            //Detects if there is a JSON file containing meter data
            if (jsonData?.meters !== undefined) {
              console.log("Meter data identified");

              // Directly storing the parsed JSON in the meterData variable
              this.importedmeterData = jsonData;

              //Converting the JSON to XML
              ParseService.convertJSONToXML(this.importedmeterData);
            }

            //Detects if there is a JSON file containing billing data
            else if (jsonData?.base !== undefined && 'bill_start_date' in jsonData?.base) {
              console.log("Billing data identified");

              // Directly storing the parsed JSON in the billingData variable
              this.importedbillingData = jsonData;

              //Converts the JSON to XML
              ParseService.convertJSONToXML(this.importedbillingData);
            }

            // If the file contains data we do not expect (non-billing or meter data), log an error
            else {
              console.error("Unknown file type");
            }

            ParseService.convertJSONToExcel(this.importedbillingData, this.importedmeterData);
          }
          catch (e) {
            console.log(e);
          }
        };

        reader.readAsText(file);
      });
    }

    else {
      console.log("Exactly two files were expected, but 0, 1, or 3+ were received");
    }
  }

  exportAsExcel() {
    console.log(this.exportServ.exportExcel(this.fileText))
  }
  exportAsJson() {

    // this.getForms().then( data =>{
    //   this.exportServ.exportJSON(data);
    // });

  }

  ngOnInit() {
  }

async apiNew(){
  // for new users
  try {
    const data: any = await this.apiServ.get(Constants.API_ENDPOINT1 + 'forms?' + this.accessToken);
    console.log(data)
    console.log(Constants.API_ENDPOINT1 + 'forms/' + data.forms[0].uid + '/test-submit?' + this.accessToken)
    const referral: any = await this.apiServ.post(Constants.API_ENDPOINT1 + 'forms/' + data.forms[0].uid + '/test-submit?' + this.accessToken, '{"utility": "DEMO", "scenario": "residential"}')
    console.log(referral)
    var TestauthForm: any = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations/?referrals=' + referral.referral + '&include=meters&' + this.accessToken));
      }, 25000); // 25000 milliseconds = 25 seconds
    });
    // this.authForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations/?referrals=' + referral.referral + '&' + this.accessToken + '&include=meters')

    console.log(TestauthForm);
    console.log(TestauthForm.authorizations[0].meters.meters[0].uid)
    let meterID = TestauthForm.authorizations[0].meters.meters[0].uid
    const data1: any = await this.apiServ.post(Constants.API_ENDPOINT1 + 'meters/historical-collection?' + this.accessToken, '{"meters": ['+ TestauthForm.authorizations[0].meters.meters[0].uid +']}');
    //    'https://utilityapi.com/api/v2/meters/historical-collection'
    console.log(data1);
    let ticks = 1000
    var pollMeter: any = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'meters/' + meterID + '?' + this.accessToken));
      }, ticks); // 25000 milliseconds = 25 seconds
    });
    while (pollMeter.status == "pending"){
      ticks += 5000
        pollMeter = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'meters/' + meterID + '?' + this.accessToken));
        }, ticks); // 25000 milliseconds = 25 seconds
      });
    }
    console.log(pollMeter)
    const data2: any = await this.apiServ.get(Constants.API_ENDPOINT1 + 'bills?meters='+ meterID +'&' + this.accessToken);
    console.log(data2)
    // this.authForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations/' + authToken + '?referrals=' + referral.referral + '&' + this.accessToken)
    // this.meterForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'meters?authorizations='+ authToken + '&' + this.accessToken)
    //this.billsForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'bills?authorizations=' + authToken + '&' + this.accessToken)

    //Code to handle successful response
    // console.log(this.authForm);
    // console.log(this.meterForm);
    // console.log(this.billsForm);
    //ParseService.convertJSONToExcel(this.billingData, this.meterForm)
    //this.exportServ.exportJSON(data2)
    
  } catch (error) {
    console.log(error)
  }

}

  async apiCall (authToken: string,startDate?:string,endDate?:string) {
    //for returning users that have their auth token
    console.log (authToken)
    //437638

    try {
      
      var TestauthForm: any = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations/' + authToken + '?include=meters&' + this.accessToken));
        }, 1000); // 25000 milliseconds = 25 seconds
      });
      // this.authForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations/?referrals=' + referral.referral + '&' + this.accessToken + '&include=meters')

      console.log(TestauthForm);
      console.log(TestauthForm.meters.meters[0].uid)
      let meterID = '';
      TestauthForm.meters.meters.forEach((element:any) => {
        meterID += '"'+ element.uid +'",'
      });
      meterID = meterID.slice(0,-1)
      console.log(meterID)
      const data1: any = await this.apiServ.post(Constants.API_ENDPOINT1 + 'meters/historical-collection?' + this.accessToken, '{"meters": ['+ meterID +']}');
      //    'https://utilityapi.com/api/v2/meters/historical-collection'
      meterID = meterID.replaceAll('"','')
      console.log(meterID)
      console.log(data1);
      let ticks = 1000
      var pollMeter: any = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'meters/' + meterID + '?' + this.accessToken));
        }, ticks); // 25000 milliseconds = 25 seconds
      });
      while (pollMeter.status == "pending"){
        ticks += 5000
          pollMeter = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'meters/' + meterID + '?' + this.accessToken));
          }, ticks); // 25000 milliseconds = 25 seconds
        });
      }
      console.log(pollMeter)
      let strDate = ''
      if(startDate != undefined){
        strDate = '&start='+ startDate +'&end='
      } else{
        strDate = '&start='
      }

      if(endDate != undefined){
        strDate += '&end='+ endDate
      } else{
        strDate += '&end='
      }
      // this.authForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations/' + authToken + '?referrals=' + referral.referral + '&' + this.accessToken)
      // this.meterForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'meters?authorizations='+ authToken + '&' + this.accessToken)
      //this.billsForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'bills?authorizations=' + authToken + '&' + this.accessToken)
      this.billsForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'bills?meters='+ meterID + strDate +'&' + this.accessToken); //add dates here start=YYY-MM-DD end=YYY-MM-DD


      //Code to handle successful response
      // console.log(this.authForm);
      // console.log(this.meterForm);
      console.log(this.billsForm);
      //ParseService.convertJSONToExcel(this.billingData, this.meterForm)
      //this.exportServ.exportJSON(data2)
      
    } catch (error) {
      console.log(error)
    }
  }
}
