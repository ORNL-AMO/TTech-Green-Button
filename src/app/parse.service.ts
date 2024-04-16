import { rejects } from 'assert';
import { error } from 'console';
import * as ExcelJS from 'exceljs';
import { resolve } from 'path';
import X2JS from 'x2js';

export class ParseService {
  constructor() { }

  /**
 * Converts the given JSON data into XML format.
 *
 * @param jsonData The JSON data to be converted into XML.
 * @returns The XML representation of the input JSON data.
 */
  static convertJSONToXML(jsonData: any) {
    //Create new instance of X2JS
    let x2js: X2JS = new X2JS();

    //Translate the JSON to XML
    let xmlData: string = x2js.js2xml(jsonData);

    //Replace the string &quot; with nothing
    xmlData = xmlData.replace(/&quot;/g, '');

    //Output the XML to the console
    console.log(xmlData);
    return xmlData;
  }

  /**
 * Converts JSON data into an Excel file.
 * @param {any} billingData - The JSON data to be converted into an Excel file.
 * @returns {ExcelJS.Workbook} - The created Excel file.
 */
  static async convertJSONToExcel(billingData: any) {
    return new Promise<ExcelJS.Workbook>((resolve,reject) =>{
      // create workbook
      let workbook = new ExcelJS.Workbook();
      var request = new XMLHttpRequest();
      request.open('GET', 'assets/VERIFI-Import-Data.xlsx', true);
      request.responseType = 'blob';
      request.onload = () =>{
        workbook.xlsx.load(request.response).then(()=>{
          // get worksheets
            let facilityWorksheet:ExcelJS.Worksheet = workbook.getWorksheet('Facilities')!;
            let metersWorksheet:ExcelJS.Worksheet = workbook.getWorksheet('Meters-Utilities')!;
            let electricityWorksheet:ExcelJS.Worksheet = workbook.getWorksheet('Electricity')!;
            let predictorsWorksheet:ExcelJS.Worksheet = workbook.getWorksheet('Predictors')!;
            let pindex = 2;
            let findex = 2;
            let eindex = 2;
            let mindex = 2;
            const facilitiesSet = new Set<String>();
            const metersSet = new Set<String>();
            billingData.bills.forEach((bill: any) => {
              let facilitiesObj = {
                "Facility Name": bill.base.billing_contact,
                "Address": bill.base.service_address.split(",")[0],
                "Country": "US",
                "City": bill.base.service_address.split(",")[1],
                "State": bill.base.service_address.split(",")[2].substring(0, 3),
                "Contact Name": bill.base.billing_contact,
              }
              if (!facilitiesSet.has(JSON.stringify(facilitiesObj))) {
                facilitiesSet.add(JSON.stringify(facilitiesObj))
                // Facility Name
                facilityWorksheet.getCell('A'+findex).value = bill.base.billing_contact;
                // Facility Address
                facilityWorksheet.getCell('B'+findex).value = bill.base.service_address.split(",")[0]
                // Facility Country
                facilityWorksheet.getCell('C'+findex).value = "United States of America (the)";
                // Facility State
                facilityWorksheet.getCell('D'+findex).value = bill.base.service_address.split(",")[2].trim().split(' ')[0]
                // Facility City
                facilityWorksheet.getCell('E'+findex).value = bill.base.service_address.split(",")[1];
                // Facility Zip
                facilityWorksheet.getCell('F'+findex).value = bill.base.service_address.split(",")[2].trim().split(' ')[1]
                // Facility Contact Name
                facilityWorksheet.getCell('J'+findex).value = bill.base.billing_contact;
                findex++
              }
              let metersObj = {
                "Facility Name": bill.base.billing_contact,
                "Meter Number (unique)": bill.meter_uid,
                "Source": bill.base.service_class,
                "Meter Name (Display)": bill.base.service_tariff,
                "Collection Unit": bill.base.bill_total_unit
              }
              if (!metersSet.has(JSON.stringify(metersObj))) {
                metersSet.add(JSON.stringify(metersObj))
                 //A: Facility name
                  metersWorksheet.getCell('A' + mindex).value = bill.base.billing_contact;
                  //B: Metter Number (unique)
                  metersWorksheet.getCell('B' + mindex).value = bill.meter_uid;
                  //C: Source
                  if(bill.base.service_class == "electric"){
                    //C: Source
                    metersWorksheet.getCell('C' + mindex).value = "Electricity";
                    //D: Scope
                    metersWorksheet.getCell('D' + mindex).value = "Scope 2: Purchased Electricity";
                    //F: Meter Group
                    metersWorksheet.getCell('F' + mindex).value = "Electricity";
                    //G: Calendarize Data?
                    metersWorksheet.getCell('G' + mindex).value = "Calendarize";
                  }
                  
                  //E: Meter Name (Display)
                  metersWorksheet.getCell('E' + mindex).value = bill.base.service_tariff;
                  //J: Collection Unit
                  if(bill.base.bill_total_unit == "kwh"){
                    metersWorksheet.getCell('J' + mindex).value = "kWh";
                  }
                  
                  //P: Site To Source
                  metersWorksheet.getCell('P' + mindex).value = 3;
                  mindex++;
              }

              // add to predictors sheet
              // Facility Name
              predictorsWorksheet.getCell('A' + pindex).value = bill.base.billing_contact;
              // Date
              predictorsWorksheet.getCell('B' + pindex).value = bill.base.bill_end_date;
              pindex++;

              // add to electricity sheet
              //A: Meter Number
              electricityWorksheet.getCell('A' + eindex).value = bill.meter_uid;
              //B: Read Date
              electricityWorksheet.getCell('B' + eindex).value = bill.base.bill_end_date;
              //C: Total Consumption
              electricityWorksheet.getCell('C' + eindex).value = bill.base.bill_total_kwh;
              //F: Total Cost
              electricityWorksheet.getCell('F' + eindex).value = bill.base.bill_total_cost;
              eindex++;
            })

            resolve(workbook);
          }).catch((error):void =>{
            reject(error)
          })
        }
        request.send();
      })

    
  }

  /**
 * Converts an Excel file to JSON format.
 * @param {ExcelJS.Workbook} workbook - The Excel file to be converted into JSON.
 * @returns {any} - The JSON representation of the input Excel file.
 */
  static convertExcelToJson(workbook: ExcelJS.Workbook): any {
    let jsonData: { sheetName: string; data: object[] }[] = [];
    workbook.eachSheet((worksheet) => {
      let sheetData: object[] = [];
      worksheet.eachRow((row) => {
        let rowData: { [key: string]: any } = {};
        row.eachCell((cell, colNumber) => {
          rowData[`Column${colNumber}`] = cell.value;
        });
        sheetData.push(rowData);
      });
      jsonData.push({ sheetName: worksheet.name, data: sheetData });
    });
    return jsonData;
  };
}
