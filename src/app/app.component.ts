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


// takes in email and loops through all authorizations on the account to find authorized accounts with the email
async apiFindEmail(email: string){
  console.log('finding email')
  var allAuthForm: any = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations/?' + this.accessToken));
    }, 25000); // 25000 milliseconds = 25 seconds
  });
  var arrFound:any = []

  allAuthForm.authorizations.forEach((element: any) => {
    if(email.toLowerCase() == element.customer_email.toLowerCase()){
      console.log('email found')
      if(element.uid != 'undefined'){
        arrFound.push('email: '+email+' authID: '+ element.uid +'\n')
      }else{
        console.log('email '+email+' not found')
      }
    }
  });
  if(arrFound.length == 0){
    alert('email not found')
  }else {
    alert(arrFound)
  }
}

async apiNew(){
  // generates new users for testing
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

    console.log(TestauthForm)
 
  } catch (error) {
    console.log(error)
  }

}

  async apiCall (authToken: string,startDate?:string,endDate?:string) {
    //for returning users that have their auth token
    console.log (authToken)
    //mark token 436742
    //437638
    try {
      var TestauthForm: any = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations/' + authToken + '?include=meters&' + this.accessToken));
        }, 1000); // 25000 milliseconds = 25 seconds
      });
      console.log(TestauthForm);
      console.log(TestauthForm.meters.meters[0].uid)

      // creates a string of meter numbers to be use in the meters post below
      let meterID = '';
      TestauthForm.meters.meters.forEach((element:any) => { 
        meterID += '"'+ element.uid +'",'
      });
      meterID = meterID.slice(0,-1)
      console.log(meterID)

      const meterHist: any = await this.apiServ.post(Constants.API_ENDPOINT1 + 'meters/historical-collection?' + this.accessToken, '{"meters": ['+ meterID +']}');

      //removes all " in the string because they are no longer needed
      meterID = meterID.replaceAll('"','') 
      console.log(meterID)

      // Calls utilityAPI and has to wait for it to populate with data. This can take a while usually under 2 min
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

      // allows for use of start and end date when getting billing data 
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
      this.billsForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'bills?meters='+ meterID + strDate +'&' + this.accessToken); //add dates here start=YYY-MM-DD end=YYY-MM-DD

      //calls the parse and export functions when needed.
      console.log(this.billsForm);
      ParseService.convertJSONToExcel(this.billsForm, this.meterForm)
      //this.exportServ.exportJSON(this.billsForm);

    } catch (error) {
      console.log(error)
    }
  }
}
