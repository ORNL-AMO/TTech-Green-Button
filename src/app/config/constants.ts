import { Injectable } from '@angular/core'; 

@Injectable({
  providedIn: 'root'
})

export class Constants {
    static API_ENDPOINT(API_ENDPOINT: string) {
      throw new Error('Method not implemented.');
   }
    public static API_ENDPOINT1: string = 'https://utilityapi.com/api/v2/'; 
    public static TitleOfSite: string = " UtilityApi"; 
} 