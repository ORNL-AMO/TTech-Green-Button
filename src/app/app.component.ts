import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import * as xml2js from 'xml2js';
import * as ExcelJS from 'exceljs';
import X2JS from 'x2js';

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
        this.convertJSONToXML(jdata);
      }
    }
  }

  convertJSONToXML(jsonData: any) {
    //Create new instance of X2JS
    var x2js: X2JS = new X2JS();

    //Translate the JSON to XML
    var xmlData: string = x2js.js2xml(jsonData);

    //Replace the string &quot; with nothing
    xmlData = xmlData.replace(/&quot;/g, '');

    //Output the XML to the console
    console.log(xmlData);
  }

  convertJSONToExcel(jsonData: any) {
    const Excel = require('exceljs');
    const workbook = new Excel.Workbook();

    const facilitiesSheet = workbook.addWorksheet('Facilities');
    const metersutilitiesSheet = workbook.addWorksheet('Meters-Utilities');
    const electricitySheet = workbook.addWorksheet('Electricity');
    const stationaryotherSheet = workbook.addWorksheet('Stationary Fuel - Other Energy');
    const mobileSheet = workbook.addWorksheet('Mobile Fuel');
    const waterSheet = workbook.addWorksheet('Water');
    const otheremmissionsSheet = workbook.addWorksheet('Other Utility - Emission');
    const predictorsSheet = workbook.addWorksheet('Predictors');


    //These keys are not accurate to the JSON at the moment
    metersutilitiesSheet.columns = [
      { header: 'Facility Name', key: "Facility Name", width: 20 },
      { header: 'Meter Number (unique)', key: "Facility ID", width: 20 },
      { header: 'Source', key: "Facility ID", width: 20 },
      { header: 'Scope', key: "Facility ID", width: 20 },
      { header: 'Meter Name (Display)', key: "Facility ID", width: 20 },
      { header: 'Meter Group', key: "Facility ID", width: 20 },
      { header: 'Calendarize Data?', key: "Facility ID", width: 20 },
      { header: 'Phase or Vehicle', key: "Facility ID", width: 20 },
      { header: 'Fuel or Emission', key: "Facility ID", width: 20 },
      { header: 'Collection Unit', key: "Facility ID", width: 20 },
      { header: 'Energy Unit', key: "Facility ID", width: 20 },
      { header: 'Distance Unit', key: "Facility ID", width: 20 },
      { header: 'Estimation Method', key: "Facility ID", width: 20 },
      { header: 'Heat Capacity or Fuel Efficiency', key: "Facility ID", width: 20 },
      { header: 'Include In Energy', key: "Facility ID", width: 20 },
      { header: 'Site To Source', key: "Facility ID", width: 20 },
      { header: 'Agreement Type', key: "Facility ID", width: 20 },
      { header: 'Retain RECS', key: "Facility ID", width: 20 },
      { header: 'Account Number', key: "Facility ID", width: 20 },
      { header: 'Utility Supplier', key: "Facility ID", width: 20 },
      { header: 'Notes', key: "Facility ID", width: 20 },
      { header: 'Building / Location', key: "Facility ID", width: 20 }
    ];




  }


  /*
    convertJSON2XLSX = (jsonData: any) => {
      let workbook = new ExcelJS.Workbook();
      var request = new XMLHttpRequest();
      request.open("GET", "/assets/csv_templates/VERIFI-Import-Data.xlsx", true);
      request.responseType = "blob";
      request.onload = () => {
        workbook.xlsx.load(request.response).then(() => {
        });
      };
    }*/
};
