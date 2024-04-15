import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';



@Injectable({
  providedIn: 'root'
})

export class ExportService {
  constructor() { }
  static exportExcel(workbook: ExcelJS.Workbook) {

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

  static exportJSON(data:any){
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
  
  static exportXML(data:any){
    let fileType= 'application/xml';
    const blob = new Blob([data],{type:fileType});
    let a = document.createElement("a");
    let url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = "xmltest.xml";

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    console.log("XML file exported successfully");
  }
}
