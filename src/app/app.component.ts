import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import { ParseService} from './parse.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LogoButtonComponent, NgbModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'World';
  file!: File;
  fileText!: String;
  authKey: String = '';

  constructor(public exportServ: ExportService) { }

  export() {
    //console.log(this.exportServ.exportExcel(this.file))
  }

  getKey(val: String) {
    this.authKey = val;
    alert("Your Key is " + this.authKey);
  }

  onChange(event: any) {
    console.log(event);
    this.file = event.target.files[0];

    if (this.file) {
      console.log("File received");

      // Declare the FileReader variable
      const reader = new FileReader();
      reader.readAsText(this.file);
      reader.onload = () => {
        let jdata: string = JSON.parse(reader.result as string);
        console.log(jdata);
        ParseService.convertJSONToXML(jdata);
        ParseService.convertJSONToExcel(jdata);
      }
    }
  }
};
