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
  apiKey:String ='?access_token=3959c8c3f5a44d9cad67534d9910d1b9'; // this is the authorization key for the account that we are using for testing. Change this code to use a different account 

  constructor(public exportServ: ExportService, public apiServ:ApiHttpService, public http: HttpClient){
    console.log(Constants.API_ENDPOINT); 

  }
  getKey(val:String){
    this.authKey = val;
    //alert("Your Key is " + this.authKey);

    this.apiServ.get('https://utilityapi.com/api/v2/authorizations?access_token=3959c8c3f5a44d9cad67534d9910d1b9').subscribe(data => {
      console.log(data)
    });
    
    
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

  getForms(){
    this.http.get(Constants.API_ENDPOINT1 + 'forms' + this.apiKey).subscribe(data => {
      data = JSON.stringify(data,null,2)
      let result:any = JSON.parse(data as string)
      console.log(result.uid as object);
    });
  }

  apiCall(){

  }
}
