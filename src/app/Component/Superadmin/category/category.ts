import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperAdminService } from '../../../Service/SuperAdminService/super-admin';
import { HealthProductCategory } from '../../../Model/healthproductcategory';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrls: ['./category.css']
})
export class Category implements OnInit {

  categories: HealthProductCategory[] = [];

  newCategoryName = '';

  editingId: string | null = null;
  editingName = '';

  loading = false;

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.superAdminService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;

    this.superAdminService.addCategory({
      categoryName: this.newCategoryName.trim()
    }).subscribe(() => {
      this.newCategoryName = '';
      this.loadCategories();
    });
  }

  startEdit(cat: HealthProductCategory) {
    this.editingId = cat.categoryId;
    this.editingName = cat.categoryName;
  }

  cancelEdit() {
    this.editingId = null;
    this.editingName = '';
  }

  updateCategory() {
    if (!this.editingId || !this.editingName.trim()) return;

    this.superAdminService.updateCategory(this.editingId, {
      categoryName: this.editingName.trim()
    }).subscribe(() => {
      this.cancelEdit();
      this.loadCategories();
    });
  }

  toggleCategory(cat: HealthProductCategory) {
    this.superAdminService.toggleCategory(cat.categoryId)
      .subscribe(() => this.loadCategories());
  }
}
