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
            { id: 'levage-mobile', name: 'Levage Mobiles', icon: 'bi-truck' },
            { id: 'levage-rails', name: 'Levage sur rails', icon: 'bi-train-front' }
          ]
        },
        {
          id: 'roullants',
          name: 'Roullants',
          icon: 'bi-truck',
          equipments: [
            { id: 'chargeuse-grande', name: 'CHARGEUSE GRANDE CAPACITE', icon: 'bi-cart-plus' },
            { id: 'chargeuse-petite', name: 'CHARGEUSE PETITE CAPACITE', icon: 'bi-cart' },
            { id: 'elevateur-electrique', name: 'CHARIOT ÉLÉVATEUR ÉLECTRIQUE', icon: 'bi-battery-charging' },
            { id: 'elevateur-thermique', name: 'CHARIOT ÉLÉVATEUR THERMIQUE', icon: 'bi-fuel-pump' },
            { id: 'chariots-cavaliers', name: 'CHARIOTS CAVALIERS', icon: 'bi-box-seam' },
            { id: 'elevateur-conteneur', name: 'ÉLÉVATEUR POUR CONTENEUR', icon: 'bi-box' },
            { id: 'reach-stacker', name: 'REACH-STACKER', icon: 'bi-stack' },
            { id: 'tracteur-25t', name: 'TRACTEUR 25T', icon: 'bi-truck-flatbed' },
            { id: 'tracteurs-sellette', name: 'TRACTEURS À SELLETTE 60T', icon: 'bi-truck-front' }
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
            { id: 'levage-mobile', name: 'Levage Mobiles', icon: 'bi-truck' },
            { id: 'levage-rails', name: 'Levage sur rails', icon: 'bi-train-front' }
          ]
        },
        {
          id: 'roullants',
          name: 'Roullants',
          icon: 'bi-truck',
          equipments: [
            { id: 'chargeuse-grande', name: 'CHARGEUSE GRANDE CAPACITE', icon: 'bi-cart-plus' },
            { id: 'chargeuse-petite', name: 'CHARGEUSE PETITE CAPACITE', icon: 'bi-cart' },
            { id: 'elevateur-electrique', name: 'CHARIOT ÉLÉVATEUR ÉLECTRIQUE', icon: 'bi-battery-charging' },
            { id: 'elevateur-thermique', name: 'CHARIOT ÉLÉVATEUR THERMIQUE', icon: 'bi-fuel-pump' },
            { id: 'chariots-cavaliers', name: 'CHARIOTS CAVALIERS', icon: 'bi-box-seam' },
            { id: 'elevateur-conteneur', name: 'ÉLÉVATEUR POUR CONTENEUR', icon: 'bi-box' },
            { id: 'reach-stacker', name: 'REACH-STACKER', icon: 'bi-stack' },
            { id: 'tracteur-25t', name: 'TRACTEUR 25T', icon: 'bi-truck-flatbed' },
            { id: 'tracteurs-sellette', name: 'TRACTEURS À SELLETTE 60T', icon: 'bi-truck-front' }
          ]
        }
      ]
    }
  ];

  selectedTerminal: Terminal | null = null;
  selectedCategory: Category | null = null;
  selectedEquipment: Equipment | null = null;

  constructor(private router: Router) {}

  selectTerminal(terminal: Terminal): void {
    this.selectedTerminal = terminal;
    this.selectedCategory = null;
    this.selectedEquipment = null;
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.selectedEquipment = null;
  }

  selectEquipment(equipment: Equipment): void {
    this.selectedEquipment = equipment;
  }

  isTerminalSelected(terminal: Terminal): boolean {
    return this.selectedTerminal?.id === terminal.id;
  }

  isCategorySelected(category: Category): boolean {
    return this.selectedCategory?.id === category.id;
  }

  isEquipmentSelected(equipment: Equipment): boolean {
    return this.selectedEquipment?.id === equipment.id;
  }

  proceedToVisualization(): void {
    if (this.selectedTerminal && this.selectedCategory && this.selectedEquipment) {
      // Navigate to the visualization page with the selected parameters
      this.router.navigate(['/visualization'], {
        queryParams: {
          terminal: this.selectedTerminal.id,
          category: this.selectedCategory.id,
          equipment: this.selectedEquipment.id
        }
      });
    }
  }

  getSelectionSummary(): string {
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

  canProceed(): boolean {
    return !!(this.selectedTerminal && this.selectedCategory && this.selectedEquipment);
  }
}
