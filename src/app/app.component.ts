import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import { OnInit } from '@angular/core';
import{ Constants } from './config/constants';
import { ApiHttpService } from './api.service';

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

  constructor(public exportServ: ExportService){
    console.log(Constants.API_ENDPOINT); 
  }
  getKey(val:String){
    this.authKey = val;
    alert("Your Key is " + this.authKey);
    
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

  exportAsExcel(){
    console.log( this.exportServ.exportExcel())
  }
  exportAsJson(){
    console.log( this.exportServ.exportJSON())
  }

  ngOnInit() { 
    console.log(this.apiTitle); 
  } 

  getForms(){
    console.log('https://utilityapi.com/api/v2/forms')
  }
}
