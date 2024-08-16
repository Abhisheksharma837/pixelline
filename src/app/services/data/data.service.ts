import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {Storage} from '@ionic/storage';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storage: Storage) 
  {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

   
  set(key: string, value: string) {
    return from(this.storage.set(key, value))
  }

  get(key: string): Observable<string> {
    return from(this.storage.get(key))
  }

  remove(key: string): Observable<string> {
    return from(this.storage.remove(key));
  }


}
