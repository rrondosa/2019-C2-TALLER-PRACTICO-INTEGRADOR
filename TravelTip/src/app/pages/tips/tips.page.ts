import { Component, OnInit } from '@angular/core';
import { TipService } from 'src/app/servicios/tip.service';
import { Tip } from 'src/app/models/tip.model';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
})
export class TipsPage implements OnInit {

  constructor(
    private tipService:TipService
  ) { }
  public lista: Tip[];
  ngOnInit() {
    this.tipService.getAlltips().subscribe(l=>{
      this.lista=l;
      console.log("tips", l);
    });
  }

}
