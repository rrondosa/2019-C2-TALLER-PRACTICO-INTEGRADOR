import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class LoginProvider {

  constructor(public http: HttpClient) {
  }

  estaRegistrado(email: string, pass: string){
    return this.http.get("http://todaviasirve.azurewebsites.net/api/Usuario/estaRegistrado/"+email+"/"+pass);
  }


}
