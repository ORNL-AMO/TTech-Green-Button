import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { blob, json } from 'stream/consumers';



@Injectable({
  providedIn: 'root'
})

export class ExportService {
  constructor() { }
  exportExcel() {
    let workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
    sheet.getCell('A' + 2).value = "TEST";
    sheet.getCell('A' + 5).value = "Hello World";
  
    workbook.xlsx.writeBuffer()
      .then(buffer => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const blob = new Blob([buffer], { type: fileType });
  
        let a = document.createElement("a");
        let url = window.URL.createObjectURL(blob);
  
        a.href = url;
        a.download = "test.xlsx";
  
        document.body.appendChild(a);
        a.click();
  
        // Release resources associated with the URL
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
  
        console.log("Excel file exported successfully");
      })
      .catch(error => {
        console.error("Error exporting Excel file:", error);
      });
  }
  exportJSON(data:any){
    let jsonData = JSON.stringify(data,null,2);
    let fileType = 'application/json';
    const blob = new Blob([jsonData], {type:fileType});
    let a = document.createElement("a");
    let url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = "jstest.json";

    document.body.appendChild(a);
    a.click();

    // Release resources associated with the URL
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    console.log("Json file exported successfully");
  }
}
