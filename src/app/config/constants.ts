import { Injectable } from '@angular/core'; 

@Injectable({providedIn:'root'}) 
export class Constants {
    static API_ENDPOINT(API_ENDPOINT: string) {
      throw new Error('Method not implemented.');
    }
    public static API_ENDPOINT1: string = 'https://utilityapi.com/api/v2/'; 
    public readonly FORMS_ENDPOINT: string = 'https://utilityapi.com/api/v2/forms'; 
    public readonly AUTH_ENDPOINT: string = 'https://utilityapi.com/api/v2/authorizations'; 
    public readonly METER_ENDPOINT: string = 'https://utilityapi.com/api/v2/meters'; 
    public readonly BILLS_ENDPOINT: string = 'https://utilityapi.com/api/v2/bills'; 
    public readonly TEMPLATES_ENDPOINT: string = 'https://utilityapi.com/api/v2/templates'; 
    public readonly INTERVALS_ENDPOINT: string = 'https://utilityapi.com/api/v2/intervals'; 
    public readonly FILES_ENDPOINT: string = 'https://utilityapi.com/api/v2/files'; 
    public readonly EVENTS_ENDPOINT: string = 'https://utilityapi.com/api/v2/events'; 

    public static TitleOfSite: string = " UtilityApi"; 
} 