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


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LogoButtonComponent,NgbModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']


})
export class AppComponent implements OnInit{
  apiTitle = Constants.TitleOfSite; 
  title = 'World';    
  file!:File;
  fileText!:String;
  authKey:String = '';
  accessToken:String ='access_token=3959c8c3f5a44d9cad67534d9910d1b9'; // this is the authorization key for the account that we are using for testing. Change this code to use a different account 
  formUid:any
  referralId:any


  constructor(public exportServ: ExportService, public apiServ:ApiHttpService, public http: HttpClient){
    console.log(Constants.API_ENDPOINT); 

  }
  getKey(val:String){
    this.authKey = val;
    //alert("Your Key is " + this.authKey);

    
    
  }
  onChange(event:any){
    console.log(event);
    this.file = event.target.files[0];

    if(this.file){
      console.log("File recieved");
    const reader = new FileReader();
    reader.onload =()=>{
      this.fileText = reader.result as String;
      console.log(this.fileText)
    }
    reader.readAsText(this.file);
    }
  }

  export(){
    console.log( this.exportServ.exportExcel())
  }


  ngOnInit() { 
    console.log(this.apiTitle);

  } 

 

  async apiCall(){

    try{
    const data:any = await this.apiServ.get(Constants.API_ENDPOINT1 + 'forms?' + this.accessToken); 
    console.log(data)
    console.log(Constants.API_ENDPOINT1 + 'forms/' +data.forms[0].uid+'/test-submit?' + this.accessToken)
    const referral:any = await this.apiServ.post(Constants.API_ENDPOINT1 + 'forms/' +data.forms[0].uid+'/test-submit?' + this.accessToken,'{"utility": "DEMO", "scenario": "residential"}')
    console.log(referral)
    // const authForm:any = await this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations?referrals='+referral.referral+'&include=meters&' + this.accessToken)
    // console.log(authForm)
    try {
      let ticks = 1000
      let authForm: any = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations?referrals=' + referral.referral + '&include=meters&' + this.accessToken));
        }, ticks); // 25000 milliseconds = 25 seconds
      });
      while (authForm.authorizations[0].status == "pending"){
        ticks += 5000
          authForm = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.apiServ.get(Constants.API_ENDPOINT1 + 'authorizations?referrals=' + referral.referral + '&include=meters&' + this.accessToken));
          }, ticks); // 25000 milliseconds = 25 seconds
        });
      }
      // Code to handle successful response
      console.log(authForm);
    } catch (error) {
      // Code to handle error
      console.error(error);
    }
    //console.log(authForm.status)
    
  } catch (error){
      console.log("Error")
    }


  }

}
