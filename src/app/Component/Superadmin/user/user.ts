import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SuperAdminService } from '../../../Service/SuperAdminService/super-admin';
import { User } from '../../../Model/user';

type UserTab = 'superadmin' | 'admin' | 'visitor';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent implements OnInit {

  activeTab: UserTab = 'superadmin';
  users: User[] = [];

  totalCount = 0;
  onlineCount = 0;
  offlineCount = 0;

  showModal = false;
  isEditMode = false;

  formUser = {
    firstName: '',
    lastName: '',
    email: ''
  };

  editUserId: string | null = null;
  password = '';

  constructor(private service: SuperAdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // ================= TAB =================

  setTab(tab: UserTab) {
    this.activeTab = tab;
    this.loadUsers();
  }

  loadUsers() {
    if (this.activeTab === 'superadmin')
      this.service.getSuperAdmins().subscribe(r => this.processUsers(r));
    else if (this.activeTab === 'admin')
      this.service.getAdmins().subscribe(r => this.processUsers(r));
    else
      this.service.getVisitors().subscribe(r => this.processUsers(r));
  }

  processUsers(data: User[]) {
    this.users = data || [];
    this.totalCount = this.users.length;
    this.onlineCount = this.users.filter(u => u.isOnline).length;
    this.offlineCount = this.totalCount - this.onlineCount;
  }

  // ================= MODAL =================

  addUser() {
    this.isEditMode = false;
    this.editUserId = null;
    this.formUser = { firstName: '', lastName: '', email: '' };
    this.password = '';
    this.showModal = true;
  }

 updateUser(user: User) {
  this.isEditMode = true;
  this.editUserId = user.userId;

  this.formUser = {
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email
  };

  this.password = ''; // ✅ important

  this.showModal = true;
}

  // ================= SAVE =================

  saveUser() {

    if (!this.formUser.email || !this.formUser.email.includes('@')) {
      alert('Valid email required');
      return;
    }

    // ---------- UPDATE ----------
   // ---------- UPDATE ----------
if (this.isEditMode && this.editUserId) {

  const updatePayload: any = {
    email: this.formUser.email,
    firstName: this.formUser.firstName,
    lastName: this.formUser.lastName
  };

  // ✅ Only send password if user entered one
  if (this.password && this.password.trim() !== '') {
    updatePayload.passwordHash = this.password;
  }

  const req =
    this.activeTab === 'superadmin'
      ? this.service.updateSuperAdmin(this.editUserId, updatePayload)
      : this.service.updateAdmin(this.editUserId, updatePayload);

  req.subscribe({
    next: () => this.afterSave(),
    error: () => alert('Update failed')
  });

  return;
}

    // ---------- ADD ----------
    if (!this.password) {
      alert('Password required');
      return;
    }

    const addPayload = {
      email: this.formUser.email,
      firstName: this.formUser.firstName,
      lastName: this.formUser.lastName,
      passwordHash: this.password
    };

    const req =
      this.activeTab === 'superadmin'
        ? this.service.addSuperAdmin(addPayload)
        : this.service.addAdmin(addPayload);

    req.subscribe({
      next: () => this.afterSave(),
      error: err => {
        console.error(err);
        alert(err.error || 'Add failed');
      }
    });
  }

  afterSave() {
    this.showModal = false;
    this.loadUsers();
  }

  closeModal() {
    this.showModal = false;
  }

  // ================= ENABLE / DISABLE (GENERIC USER) =================

 enableUser(id: string) {
  this.service.enableUser(id).subscribe(() => this.loadUsers());
}

disableUser(id: string) {
  this.service.disableUser(id).subscribe(() => this.loadUsers());
}

}
