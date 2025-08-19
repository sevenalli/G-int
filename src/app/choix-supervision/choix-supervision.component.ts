import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TerminalsService } from '../services/terminals.service';
import { EquipmentService } from '../services/equipements.service';
import { CategoryService } from '../services/categories.service';
import { forkJoin } from 'rxjs';

export interface Equipment {
  engineTypeId: number;
  name: string;
  family: string;
  model: string;
  icon: string; // Assuming the backend returns an icon property
  categoryId: number;
}

export interface Category {
  categoryId: number;
  name: string;
  icon: string;
  // This 'equipments' property is optional because we add it on the frontend.
  // The backend API for categories does not return this.
  equipments?: Equipment[];
}

export interface Terminal {
  terminalId: number;
  name: string;
  location: string;
  portId: number;
  // This 'categories' property is optional because we add it on the frontend.
  categories?: Category[];
}

@Component({
  selector: 'app-choix-supervision',
  imports: [CommonModule, RouterModule],
  templateUrl: './choix-supervision.component.html',
  styleUrl: './choix-supervision.component.css'
})
export class ChoixSupervisionComponent implements OnInit {
  portName!: string;
  portId!: number;

  terminals: Terminal[] = []; // This will hold the final, nested data structure

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private terminalsService: TerminalsService,
    private categoryService: CategoryService,
    private equipmentService: EquipmentService
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.portName = params['portName'];
      this.portId = +params['portId']; // Convert to number

      // const nav = this.router.getCurrentNavigation();
    // this.portId = nav?.extras.state?.['portId'];

      console.log('Port Name:', this.portName);
      console.log('Port ID:', this.portId);

