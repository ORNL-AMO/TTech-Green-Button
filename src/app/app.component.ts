import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import { OnInit } from '@angular/core';
import{ Constants } from './config/constants';
import { ApiHttpService } from './api.service';
import { HttpClient } from '@angular/common/http'; 
import { lastValueFrom } from 'rxjs';
import { ParseService} from './parse.service';
import internal from 'node:stream';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LogoButtonComponent, NgbModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']


})
export class AppComponent implements OnInit{
  apiTitle = Constants.TitleOfSite; 
  title = 'World';    
  file!:File;
  fileText!:any;
  displayFile!:String;
  authKey:String = '';
  accessToken:String ='access_token=3959c8c3f5a44d9cad67534d9910d1b9'; // this is the authorization key for the account that we are using for testing. Change this code to use a different account 
  formUid:any;
  referralId:any;
  authForm: any;
  meterForm: any;
  billsForm: any;


  constructor(public exportServ: ExportService, public apiServ:ApiHttpService, public http: HttpClient){
    console.log(Constants.API_ENDPOINT); 


  }

  onChange(event: any) {
    console.log(event);
    this.file = event.target.files[0];

    if(this.file){
      console.log("File recieved");
    const reader = new FileReader();
    reader.onload =()=>{
      this.fileText = reader.result as String;
      let jdata: string = JSON.parse(reader.result as string);
      console.log(jdata);
      ParseService.convertJSONToXML(jdata);
      //ParseService.convertJSONToExcel(jdata);
      console.log(this.fileText)
    }
    reader.readAsText(this.file);
    }
  }

  exportAsExcel(){
    console.log( this.exportServ.exportExcel(this.fileText))
  }
  exportAsJson(){
  
    // this.getForms().then( data =>{
    //   this.exportServ.exportJSON(data);
    // });

  }


  ngOnInit() { 
  } 

 

  async apiCall(key:string){
    console.log(key)

    try{
    const data:any = await this.apiServ.get(Constants.API_ENDPOINT1 + 'forms?' + this.accessToken); 
    console.log(data)
    console.log(Constants.API_ENDPOINT1 + 'forms/' +data.forms[0].uid+'/test-submit?' + this.accessToken)
    const referral:any = await this.apiServ.post(Constants.API_ENDPOINT1 + 'forms/' +data.forms[0].uid+'/test-submit?' + this.accessToken,'{"utility": "DEMO", "scenario": "residential"}')
    console.log(referral)
    this.authForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations/' + key +'?referrals=' + referral.referral + '&' + this.accessToken)
    this.meterForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'meters?' + this.accessToken)
    this.billsForm = await this.apiServ.get(Constants.API_ENDPOINT1 + 'bills?authorizations=' + key + '&' +  this.accessToken)

      //Code to handle successful response
      console.log(this.authForm);
      console.log(this.meterForm);
      console.log(this.billsForm);    
      ParseService.convertJSONToExcel(this.billsForm)
      this.exportServ.exportJSON(this.authForm)
      this.exportServ.exportJSON(this.meterForm)
      this.exportServ.exportJSON(this.billsForm)

  } catch (error){
      console.log(error)
    }
  }
}
