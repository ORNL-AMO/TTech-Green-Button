import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogoButtonComponent } from './logo-button/logo-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from './export.service';
import { parseString } from 'xml2js'; 
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
        this.parseXmlData(this.fileText);
      }
      reader.readAsText(this.file);
      this.exportServ.exportExcel(this.file);
    }
  }

  export() {
    //console.log(this.exportServ.exportExcel(this.file))
  }
  parseXmlData(xmlData: String){
    parseString(xmlData, (err, result) => {
      if(err){
        console.log(err);
      } else {
        console.log('Parsed XML Result', result);
        xml2js.parseString(xmlData, (err, result) => {
          if (err) {
            console.error('Error parsing XML:', err);
          } else {
            
            
            const feedId = result['atom:feed']['atom:id'][0];
            const feedTitle = result['atom:feed']['atom:title'][0];
            const entries = result['atom:feed']['atom:entry'];

            console.log('Feed ID:', feedId);
            console.log('Feed Title:', feedTitle);
            const excelData: any[] = [];
            const headers = [feedId, feedTitle, 'Service Category', 'Status', 'Commodity', 'Currency'];  
            excelData.push(headers);
            
            entries.forEach((entry: any) => {
              if (entry && entry['atom:content'] && entry['atom:title']) {
                const entryContent = entry['atom:content'][0];
                const entryId = entry['atom:id'] && entry['atom:id'][0];
                const entryTitle = entry['atom:title'] && entry['atom:title'][0];
        
              console.log('\nEntry ID:', entryId);
              console.log('Entry Title:', entryTitle);
        
              if (entryContent) {
                const nsUsagePoint = entryContent['ns:UsagePoint'];
                const meterReading = entryContent['MeterReading xmlns="http://naesb.org/espi"'];
                const intervalBlock = entryContent['ns:IntervalBlock'];
                const readingType = entryContent['ns:ReadingType'];
                const electricPowerUsageSummary = entryContent['ns:ElectricPowerUsageSummary'];
          
                if (nsUsagePoint) {
                  const serviceCategory = nsUsagePoint['ns:ServiceCategory'] && nsUsagePoint['ns:ServiceCategory'][0]['ns:kind'] && nsUsagePoint['ns:ServiceCategory'][0]['ns:kind'][0];
                  const status = nsUsagePoint['ns:status'] && nsUsagePoint['ns:status'][0];
                  console.log('Service Category:', serviceCategory);
                  console.log('Status:', status);
                  const data = [serviceCategory, status];
                  excelData.push(data);
                }
          
                if (meterReading) {
                  console.log('Meter Reading Entry Detected');
                  
                }
          
                if (intervalBlock) {
                  console.log('Interval Block Entry Detected');
                }
        
              if (readingType) {
                const commodity = readingType['ns:commodity'] && readingType['ns:commodity'][0];
                const currency = readingType['ns:currency'] && readingType['ns:currency'][0];
                console.log('Commodity:', commodity);
                console.log('Currency:', currency);
                const data = [commodity, currency];
                excelData.push(data);
              }
        
              if (electricPowerUsageSummary) {
                console.log('Electric Power Usage Summary Entry Detected');
              }
              }
            }
            });
            console.log(excelData);
            const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'EnergyUsage.xlsx');
          }
        });
        
      }
    });
  }
}
