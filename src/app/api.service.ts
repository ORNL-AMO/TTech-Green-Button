import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { Observable, tap, map, firstValueFrom } from 'rxjs';
import { lastValueFrom, takeUntil } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class ApiHttpService { 
  constructor( 
  private http: HttpClient ) { } 

  public get(url: string, options?: any) { 
    return lastValueFrom(this.http.get(url, options));
    // return this.http.get(url).pipe(
    //   tap({
    //       error: (error: { status: number; }) => {
    //           if (error.status === 500) {
    //               // Handle 500
    //           } else if (error.status === 400) {
    //               // Handle 400
    //           } else if (error.status === 401) {
    //               // Handle 401
    //           }
    //       }}));
  } 

  public post(url: string, data: any, options?: any) { 
    return lastValueFrom(this.http.post(url, data, options)); 
  } 

  public put(url: string, data: any, options?: any) { 
    return this.http.put(url, data, options); 
  } 

  public delete(url: string, options?: any) { 
    return this.http.delete(url, options); 
  } 

}
