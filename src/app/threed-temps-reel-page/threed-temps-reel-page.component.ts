import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Equipment {
  id: string;
  name: string;
  icon?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  equipments: Equipment[];
}

interface Terminal {
  id: string;
  name: string;
  categories: Category[];
}

@Component({
  selector: 'app-threed-temps-reel-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './threed-temps-reel-page.component.html',
  styleUrl: './threed-temps-reel-page.component.css'
})
export class ThreedTempsReelPageComponent {
  terminals: Terminal[] = [
    {
      id: 'terminal1',
      name: 'Terminal 1',
      categories: [
        {
          id: 'levage',
          name: 'Levage',
          icon: 'bi-arrows-vertical',
          equipments: [
            { id: 'levage-mobile', name: 'Levage Mobiles', icon: 'bi-arrows-vertical' },
            { id: 'levage-rails', name: 'Levage sur rails', icon: 'bi-arrows-vertical' }
          ]
        },
        {
          id: 'roullants',
          name: 'Roullants',
          icon: 'bi bi-truck-front-fill',
          equipments: [
            { id: 'chargeuse-grande', name: 'CHARGEUSE GRANDE CAPACITE', icon: 'bi bi-truck-front-fill' },
            { id: 'chargeuse-petite', name: 'CHARGEUSE PETITE CAPACITE', icon: 'bi bi-truck-front-fill' },
            { id: 'elevateur-electrique', name: 'CHARIOT ÉLÉVATEUR ÉLECTRIQUE', icon: 'bi bi-truck-front-fill' },
            { id: 'elevateur-thermique', name: 'CHARIOT ÉLÉVATEUR THERMIQUE', icon: 'bi bi-truck-front-fill' },
            { id: 'chariots-cavaliers', name: 'CHARIOTS CAVALIERS', icon: 'bi bi-truck-front-fill' },
            { id: 'elevateur-conteneur', name: 'ÉLÉVATEUR POUR CONTENEUR', icon: 'bi bi-truck-front-fill' },
            { id: 'reach-stacker', name: 'REACH-STACKER', icon: 'bi bi-truck-front-fill' },
            { id: 'tracteur-25t', name: 'TRACTEUR 25T', icon: 'bi bi-truck-front-fill' },
            { id: 'tracteurs-sellette', name: 'TRACTEURS À SELLETTE 60T', icon: 'bi bi-truck-front-fill' }
          ]
        }
      ]
    },
    {
      id: 'terminal2',
      name: 'Terminal 2',
      categories: [
        {
          id: 'levage',
          name: 'Levage',
          icon: 'bi-arrows-vertical',
          equipments: [
            { id: 'levage-mobile', name: 'Levage Mobiles', icon: 'bi-arrows-vertical' },
            { id: 'levage-rails', name: 'Levage sur rails', icon: 'bi-arrows-vertical' }
          ]
        },
        {
          id: 'roullants',
          name: 'Roullants',
          icon: 'bi bi-truck-front-fill',
          equipments: [
            { id: 'chargeuse-grande', name: 'CHARGEUSE GRANDE CAPACITE', icon: 'bi bi-truck-front-fill' },
            { id: 'chargeuse-petite', name: 'CHARGEUSE PETITE CAPACITE', icon: 'bi bi-truck-front-fill' },
            { id: 'elevateur-electrique', name: 'CHARIOT ÉLÉVATEUR ÉLECTRIQUE', icon: 'bi bi-truck-front-fill' },
            { id: 'elevateur-thermique', name: 'CHARIOT ÉLÉVATEUR THERMIQUE', icon: 'bi bi-truck-front-fill' },
            { id: 'chariots-cavaliers', name: 'CHARIOTS CAVALIERS', icon: 'bi bi-truck-front-fill' },
            { id: 'elevateur-conteneur', name: 'ÉLÉVATEUR POUR CONTENEUR', icon: 'bi bi-truck-front-fill' },
            { id: 'reach-stacker', name: 'REACH-STACKER', icon: 'bi bi-truck-front-fill' },
            { id: 'tracteur-25t', name: 'TRACTEUR 25T', icon: 'bi bi-truck-front-fill' },
            { id: 'tracteurs-sellette', name: 'TRACTEURS À SELLETTE 60T', icon: 'bi bi-truck-front-fill' }
          ]
        }
      ]
    }
  ];

