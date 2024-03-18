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

  constructor(public exportServ: ExportService, public apiServ:ApiHttpService, public http: HttpClient){
    console.log(Constants.API_ENDPOINT); 

  }
  getKey(val:String){
    this.authKey = val;
    alert("Your Key is " + this.authKey);
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
      ParseService.convertJSONToExcel(jdata);
      console.log(this.fileText)
    }
    reader.readAsText(this.file);
    }
  }

  exportAsExcel(){
    console.log( this.exportServ.exportExcel(this.fileText))
  }
  exportAsJson(){
  
    this.getForms().then( data =>{
      this.exportServ.exportJSON(data);
    });

  }

  ngOnInit() { 
    console.log(this.apiTitle); 
  } 
  async getForms():Promise<any>{
    console.log(Constants.API_ENDPOINT1 + 'forms?' + this.accessToken)
    try{
      const data = await lastValueFrom(this.http.get<any>(Constants.API_ENDPOINT1 + 'forms?' + this.accessToken))
      const test = data.forms[0];
      //console.log(test)
      return test;
    } catch (error){
      console.log("error")
    }
  }
}
