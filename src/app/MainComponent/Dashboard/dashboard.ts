import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VisitorService } from '../../Service/VisitorService/visitor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  diseases: any[] = [];

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  showLeftArrow = false;
  showRightArrow = false;

  constructor(
    private router: Router,
    private visitorService: VisitorService
  ) {}

 ngOnInit(): void {
  this.loadEnabledDiseases();
  this.loadUser();
}

loadUser() {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userEmail = payload.email || '';
    } catch {
      this.userEmail = '';
    }
  }
}

  ngAfterViewInit(): void {
    setTimeout(() => this.updateArrows(), 0);
  }

  goToUser() {
    if (!this.redirectIfNotLoggedIn()) return;
    this.router.navigate(['/user']);
  }

  bookAppointment() {
    if (!this.redirectIfNotLoggedIn()) return;
    this.router.navigate(['/AppoinmentVisitor']);
  }

  navigateTo(route: string) {
    if (!this.redirectIfNotLoggedIn()) return;
    this.router.navigate([route]);
  }

  @HostListener('window:beforeunload')
  onUnload() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigator.sendBeacon(
        'https://localhost:7014/api/superadmin/offline',
        JSON.stringify({ userId })
      );
    }
  }

  // ================= SHOP BY DISEASE =================
  loadEnabledDiseases(): void {
    this.visitorService.getEnabledDiseases().subscribe({
      next: data => {
        this.diseases = data;
        setTimeout(() => this.updateArrows(), 0);
      },
      error: err => console.error('Disease load failed', err)
    });
  }

  goToDiseaseShop(diseaseId: string) {
    if (!this.redirectIfNotLoggedIn()) return;

    this.router.navigate(['/medicines'], {
      queryParams: { diseaseId }
    });
  }

  // ================= CAROUSEL CONTROLS =================
  scrollLeft() {
    const el = this.carousel.nativeElement;
    el.scrollBy({
      left: -el.clientWidth,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    const el = this.carousel.nativeElement;
    el.scrollBy({
      left: el.clientWidth,
      behavior: 'smooth'
    });
  }

  updateArrows() {
    const el = this.carousel.nativeElement;

    this.showLeftArrow = el.scrollLeft > 5;
    this.showRightArrow =
      el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }

  @HostListener('window:resize')
  onResize() {
    this.updateArrows();
  }

  // ===== PROFILE PANEL =====
  showProfilePanel = false;
  userEmail = '';

  toggleProfilePanel() {
    this.showProfilePanel = !this.showProfilePanel;
  }

  logout() {
    localStorage.clear();
    this.showProfilePanel = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  redirectIfNotLoggedIn(): boolean {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}