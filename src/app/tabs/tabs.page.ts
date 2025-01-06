import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../services/reports/reports.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  content_visibility = 'visible';
  constructor(
    private reportService:ReportsService
  ) { }

  ngOnInit() {
    this.reportService.contentVisibility$.subscribe((value) => {
      this.content_visibility = value;
    });
  }

}
