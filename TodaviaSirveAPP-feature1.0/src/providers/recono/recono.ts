import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ReconoProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ReconoProvider Provider');
  }


  reconoImagen(form){

    let pathURL = "https://brazilsouth.api.cognitive.microsoft.com/vision/v1.0/analyze?language=es&visualFeatures=tags"
    let apiKey = "a84d243e248d4e67aee85fce8cace729";

    let image

    const headers = new HttpHeaders()
      .set('Content-Type', 'multipart/form-data')
      .set('Ocp-Apim-Subscription-Key', apiKey)
      .set('Host', "brazilsouth.api.cognitive.microsoft.com")
      .set("Accept", "*/*")
      .set("accept-encoding","gzip, deflate" )

    var formData = new FormData();
    formData.append("imagen", form);

    return this.http.post(pathURL, formData ,{ headers: headers })
  }

}
