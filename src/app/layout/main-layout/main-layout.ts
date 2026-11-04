import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarMenu } from '../sidebar-menu/sidebar-menu';


@Component({
  imports: [RouterOutlet, SidebarMenu],
  selector: 'app-main-layout',
  styleUrl: './main-layout.css',
  templateUrl: './main-layout.html',
})
export class MainLayout {}
