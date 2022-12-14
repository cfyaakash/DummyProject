import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { story } from './story';
import { Observable,  of  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StoryapiService {

   private _refreshrequired = new Subject<void>();
    get Refreshrequired() {
        return this._refreshrequired;
    }

    API_URL = '/storyapi/';
    Company_url = '/company_api'

  constructor(private http: HttpClient) { }


  /** GET stories from the server */
  story(): Observable<story[]> {
    return this.http.get<story[]>(this.API_URL);
    }

  /** GET companies for edition in story */
  company(): Observable<any>  {
    return this.http.get<any>(this.Company_url);
    }


  /** POST: add a new story to the server */
  addStory(story : story[]): Observable<story[]>{
    return this.http.post<story[]> (this.API_URL,story).pipe(
      tap(() => {
        this._refreshrequired.next();
      })
    );
  }


  /** DELETE: delete source to the server */
   deleteStory(id: string): Observable<number>{
      return this.http.delete<number>(this.API_URL +id);
  }


  /* get story corresponding to id */
  GetStorybyid(story : any){
    return this.http.get(this.API_URL+story);
    }


  /* update : update story to the server */
  updateStory (id : number, story : story[]): Observable<story[]>{
    console.log(id)
     return this.http.put<story[]> (this.API_URL+ id +'/',story)
  }

}
