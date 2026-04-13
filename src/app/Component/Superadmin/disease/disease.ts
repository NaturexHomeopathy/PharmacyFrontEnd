import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperAdminService } from '../../../Service/SuperAdminService/super-admin';
import { Disease } from '../../../Model/disease';

@Component({
  selector: 'app-disease',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disease.html',
  styleUrls: ['./disease.css']
})
export class DiseaseComponent implements OnInit {

  // ================= DISEASE =================
  diseases: Disease[] = [];
  editingId: string | null = null;
  newDiseaseName = '';

  // ================= PAGINATION =================
  pageSize = 10;
  currentPage = 1;

  // ================= PRODUCT MODAL =================
  showProductModal = false;
  selectedDisease: Disease | null = null;

  allProducts: any[] = [];
  linkedProductIds = new Set<string>();
  selectedProductIds = new Set<string>();

  // ================= IMAGE VIEW MODAL =================
  showImageModal = false;
  previewImageUrl: string | null = null;

  // ================= UPLOAD SUCCESS =================
  showUploadSuccess = false;

  constructor(private saService: SuperAdminService) {}

  ngOnInit(): void {
    this.loadDiseases();
  }

  // ================= LOAD =================
  loadDiseases(): void {
    this.saService.getAllDiseases().subscribe(res => {
      this.diseases = res;
      this.currentPage = 1;
    });
  }

  // ================= PAGINATION =================
  get paginatedDiseases(): Disease[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.diseases.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.diseases.length / this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // ================= CRUD =================
  addDisease(): void {
    if (!this.newDiseaseName.trim()) return;

    this.saService.addDisease({ diseaseName: this.newDiseaseName.trim() })
      .subscribe(() => {
        this.newDiseaseName = '';
        this.loadDiseases();
      });
  }

  startEdit(d: Disease): void {
    this.editingId = d.id;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.loadDiseases();
  }

  saveEdit(d: Disease): void {
    if (!d.diseaseName.trim()) return;

    this.saService.updateDisease(d.id, {
      diseaseName: d.diseaseName,
      isActive: d.isActive
    }).subscribe(() => {
      this.editingId = null;
      this.loadDiseases();
    });
  }

  deleteDisease(id: string): void {
    if (!confirm('Delete this disease?')) return;
    this.saService.deleteDisease(id).subscribe(() => this.loadDiseases());
  }

  toggleDisease(d: Disease): void {
    this.saService.toggleDisease(d.id).subscribe(() => {
      d.isActive = !d.isActive;
    });
  }

  // ================= PRODUCT MODAL =================
  openProductModal(d: Disease): void {
    this.selectedDisease = d;
    this.showProductModal = true;
    this.linkedProductIds.clear();
    this.selectedProductIds.clear();

    this.saService.getAllHealthProductsSimple().subscribe(all => {
      this.allProducts = all;

      this.saService.getProductsForDisease(d.id).subscribe(linked => {
        linked.forEach(p => {
          this.linkedProductIds.add(p.healthProductId);
          this.selectedProductIds.add(p.healthProductId);
        });
      });
    });
  }

  toggleProduct(productId: string, checked: boolean): void {
    checked
      ? this.selectedProductIds.add(productId)
      : this.selectedProductIds.delete(productId);
  }

  saveProductMapping(): void {
    if (!this.selectedDisease) return;
    const diseaseId = this.selectedDisease.id;

    this.selectedProductIds.forEach(pid => {
      if (!this.linkedProductIds.has(pid)) {
        this.saService.addProductToDisease(diseaseId, pid).subscribe();
      }
    });

    this.linkedProductIds.forEach(pid => {
      if (!this.selectedProductIds.has(pid)) {
        this.saService.removeProductFromDisease(diseaseId, pid).subscribe();
      }
    });

    this.closeProductModal();
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.selectedDisease = null;
    this.allProducts = [];
    this.linkedProductIds.clear();
    this.selectedProductIds.clear();
  }

  // ================= IMAGE UPLOAD =================
  onImageSelected(event: Event, d: Disease): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    this.saService.uploadDiseaseImage(d.id, file).subscribe({
      next: res => {
        // existing logic untouched
        (d as any).DiseaseUrl = res.imageUrl;

        this.showUploadSuccess = true;
        setTimeout(() => this.showUploadSuccess = false, 2000);

        input.value = '';
      },
      error: () => alert('Image upload failed')
    });
  }

  // ================= IMAGE VIEW (FIXED ONLY) =================
  viewImage(d: Disease): void {
    const imageUrl =
      (d as any).DiseaseUrl ||
      (d as any).diseaseUrl;

    if (!imageUrl) {
      alert('No image uploaded');
      return;
    }

    this.previewImageUrl = imageUrl;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.previewImageUrl = null;
  }
}
