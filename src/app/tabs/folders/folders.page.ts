import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.page.html',
  styleUrls: ['./folders.page.scss'],
})
export class FoldersPage implements OnInit {
  showHide = true;
  EnglishItems = true;
  steps = [
    { title: 'Step 1', videoSrc: 'assets/videos/sample1.mp4' },
    { title: 'Step 2', videoSrc: 'assets/videos/sample1.mp4' },
    { title: 'Step 3', videoSrc: 'assets/videos/sample1.mp4' },
    { title: 'Step 3', videoSrc: 'assets/videos/sample1.mp4' },
    { title: 'Step 3', videoSrc: 'assets/videos/sample1.mp4' }
  ];
  constructor() { }

  ngOnInit() {
  }
  showList(){
    this.showHide = !this.showHide;
  }
  EnglishItem(){
    this.EnglishItems = !this.EnglishItems;
  }
}
