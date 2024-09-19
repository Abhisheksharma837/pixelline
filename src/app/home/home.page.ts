import { Component, OnInit } from '@angular/core';

interface Item {
  id: number;
  name: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  name!: string;
  email!: string;

  favouriteItems: Item[] = []; // Array for storing favourite items
  newestScanItems: Item[] = []; // Array for storing newest scans

  constructor() { }

  ngOnInit(): void {
    this.name = 'Abhishek'
    this.email = 'maxvision@gmail.com'
    // Initialize your arrays with data or load from a service
    this.favouriteItems = [
      { id: 1, name: 'PDF 1', image: 'assets/logo/2smarter.jpeg' },
      { id: 2, name: 'PDF 2', image: 'assets/logo/3scan.jpeg' },
      { id: 3, name: 'PDF 3', image: 'assets/logo/4erase.jpeg' },
      { id: 1, name: 'PDF 4', image: 'assets/logo/2smarter.jpeg' },
      { id: 2, name: 'PDF 5', image: 'assets/logo/3scan.jpeg' },
      { id: 3, name: 'PDF 6', image: 'assets/logo/4erase.jpeg' },

    ];

    this.newestScanItems = [
      { id: 1, name: 'Scan 1', image: 'assets/logo/2smarter.jpeg' },
      { id: 2, name: 'Scan 2', image: 'assets/logo/3scan.jpeg' },
      { id: 3, name: 'Scan 3', image: 'assets/logo/4erase.jpeg' },
      { id: 1, name: 'Scan 4', image: 'assets/logo/2smarter.jpeg' },
      { id: 2, name: 'Scan 5', image: 'assets/logo/3scan.jpeg' },
      { id: 1, name: 'Scan 6', image: 'assets/logo/2smarter.jpeg' },
      { id: 2, name: 'Scan 7', image: 'assets/logo/3scan.jpeg' },
      { id: 1, name: 'Scan 8', image: 'assets/logo/2smarter.jpeg' },
      { id: 2, name: 'Scan 9', image: 'assets/logo/3scan.jpeg' },

    ];
  }
}
