import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import * as xml2js from 'xml2js';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
XLSX.set_fs(fs);

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
      reader.onload = () => {
        this.fileText = reader.result as String;
        console.log(this.fileText)
        this.convertXML2JSON(this.fileText);
      }
      reader.readAsText(this.file);
      this.exportServ.exportExcel(this.file);
    }
  }

  export() {
    //console.log(this.exportServ.exportExcel(this.file))
  }

  convertXML2JSON = async (xmlData: String): Promise<void> => {
    const parser = new xml2js.Parser({
      explicitArray: false, // Do not put child nodes in an array if there is only one
      mergeAttrs: true, // Merge attributes directly into the parent object
      normalize: true, // Normalize the XML into a valid JSON structure
      trim: true, // Trim whitespace from text nodes
      // Other options to come...
    });

    try {
      const result = await parser.parseStringPromise(xmlData);
      console.log("JSON Output:", JSON.stringify(result, null, 4));
    }
    catch (error) {
      console.error("Error parsing XML:", error);
    }
  }
};
