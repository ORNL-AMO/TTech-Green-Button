import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LogoButtonComponent,NgbModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'World';    
  file!:File;
  fileText!:String;
  authKey:String = '';

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
}
