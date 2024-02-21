import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import * as xml2js from 'xml2js';
import * as ExcelJS from 'exceljs';

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

  getKey(val: String) {
    this.authKey = val;
    alert("Your Key is " + this.authKey);
  }

  onChange(event: any) {
    console.log(event);
    this.file = event.target.files[0];

    if (this.file) {
      console.log("File received");
      const reader = new FileReader(); // Declare the FileReader variable
      reader.readAsText(this.file);
      reader.onload = () => {
        this.fileText = reader.result as String;
        console.log(this.fileText)
        this.convertXML2JSON(this.fileText);
      }
    }
  }

  export() {
    //console.log(this.exportServ.exportExcel(this.file))
  }

  convertXML2JSON = (xmlData: String) => {
    const parser = new xml2js.Parser({
      explicitArray: false, // Do not put child nodes in an array if there is only one
      mergeAttrs: true, // Merge attributes directly into the parent object
      normalize: true, // Normalize the XML into a valid JSON structure
      trim: true, // Trim whitespace from text nodes
      // Other options to come...
    });

    try {
      const result = parser.parseString(xmlData)
      console.log("JSON Output:", JSON.stringify(result, null, 4));
    }
    catch (error) {
      console.error("Error parsing XML:", error);
    }
  }

  convertJSON2XLSX = (jsonData: any) => {
    let workbook = new ExcelJS.Workbook();
    var request = new XMLHttpRequest();
    request.open("GET", "/assets/csv_templates/VERIFI-Import-Data.xlsx", true);
    request.responseType = "blob";
    request.onload = () => {
      workbook.xlsx.load(request.response).then(() => {
      });
    };
  }
};