  // Single selection mode variables
  selectedTerminal: Terminal | null = null;
  selectedCategory: Category | null = null;
  selectedEquipment: Equipment | null = null;
  
  // Multi-selection mode variables
  selectedTerminals: Terminal[] = [];
  selectedCategories: Category[] = [];
  selectedEquipments: Equipment[] = [];
  
  // Combined lists for multi-selection mode
  allCategories: Category[] = [];
  allEquipments: Equipment[] = [];
  
  // Selection mode flag
  multiSelectionMode = false;

  constructor(private router: Router) {}

  toggleSelectionMode(): void {
    this.multiSelectionMode = !this.multiSelectionMode;
    
    // Clear all selections when toggling mode
    if (this.multiSelectionMode) {
      // When switching to multi-selection, clear single selections
      this.selectedTerminal = null;
      this.selectedCategory = null;
      this.selectedEquipment = null;
      
      // Initialize empty combined lists
      this.allCategories = [];
      this.allEquipments = [];
    } else {
      // When switching to single selection, clear multi-selections
      this.selectedTerminals = [];
      this.selectedCategories = [];
      this.selectedEquipments = [];
      this.allCategories = [];
      this.allEquipments = [];
    }
  }
  
  // Update the combined lists of categories from all selected terminals
  updateAllCategories(): void {
    this.allCategories = [];
    
    // Get all categories from all selected terminals
    this.selectedTerminals.forEach(terminal => {
      terminal.categories.forEach(category => {
        // Check if this category is already in the list (by ID)
        if (!this.allCategories.some(c => c.id === category.id)) {
          this.allCategories.push(category);
        }
      });
    });
  }
  
  // Update the combined lists of equipment from all selected categories
  updateAllEquipments(): void {
    this.allEquipments = [];
    
    // Get all equipment from all selected categories
    this.selectedCategories.forEach(category => {
      category.equipments.forEach(equipment => {
        // Check if this equipment is already in the list (by ID)
        if (!this.allEquipments.some(e => e.id === equipment.id)) {
          this.allEquipments.push(equipment);
        }
      });
    });
  }

  selectTerminal(terminal: Terminal): void {
    if (this.multiSelectionMode) {
      const index = this.selectedTerminals.findIndex(t => t.id === terminal.id);
      if (index === -1) {
        // Add to selection
        this.selectedTerminals.push(terminal);
      } else {
        // Remove from selection
        this.selectedTerminals.splice(index, 1);
        
        // Also remove any categories from this terminal from the selection
        this.selectedCategories = this.selectedCategories.filter(category => {
          return !terminal.categories.some(c => c.id === category.id);
        });
        
        // And remove any equipment from those categories
        this.updateAllEquipments();
      }
      
      // Update the combined lists of categories
      this.updateAllCategories();
    } else {
      // Single selection mode
      this.selectedTerminal = terminal;
      this.selectedCategory = null;
      this.selectedEquipment = null;
    }
  }

  selectCategory(category: Category): void {
    if (this.multiSelectionMode) {
      const index = this.selectedCategories.findIndex(c => c.id === category.id);
      if (index === -1) {
        // Add to selection
        this.selectedCategories.push(category);
      } else {
        // Remove from selection
        this.selectedCategories.splice(index, 1);
        
        // Also remove any equipment from this category from the selection
        this.selectedEquipments = this.selectedEquipments.filter(equipment => {
          return !category.equipments.some(e => e.id === equipment.id);
        });
      }
      
      // Update the combined lists of equipment
      this.updateAllEquipments();
    } else {
      // Single selection mode
      this.selectedCategory = category;
      this.selectedEquipment = null;
    }
  }

