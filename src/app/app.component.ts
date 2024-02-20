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
import { constants } from 'node:buffer';
import { stringify } from 'node:querystring';
import { parse } from 'node:path';
import { count } from 'node:console';
import { SourceTextModule } from 'node:vm';

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

  constructor(public exportServ: ExportService, public apiServ:ApiHttpService, public http: HttpClient){
    console.log(Constants.API_ENDPOINT); 

  }
  getKey(val:String){
    this.authKey = val;
    //alert("Your Key is " + this.authKey);
    console.log('from key'+this.uid)
    console.log(this.authMeters)
    
    
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
  returnForm: any
  uid!: String
  authMeters: any
  getForms(){
    this.http.get(Constants.API_ENDPOINT1 + 'forms?' + this.accessToken).subscribe(data => {
      //option 1
      this.returnForm = data
      //console.log(this.returnForm.forms[0].uid)
      this.uid = this.returnForm.forms[0].uid;
      console.log('this one is '+this.uid)
      // option 2
      let stringData = JSON.stringify(data,null,2)
      let parseData = JSON.parse(stringData)
      //console.log(parseData.forms[0].uid)
      console.log('This is uid ' + this.uid);
      this.http.post(Constants.API_ENDPOINT1 + 'forms/' +this.uid+'/test-submit?' + this.accessToken,'{"utility": "DEMO", "scenario": "residential"}').subscribe(data => {
        console.log(data)
        let referral:any = data;
        console.log(Constants.API_ENDPOINT1 + 'authorizations?referrals='+referral.referral+'&include=meters&' + this.accessToken)
        this.http.get(Constants.API_ENDPOINT1 + 'authorizations?referrals='+referral.referral+'&include=meters&' + this.accessToken).subscribe(data => {
          console.log(data);
          this.authMeters = data
          this.http.get('https://utilityapi.com/api/v2/files/meters_bills_csv?meters=1540205&'+this.accessToken,{responseType:'text'}).subscribe(data =>{
            console.log(data)
            
            let test = JSON.stringify(data, null, 2);
            let test2 = JSON.parse(test)
            let blobl:any = data;
            
            console.log(test2.utility_service_id)
          })
          });
      });
    });
    //let uid: String = this.returnForm.forms[0].uid;


  }

  apiCall(){

  }
}
