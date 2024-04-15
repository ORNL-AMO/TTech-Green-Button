import * as ExcelJS from 'exceljs';
import X2JS from 'x2js';

export class ParseService {
  constructor() { }

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

  static convertJSONToExcel(billingData: any) {
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

    //Meters-Utilities
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

    //Electricity
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

    //Stationary Fuel - Other Energy
    stationaryotherSheet.columns = [
      { header: 'Meter Number', key: "Meter Number", width: 20 },
      { header: 'Read Date', key: "Read Date", width: 20 },
      { header: 'Total Consumption', key: "Total Consumption", width: 20 },
      { header: 'Total Cost', key: "Total Cost", width: 20 },
      { header: 'Higher Heating Value', key: "Higher Heating Value", width: 20 },
      { header: 'Commodity Charge', key: "Commodity Charge", width: 20 },
      { header: 'Delivery Charge', key: "Delivery Charge", width: 20 },
      { header: 'Other Charge', key: "Other Charge", width: 20 },
      { header: 'Demand Usage', key: "Demand Usage", width: 20 },
      { header: 'Demand Charge', key: "Demand Charge", width: 20 },
      { header: 'Local Sales Tax', key: "Local Sales Tax", width: 20 },
      { header: 'State Sales Tax', key: "State Sales Tax", width: 20 },
      { header: 'Late Payment', key: "Late Payment", width: 20 },
    ];

    //Mobile Fuel
    mobileSheet.columns = [
      { header: 'Meter Number', key: "Meter Number", width: 20 },
      { header: 'Read Date', key: "Read Date", width: 20 },
      { header: 'Total Consumption or Total Distance', key: "Total Consumption or Total Distance", width: 20 },
      { header: 'Fuel Efficiency', key: "Fuel Efficiency", width: 20 },
      { header: 'Total Cost', key: "Total Cost", width: 20 },
      { header: 'Other Charge', key: "Other Charge", width: 20 }
    ];

    //Water
    waterSheet.columns = [
      { header: 'Meter Number', key: "Meter Number", width: 20 },
      { header: 'Read Date', key: "Read Date", width: 20 },
      { header: 'Total Consuption', key: "Total Consuption", width: 20 },
      { header: 'Total Cost', key: "Total Cost", width: 20 },
      { header: 'Commodity Charge', key: "Commodity Charge", width: 20 },
      { header: 'Delivery Charge', key: "Delivery Charge", width: 20 },
      { header: 'Other Charge', key: "Other Charge", width: 20 },
      { header: 'Demand Usage', key: "Demand Usage", width: 20 },
      { header: 'Demand Charge', key: "Demand Charge", width: 20 },
      { header: 'Local Sales Tax', key: "Local Sales Tax", width: 20 },
      { header: 'State Sales Tax', key: "State Sales Tax", width: 20 },
      { header: 'Late Payment', key: "Late Payment", width: 20 },
    ];

    //Other Utility - Emission
    otheremmissionsSheet.columns = [
      { header: 'Meter Number', key: "Meter Number", width: 20 },
      { header: 'Read Date', key: "Read Date", width: 20 },
      { header: 'Total Consuption', key: "Total Consuption", width: 20 },
      { header: 'Total Cost', key: "Total Cost", width: 20 },
      { header: 'Other Charge', key: "Other Charge", width: 20 }
    ];

    //Predictors
    predictorsSheet.columns = [
      { header: 'Facility Name', key: "Facility Name", width: 20 },
      { header: 'Date', key: "Date", width: 20 }
    ];

    const facilitiesSet = new Set<String>();
    const metersSet = new Set<String>();
    billingData.bills.forEach((bill:any)=>{
      let facilitiesObj = {
        "Facility Name": bill.base.billing_contact,
        "Address": bill.base.service_address.split(",")[0],
        "Country": "US",
        "City": bill.base.service_address.split(",")[1],
        "State": bill.base.service_address.split(",")[2].substring(0, 3),
        "Contact Name": bill.base.billing_contact,
      }
      if(!facilitiesSet.has(JSON.stringify(facilitiesObj))){
        facilitiesSet.add(JSON.stringify(facilitiesObj))
        facilitiesSheet.addRow(facilitiesObj)
      }

      electricitySheet.addRow({
        "Meter Number": bill.meter_uid,
        "Read Date": bill.base.bill_end_date,
        "Total Consumption": bill.base.bill_total_kwh,
        "Total Cost": bill.base.bill_total_cost,
        "Total Consuption": bill.base.bill_total_kwh
      })

      predictorsSheet.addRow({
        "Facility Name": bill.base.billing_contact,
        "Date": bill.base.bill_end_date
      })

      let metersObj = {
        "Facility Name": bill.base.billing_contact,
        "Meter Number (unique)": bill.meter_uid,
        "Source": bill.base.service_class,
        "Meter Name (Display)": bill.base.service_tariff,
        "Collection Unit": bill.base.bill_total_unit
      }
      if(!metersSet.has(JSON.stringify(metersObj))){
        metersSet.add(JSON.stringify(metersObj))
        metersutilitiesSheet.addRow(metersObj)
      }
    })
    
    return workbook;
    // workbook.xlsx.writeBuffer()
    //   .then((buffer: BlobPart) => {
    //     const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    //     const blob = new Blob([buffer], { type: fileType });

    //     let a = document.createElement("a");
    //     let url = window.URL.createObjectURL(blob);

    //     a.href = url;
    //     a.download = "convertedData.xlsx";

    //     document.body.appendChild(a);
    //     a.click();

    //     // Release resources associated with the URL
    //     window.URL.revokeObjectURL(url);
    //     document.body.removeChild(a);

    //     console.log("Excel file exported successfully");
    //   })
    //   .catch((error: any) => {
    //     console.error("Error exporting Excel file:", error);
    //   });
  }

  static validateIncomingData(jsonData: any) {

  }
  static convertExcelToJson(workbook:ExcelJS.Workbook):any{
    let jsonData:{sheetName:string;data:object[]}[] = [];
    workbook.eachSheet((worksheet)=>{
      let sheetData:object[] = [];
      worksheet.eachRow((row)=>{
        let rowData: {[key:string]:any} = {};
        row.eachCell((cell,colNumber)=>{
          rowData[`Column${colNumber}`]=cell.value;
        });
        sheetData.push(rowData);
      });
      jsonData.push({sheetName:worksheet.name,data:sheetData});
    });
    return jsonData;
  };
}
