import { Component ,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import { OnInit } from '@angular/core';
import { Constants } from './config/constants';
import { ApiHttpService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { ParseService } from './parse.service';
import * as ExcelJS from 'exceljs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LogoButtonComponent, NgbModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']


})
export class AppComponent implements OnInit {
  apiTitle = Constants.TitleOfSite;
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
  parsedWorkbook!:ExcelJS.Workbook;

  constructor(public exportServ: ExportService, public apiServ:ApiHttpService, public http: HttpClient){
    console.log(Constants.API_ENDPOINT); 
  }

  onChange(event: any) {
    console.log(event);
    this.file = event.target.file;

    if(this.file){
      console.log("File recieved");
      const reader = new FileReader();
      reader.onload =async ()=>{
        let jdata: string = JSON.parse(reader.result as string);
        console.log(jdata);
        this.parsedWorkbook = await ParseService.convertJSONToExcel(this.billsForm)
        this.fileText = ParseService.convertExcelToJson(this.parsedWorkbook);
        this.displayFile = '<div class="card bg-light"><div class="card-header"><h3>Export Data</h3></div><div class="card-body"><p>'+JSON.stringify(this.fileText,null,2)+'</p></div></div>';
    }
    reader.readAsText(this.file);
    }
  }

  exportAsExcel() {
    ExportService.exportExcel(this.parsedWorkbook)
  }
  exportAsJson() {
    ExportService.exportJSON(this.fileText);
  }
  exportAsXML(){
    let xmlData = ParseService.convertJSONToXML(this.fileText)
    ExportService.exportXML(xmlData);
  }
  ngOnInit() {
  }

// takes in email and loops through all authorizations on the account to find authorized accounts with the email
async apiFindEmail(email: string){
  console.log('finding email')
  let divSearching = document.getElementById("divSearching") as HTMLElement;
  divSearching.style.display = 'block';
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

  divSearching.style.display='none';
  
  if(arrFound.length == 0){
    alert('email not found')
  }else {
    alert(arrFound)
  }
}

  async apiCall (authToken: string,startDate?:string,endDate?:string) {
    //for returning users that have their auth token
    console.log (authToken)

    const button = document.getElementById("spin-button")as HTMLButtonElement;
    button.classList.add("spin");
    button.disabled=true;
    let divLoading = document.getElementById("divLoading") as HTMLElement;
    divLoading.style.display = 'block';
    try {
      var TestauthForm: any = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations/' + authToken + '?include=meters&' + this.accessToken));
        }, 1000); // 25000 milliseconds = 25 seconds
      });
      console.log(TestauthForm);

      // creates a string of meter numbers to be use in the meters post below
      let meterID = '';
      TestauthForm.meters.meters.forEach((element:any) => { 
        meterID += '"'+ element.uid +'",'
      });
      meterID = meterID.slice(0,-1)

      const meterHist: any = await this.apiServ.post(Constants.API_ENDPOINT1 + 'meters/historical-collection?' + this.accessToken, '{"meters": ['+ meterID +']}');

      //removes all " in the string because they are no longer needed
      meterID = meterID.replaceAll('"','') 

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
      this.parsedWorkbook = await ParseService.convertJSONToExcel(this.billsForm)
      this.fileText = ParseService.convertExcelToJson(this.parsedWorkbook)
      this.displayFile = '<div class="card bg-light"><div class="card-header"><h3>Export Data</h3></div><div class="card-body"><p>'+JSON.stringify(this.fileText,null,2)+'</p></div></div>';

    } catch (error) {
      console.log(error)
    }
    button.disabled=false;
    button.classList.remove("spin");
    divLoading.style.display='none';
  }
  
}