  selectEquipment(equipment: Equipment): void {
    if (this.multiSelectionMode) {
      const index = this.selectedEquipments.findIndex(e => e.id === equipment.id);
      if (index === -1) {
        // Add to selection
        this.selectedEquipments.push(equipment);
      } else {
        // Remove from selection
        this.selectedEquipments.splice(index, 1);
      }
    } else {
      // Single selection mode
      this.selectedEquipment = equipment;
    }
  }

  isTerminalSelected(terminal: Terminal): boolean {
    if (this.multiSelectionMode) {
      return this.selectedTerminals.some(t => t.id === terminal.id);
    } else {
      return this.selectedTerminal?.id === terminal.id;
    }
  }

  isCategorySelected(category: Category): boolean {
    if (this.multiSelectionMode) {
      return this.selectedCategories.some(c => c.id === category.id);
    } else {
      return this.selectedCategory?.id === category.id;
    }
  }

  isEquipmentSelected(equipment: Equipment): boolean {
    if (this.multiSelectionMode) {
      return this.selectedEquipments.some(e => e.id === equipment.id);
    } else {
      return this.selectedEquipment?.id === equipment.id;
    }
  }

  proceedToVisualization(): void {
    if (this.multiSelectionMode) {
      // Multi-selection mode navigation
      const terminalIds = this.selectedTerminals.map(t => t.id);
      const categoryIds = this.selectedCategories.map(c => c.id);
      const equipmentIds = this.selectedEquipments.map(e => e.id);
      
      this.router.navigate(['/visualization'], {
        queryParams: {
          multiSelection: true,
          terminals: terminalIds.join(','),
          categories: categoryIds.join(','),
          equipments: equipmentIds.join(',')
        }
      });
    } else {
      // Single selection mode navigation
      if (this.selectedTerminal && this.selectedCategory && this.selectedEquipment) {
        this.router.navigate(['/visualization'], {
          queryParams: {
            multiSelection: false,
            terminal: this.selectedTerminal.id,
            category: this.selectedCategory.id,
            equipment: this.selectedEquipment.id
          }
        });
      }
    }
  }

  getSelectionSummary(): string {
    if (this.multiSelectionMode) {
      const parts = [];
      
      if (this.selectedTerminals.length > 0) {
        const count = this.selectedTerminals.length;
        parts.push(`${count} terminal${count > 1 ? 's' : ''}`);
      }
      
      if (this.selectedCategories.length > 0) {
        const count = this.selectedCategories.length;
        parts.push(`${count} catégorie${count > 1 ? 's' : ''}`);
      }
      
      if (this.selectedEquipments.length > 0) {
        const count = this.selectedEquipments.length;
        parts.push(`${count} équipement${count > 1 ? 's' : ''}`);
      }
      
      return parts.join(' + ');
    } else {
      const parts = [];
      
      if (this.selectedTerminal) {
        parts.push(this.selectedTerminal.name);
      }
      
      if (this.selectedCategory) {
        parts.push(this.selectedCategory.name);
      }
      
      if (this.selectedEquipment) {
        parts.push(this.selectedEquipment.name);
      }
      
      return parts.join(' > ');
    }
  }

  canProceed(): boolean {
    if (this.multiSelectionMode) {
      // In multi-selection mode, require at least one selection in each category
      return this.selectedTerminals.length > 0 && 
             this.selectedCategories.length > 0 && 
             this.selectedEquipments.length > 0;
    } else {
      // In single selection mode, require all three selections
      return !!(this.selectedTerminal && this.selectedCategory && this.selectedEquipment);
    }
  }
  
  getSelectedItemsCount(): number {
    if (this.multiSelectionMode) {
      return this.selectedTerminals.length + this.selectedCategories.length + this.selectedEquipments.length;
    } else {
      return (this.selectedTerminal ? 1 : 0) + 
             (this.selectedCategory ? 1 : 0) + 
             (this.selectedEquipment ? 1 : 0);
    }
  }
}
