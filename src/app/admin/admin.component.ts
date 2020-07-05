
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  navLinks: any[];
  activeLinkIndex = -1;

  constructor(private router: Router) {
    this.navLinks = [
      {
        label: 'Category',
        link: './category',
        index: 0
      },
      {
        label: 'Type',
        link: './type',
        index: 1
      },

      {
        label: 'Products',
        link: './products',
        index: 2
      }, {
        label: 'Orders',
        link: './orders',
        index: 3
      },
      {
        label: 'Requests',
        link: './requests',
        index: 3
      },
      {
        label: 'Ofers',
        link: './ofer',
        index: 3
      },

    ];
  }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

}
