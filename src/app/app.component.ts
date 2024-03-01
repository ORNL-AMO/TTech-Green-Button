import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import * as ExcelJS from 'exceljs';
import X2JS from 'x2js';


//These are special tools which will help us later...
//Used for converting JSON to TS Objects
export interface Root {
  uid: string
  meter_uid: string
  authorization_uid: string
  created: string
  updated: string
  utility: string
  blocks: string[]
  base: Base
  sources: Source[]
  line_items: LineItem[]
  tiers: Tier[]
}

export interface Base {
  service_identifier: string
  service_tariff: string
  service_class: string
  service_address: string
  meter_numbers: string[]
  billing_contact: string
  billing_address: string
  billing_account: string
  bill_start_date: string
  bill_end_date: string
  bill_total_kwh: number
  bill_total_unit: string
  bill_total_volume: number
  bill_total_cost: number
}

export interface Source {
  type: string
  raw_url: string
}

export interface LineItem {
  cost: number
  end: string
  name: string
  rate?: number
  start: string
  unit?: string
  volume?: number
}

export interface Tier {
  name: string
  level: number
  cost: number
  volume: number
  unit: string
}

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
        this.convertJSONToExcel(jdata);
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
    //Create a workbook
    const workbook = new ExcelJS.Workbook();

    //Add worksheets to the workbook following the VERIFI format
    const facilitiesSheet = workbook.addWorksheet('Facilities');
    const metersutilitiesSheet = workbook.addWorksheet('Meters-Utilities');
    const electricitySheet = workbook.addWorksheet('Electricity');
    const stationaryotherSheet = workbook.addWorksheet('Stationary Fuel - Other Energy');
    const mobileSheet = workbook.addWorksheet('Mobile Fuel');
    const waterSheet = workbook.addWorksheet('Water');
    const otheremmissionsSheet = workbook.addWorksheet('Other Utility - Emission');
    const predictorsSheet = workbook.addWorksheet('Predictors');

    //The below sheets are not accurate to the JSON at the moment
    //Facilities
    facilitiesSheet.columns = [
      { header: 'Facility Name', key: "Facility Name", width: 20 },
      { header: 'Address', key: "Address", width: 20 },
      { header: 'Country', key: "Country", width: 20 },
      { header: 'State', key: "State", width: 20 },
      { header: 'City', key: "City", width: 20 },
      { header: 'NAICS Code 2 digit', key: "NAICS Code 2 digit", width: 20 },
      { header: 'NAICS Code 3 digit', key: "NAICS Code 3 digit", width: 20 },
      { header: 'Contact Name', key: "Contact Name", width: 20 },
      { header: 'Contact Phone', key: "Contact Phone", width: 20 },
      { header: 'Contact Email', key: "Contact Email", width: 20 },
    ];


    metersutilitiesSheet.columns = [
      { header: 'Facility Name', key: "Facility Name", width: 20 },
      { header: 'Meter Number (unique)', key: "Meter Number (unique)", width: 20 },
      { header: 'Source', key: "Source", width: 20 },
      { header: 'Scope', key: "Scope", width: 20 },
      { header: 'Meter Name (Display)', key: "Meter Name (Display)", width: 20 },
      { header: 'Meter Group', key: "Meter Group", width: 20 },
      { header: 'Calendarize Data?', key: "Calendarize Data?", width: 20 },
      { header: 'Phase or Vehicle', key: "Phase or Vehicle", width: 20 },
      { header: 'Fuel or Emission', key: "Fuel or Emission", width: 20 },
      { header: 'Collection Unit', key: "Collection Unit", width: 20 },
      { header: 'Energy Unit', key: "Energy Unit", width: 20 },
      { header: 'Distance Unit', key: "Distance Unit", width: 20 },
      { header: 'Estimation Method', key: "Estimation Method", width: 20 },
      { header: 'Heat Capacity or Fuel Efficiency', key: "Heat Capacity or Fuel Efficiency", width: 20 },
      { header: 'Include In Energy', key: "Include In Energy", width: 20 },
      { header: 'Site To Source', key: "Site To Source", width: 20 },
      { header: 'Agreement Type', key: "Agreement Type", width: 20 },
      { header: 'Retain RECS', key: "Retain RECS", width: 20 },
      { header: 'Account Number', key: "Account Number", width: 20 },
      { header: 'Utility Supplier', key: "Utility Supplier", width: 20 },
      { header: 'Notes', key: "Notes", width: 20 },
      { header: 'Building / Location', key: "Building / Location", width: 20 }
    ];

    electricitySheet.columns = [
      { header: 'Meter Number', key: "Meter Number", width: 20 },
      { header: 'Read Date', key: "Read Date", width: 20 },
      { header: 'Total Consuption', key: "Total Consuption", width: 20 },
      { header: 'Total Real Demand', key: "Total Real Demand", width: 20 },
      { header: 'Total Billed Demand', key: "Total Billed Demand", width: 20 },
      { header: 'Total Cost', key: "Total Cost", width: 20 },
      { header: 'Non-energy Charge', key: "Non-energy Charge", width: 20 },
      { header: 'Block 1 Consuption', key: "Block 1 Consuption", width: 20 },
      { header: 'Block 1 Consuption Charge', key: "Block 1 Consuption Charge", width: 20 },
      { header: 'Block 2 Consuption', key: "Block 2 Consuption", width: 20 },
      { header: 'Block 2 Consuption Charge', key: "Block 2 Consuption Charge", width: 20 },
      { header: 'Block 3 Consuption', key: "Block 3 Consuption", width: 20 },
      { header: 'Block 3 Consuption Charge', key: "Block 3 Consuption Charge", width: 20 },
      { header: 'Other Consuption', key: "Other Consuption", width: 20 },
      { header: 'Other Consuption Charge', key: "Other Consuption Charge", width: 20 },
      { header: 'On Peak Amount', key: "On Peak Amount", width: 20 },
      { header: 'On Peak Charge', key: "On Peak Charge", width: 20 },
      { header: 'Off Peak Amount', key: "Off Peak Amount", width: 20 },
      { header: 'Off Peak Charge', key: "Off Peak Charge", width: 20 },
      { header: 'Transmission & Delivery Charge', key: "Transmission & Delivery Charge", width: 20 },
      { header: 'Power Factor', key: "Power Factor", width: 20 },
      { header: 'Power Factor Charge', key: "Power Factor Charge", width: 20 },
      { header: 'Local Sales Tax', key: "Local Sales Tax", width: 20 },
      { header: 'State Sales Tax', key: "State Sales Tax", width: 20 },
      { header: 'Late Payment', key: "Late Payment", width: 20 },
      { header: 'Other Charge', key: "Other Charge", width: 20 }
    ];

    stationaryotherSheet.columns = [
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

    mobileSheet.columns = [
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

    waterSheet.columns = [
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

    otheremmissionsSheet.columns = [
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

    predictorsSheet.columns = [
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



    workbook.xlsx.writeBuffer()
      .then((buffer: BlobPart) => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const blob = new Blob([buffer], { type: fileType });

        let a = document.createElement("a");
        let url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = "convertedData.xlsx";

        document.body.appendChild(a);
        a.click();

        // Release resources associated with the URL
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log("Excel file exported successfully");
      })
      .catch((error: any) => {
        console.error("Error exporting Excel file:", error);
      });





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
