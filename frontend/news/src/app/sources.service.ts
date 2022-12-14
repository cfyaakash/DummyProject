import { Injectable } from '@angular/core';
import { sources } from './sources';
import { HttpClient } from '@angular/common/http';
import { Observable , of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import {CookieService} from 'ngx-cookie';
import {HttpClientXsrfModule} from '@angular/common/http';
import { Subject, tap } from 'rxjs';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type':  'application/json',
// //     Authorization: 'my-auth-token',
//     CookieName: 'csrftoken',
//     HeaderName:  'HTTP_X_CSRFTOKEN',
//   })
// };


@Injectable({
  providedIn: 'root'
})
export class SourcesService {
  private _refreshrequired = new Subject<void>();
    get Refreshrequired() {
      return this._refreshrequired;
    }

  API_URL = '/sourceapi/';

  constructor(private http: HttpClient) { }

     /** GET sources from the server */
    sources() :  Observable<sources[]> {
      return this.http.get<sources[]>(this.API_URL,);
    }

    /** POST: add a new source to the server */
    addSource(source : sources[]): Observable<sources[]>{
      return this.http.post<sources[]> (this.API_URL, source).pipe(
      tap(() => {
        this._refreshrequired.next();
      })
    );
      //console.log(user);
      }


//     /** DELETE: delete source to the server from frontend */


    deleteSource(id: string): Observable<number>{
      return this.http.delete<number>(this.API_URL +id);
     }

    /** Get source by Id */
    GetSourcebyid(source: any) {
      return this.http.get(this.API_URL+ source);
    }

    /** EDIT:  edit a source to the server */
    updateSource (id : number, source : sources[]): Observable<sources[]>{
      return this.http.put<sources[]> (this.API_URL+id+'/', source)
      //console.log(user);
      }
}