      this.loadAndStructureData(this.portId);
    });

    // this.terminalsService.getTerminalsByPort(this.portId).subscribe({
    //   next: (data) => this.terminals = data,
    //   complete: () => console.log('Terminals loaded successfully', this.terminals),
    //   error: (err) => console.error('Failed to load terminals', err)
    // });

    // console.log('Port Name:', this.portName);
    // console.log('Port ID:', this.portId);
    // console.log('Terminals:', this.terminals);
  }

  loadAndStructureData(portId: number): void {
    // Use forkJoin to make three parallel API calls.
    // This is much more efficient than waiting for each one to finish.
    forkJoin({
      terminals: this.terminalsService.getTerminalsByPort(portId),
      allCategories: this.categoryService.getCategories(),
      allEquipments: this.equipmentService.getEquipments()
    }).subscribe({
      next: (data) => {
        const { terminals, allCategories, allEquipments } = data;

        console.log('SUCCESS: Data Loaded from all endpoints', { terminals, allCategories, allEquipments });

        // --- DATA STRUCTURING LOGIC ---
        // This is where we build the hierarchy on the client side.

        // Step 1: For each category, find its corresponding equipments.
        const categoriesWithEquipments = allCategories.map(category => {
          // Filter the flat list of all equipments to find the ones for this category.
          const equipmentsForThisCategory = allEquipments
            .filter(equipment => equipment.categoryId === category.categoryId)
            .map(equipment => ({
              engineTypeId: equipment.engineTypeId,
              name: equipment.name,
              family: equipment.family,
              model: equipment.model,
              icon: equipment.icon ?? '', // Ensure icon exists, fallback to empty string
              categoryId: equipment.categoryId, // Add categoryId as required by Equipment interface
              // Optionally, you can keep the category object if needed elsewhere
            }));
          
          // Return a new category object that includes its nested equipments.
          return {
            ...category, // Copy all properties from the original category
            equipments: equipmentsForThisCategory // Add the nested array
          };
        });

        // Step 2: For each terminal, attach the complete list of categories (which now have their equipments).
        // Since the backend doesn't link them, we give every terminal all possible categories.
        const terminalsWithHierarchy = terminals.map(terminal => {
          return {
            ...terminal, // Copy all properties from the original terminal
            categories: categoriesWithEquipments // Add the nested array of categories
          };
        });

        // Step 3: Assign the final, structured data to our component's property.
        this.terminals = terminalsWithHierarchy;
        //console.log('SUCCESS: Final Hierarchical Data Structured!', this.terminals);
        
      },
      error: (err) => {
        console.error('ERROR: Failed to load data from one or more endpoints', err);
      }
    });
  }


  // terminals: Terminal[] = [
  //   {
  //     id: 'terminal1',
  //     name: 'Terminal 1',
  //     categories: [
  //       {
  //         id: 'levage',
  //         name: 'Levage',
  //         icon: 'bi-arrows-vertical',
  //         equipments: [
  //           { id: 'levage-mobile', name: 'Levage Mobiles', icon: 'bi-arrows-vertical' },
  //           { id: 'levage-rails', name: 'Levage sur rails', icon: 'bi-arrows-vertical' }
  //         ]
  //       },
  //       {
  //         id: 'roullants',
  //         name: 'Roullants',
  //         icon: 'bi bi-truck-front-fill',
  //         equipments: [
  //           { id: 'chargeuse-grande', name: 'CHARGEUSE GRANDE CAPACITE', icon: 'bi bi-truck-front-fill' },
  //           { id: 'chargeuse-petite', name: 'CHARGEUSE PETITE CAPACITE', icon: 'bi bi-truck-front-fill' },
  //           { id: 'elevateur-electrique', name: 'CHARIOT ÉLÉVATEUR ÉLECTRIQUE', icon: 'bi bi-truck-front-fill' },
  //           { id: 'elevateur-thermique', name: 'CHARIOT ÉLÉVATEUR THERMIQUE', icon: 'bi bi-truck-front-fill' },
  //           { id: 'chariots-cavaliers', name: 'CHARIOTS CAVALIERS', icon: 'bi bi-truck-front-fill' },
  //           { id: 'elevateur-conteneur', name: 'ÉLÉVATEUR POUR CONTENEUR', icon: 'bi bi-truck-front-fill' },
  //           { id: 'reach-stacker', name: 'REACH-STACKER', icon: 'bi bi-truck-front-fill' },
  //           { id: 'tracteur-25t', name: 'TRACTEUR 25T', icon: 'bi bi-truck-front-fill' },
  //           { id: 'tracteurs-sellette', name: 'TRACTEURS À SELLETTE 60T', icon: 'bi bi-truck-front-fill' }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     id: 'terminal2',
  //     name: 'Terminal 2',
  //     categories: [
  //       {
  //         id: 'levage',
  //         name: 'Levage',
  //         icon: 'bi-arrows-vertical',
  //         equipments: [
  //           { id: 'levage-mobile', name: 'Levage Mobiles', icon: 'bi-arrows-vertical' },
  //           { id: 'levage-rails', name: 'Levage sur rails', icon: 'bi-arrows-vertical' }
  //         ]
  //       },
  //       {
  //         id: 'roullants',
  //         name: 'Roullants',
  //         icon: 'bi bi-truck-front-fill',
  //         equipments: [
  //           { id: 'chargeuse-grande', name: 'CHARGEUSE GRANDE CAPACITE', icon: 'bi bi-truck-front-fill' },
  //           { id: 'chargeuse-petite', name: 'CHARGEUSE PETITE CAPACITE', icon: 'bi bi-truck-front-fill' },
  //           { id: 'elevateur-electrique', name: 'CHARIOT ÉLÉVATEUR ÉLECTRIQUE', icon: 'bi bi-truck-front-fill' },
  //           { id: 'elevateur-thermique', name: 'CHARIOT ÉLÉVATEUR THERMIQUE', icon: 'bi bi-truck-front-fill' },
  //           { id: 'chariots-cavaliers', name: 'CHARIOTS CAVALIERS', icon: 'bi bi-truck-front-fill' },
  //           { id: 'elevateur-conteneur', name: 'ÉLÉVATEUR POUR CONTENEUR', icon: 'bi bi-truck-front-fill' },
  //           { id: 'reach-stacker', name: 'REACH-STACKER', icon: 'bi bi-truck-front-fill' },
  //           { id: 'tracteur-25t', name: 'TRACTEUR 25T', icon: 'bi bi-truck-front-fill' },
  //           { id: 'tracteurs-sellette', name: 'TRACTEURS À SELLETTE 60T', icon: 'bi bi-truck-front-fill' }
  //         ]
  //       }
  //     ]
  //   }
  // ];

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
  
  // Loading state for proceed button
  isLoading = false;

  // Check if all terminals are selected
  areAllTerminalsSelected(): boolean {
    return this.terminals.every(terminal => this.isTerminalSelected(terminal));
  }

  // Select/Deselect all terminals
  selectAllTerminals(event: Event): void {
    event.stopPropagation();
    
    if (this.areAllTerminalsSelected()) {
      // Deselect all
      this.selectedTerminals = [];
    } else {
      // Select all
      this.selectedTerminals = [...this.terminals];
    }
    
    // Update categories based on selected terminals
    //this.updateAllCategories();
    
    // If no terminals selected, clear categories and equipments
    if (this.selectedTerminals.length === 0) {
      this.selectedCategories = [];
      this.selectedEquipments = [];
      this.allEquipments = [];
    }
  }

  // Check if all categories are selected
  areAllCategoriesSelected(): boolean {
    return this.allCategories.every(category => this.isCategorySelected(category));
  }

  // Select/Deselect all categories
  selectAllCategories(event: Event): void {
    event.stopPropagation();
    
    if (this.areAllCategoriesSelected()) {
      // Deselect all
      this.selectedCategories = [];
    } else {
      // Select all
      this.selectedCategories = [...this.allCategories];
    }
    
    // Update equipments based on selected categories
    this.updateAllEquipments();
    
    // If no categories selected, clear equipments
    if (this.selectedCategories.length === 0) {
      this.selectedEquipments = [];
      this.allEquipments = [];
    }
  }

  // Check if all equipments are selected
  areAllEquipmentsSelected(): boolean {
    return this.allEquipments.every(equipment => this.isEquipmentSelected(equipment));
  }

  // Select/Deselect all equipments
  selectAllEquipments(event: Event): void {
    event.stopPropagation();
    
    if (this.areAllEquipmentsSelected()) {
      // Deselect all
      this.selectedEquipments = [];
    } else {
      // Select all
      this.selectedEquipments = [...this.allEquipments];
    }
  }

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
      terminal.categories?.forEach(category => {
        // Check if this category is already in the list (by ID)
        if (!this.allCategories.some(c => c.categoryId === category.categoryId)) {
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
      category.equipments?.forEach(equipment => {
        // Check if this equipment is already in the list (by ID)
        if (!this.allEquipments.some(e => e.engineTypeId === equipment.engineTypeId)) {
          this.allEquipments.push(equipment);
        }
      });
    });
  }

  selectTerminal(terminal: Terminal): void {
    if (this.multiSelectionMode) {
      const index = this.selectedTerminals.findIndex(t => t.terminalId === terminal.terminalId);
      if (index === -1) {
        // Add to selection
        this.selectedTerminals.push(terminal);
      } else {
        // Remove from selection
        this.selectedTerminals.splice(index, 1);
        
        // Also remove any categories from this terminal from the selection
        this.selectedCategories = this.selectedCategories.filter(category => {
          return !terminal.categories?.some(c => c.categoryId === category.categoryId);
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
      const index = this.selectedCategories.findIndex(c => c.categoryId === category.categoryId);
      if (index === -1) {
        // Add to selection
        this.selectedCategories.push(category);
      } else {
        // Remove from selection
        this.selectedCategories.splice(index, 1);
        
        // Also remove any equipment from this category from the selection
        this.selectedEquipments = this.selectedEquipments.filter(equipment => {
          return !category.equipments?.some(e => e.engineTypeId === equipment.engineTypeId);
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
      const index = this.selectedEquipments.findIndex(e => e.engineTypeId === equipment.engineTypeId);
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
      return this.selectedTerminals.some(t => t.terminalId === terminal.terminalId);
    } else {
      return this.selectedTerminal?.terminalId === terminal.terminalId;
    }
  }

  isCategorySelected(category: Category): boolean {
    if (this.multiSelectionMode) {
      return this.selectedCategories.some(c => c.categoryId === category.categoryId);
    } else {
      return this.selectedCategory?.categoryId === category.categoryId;
    }
  }

  isEquipmentSelected(equipment: Equipment): boolean {
    if (this.multiSelectionMode) {
      return this.selectedEquipments.some(e => e.engineTypeId === equipment.engineTypeId);
    } else {
      return this.selectedEquipment?.engineTypeId === equipment.engineTypeId;
    }
  }

  proceedToVisualization(): void {
    // Set loading state
    this.isLoading = true;
    
    // Simulate API call or data processing
    // setTimeout(() => {
    //   // Implement navigation to visualization page with selected items
    //   console.log('Proceeding to visualization with:', {
    //     multiSelectionMode: this.multiSelectionMode,
    //     selectedTerminal: this.selectedTerminal,
    //     selectedCategory: this.selectedCategory,
    //     selectedEquipment: this.selectedEquipment,
    //     selectedTerminals: this.selectedTerminals,
    //     selectedCategories: this.selectedCategories,
    //     selectedEquipments: this.selectedEquipments
    //   });
      
    //   // Navigation based on selection mode
    //   if (this.multiSelectionMode) {
    //     // Multi-selection mode navigation
    //     const terminalIds = this.selectedTerminals.map(t => t.terminalId);
    //     const categoryIds = this.selectedCategories.map(c => c.categoryId);
    //     const equipmentIds = this.selectedEquipments.map(e => e.engineTypeId);

    //     this.router.navigate(['/home'], {
    //       queryParams: {
    //         multiSelection: true,
    //         terminals: terminalIds.join(','),
    //         categories: categoryIds.join(','),
    //         equipments: equipmentIds.join(',')
    //       }
    //     });
    //   } else {
    //     // Single selection mode navigation
    //     if (this.selectedTerminal && this.selectedCategory && this.selectedEquipment) {
    //       this.router.navigate(['/home'], {
    //         queryParams: {
    //           multiSelection: false,
    //           terminal: this.selectedTerminal.terminalId,
    //           category: this.selectedCategory.categoryId,
    //           equipment: this.selectedEquipment.engineTypeId
    //         }
    //       });
    //     }
    //   }
      
    //   // Reset loading state
    //   this.isLoading = false;
    // }, 1500); // Simulate 1.5 second loading time

    // --- SINGLE SELECTION MODE ---
  if (!this.multiSelectionMode) {
    if (this.selectedTerminal && this.selectedEquipment) { // Only need these two
      this.router.navigate(['/home'], {
        queryParams: {
          terminalIds: [this.selectedTerminal.terminalId],
          equipmentIds: [this.selectedEquipment.engineTypeId]
        }
      });
    }
    return;
  }

    // --- MULTI SELECTION MODE ---
    if (this.multiSelectionMode) {
    const terminalIds = this.selectedTerminals.map(t => t.terminalId);
    const equipmentIds = this.selectedEquipments.map(e => e.engineTypeId);

    this.router.navigate(['/home'], {
      queryParams: {
        terminalIds: terminalIds.join(','),
        equipmentIds: equipmentIds.join(',')
      }
    });
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
