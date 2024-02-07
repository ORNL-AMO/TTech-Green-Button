import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';



@Injectable({
  providedIn: 'root'
})

export class ExportService {
  constructor() { }
  exportExcel(jsonData: any) {
    let workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Loop through each object in the JSON data
    for (let i = 0; i < jsonData.length; i++) {
      let row = worksheet.getRow(i + 1); // Start at row 2 to skip the header row

      // Loop through each property in each object
      for (let key in jsonData[i]) {
        let cell = row.getCell(key);
        cell.value = jsonData[i][key];
      }
    }

    workbook.xlsx.writeBuffer()
      .then(buffer => {
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
      .catch(error => {
        console.error("Error exporting Excel file:", error);
      });
  }

}
