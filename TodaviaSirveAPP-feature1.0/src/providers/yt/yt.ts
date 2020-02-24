import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class YtProvider {

  apiKey = 'AIzaSyDfp6sUDwDqfRyJiiZvs4VYwgh7P10zp5Y';
  cantVideos = 3;  // es la cantidad de videos que quieren que se devuelvan

  constructor(public http: HttpClient) {
  }

  obtenerVideos(dato: string){
    return this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q='+dato+'&maxResults='+this.cantVideos+'&type=video&key='+this.apiKey)
  }

}
