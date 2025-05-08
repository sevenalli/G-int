import { Injectable, signal, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly DARK_THEME_CLASS = 'dark-theme';
  private renderer: Renderer2;
  
  // Use signal for reactive theme state
  public isDarkTheme = signal(false);

  // Dark theme colors
  private darkThemeColors = {
    bodyBg: '#1a1a2e',
    cardBg: '#2a3950',
    panelBg: '#2a3950',
    textColor: '#ffffff',
    primaryColor: '#4dabf5',
    secondaryColor: '#82c4f8',
    borderColor: '#3d5a80',
    navbarBg: '#0f1525'
  };

  // Light theme colors
  private lightThemeColors = {
    bodyBg: '#ffffff',
    cardBg: '#e0f0ff',
    panelBg: '#e0f0ff',
    textColor: '#2c3e50',
    primaryColor: '#005aaa',
    secondaryColor: '#0078d4',
    borderColor: '#e0e0e0',
    navbarBg: '#ffffff'
  };

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    // Initialize theme from localStorage or system preference
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    
    if (savedTheme) {
      // Use saved preference
      this.setTheme(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark);
    }
  }

  public toggleTheme(): void {
    const newTheme = !this.isDarkTheme();
    this.setTheme(newTheme);
  }

  private setTheme(isDark: boolean): void {
    // Update signal
    this.isDarkTheme.set(isDark);
    
    // Save to localStorage
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
    
    // Get the colors for the current theme
    const colors = isDark ? this.darkThemeColors : this.lightThemeColors;
    
    // Apply theme to body
    this.renderer.setStyle(this.document.body, 'background-color', colors.bodyBg);
    this.renderer.setStyle(this.document.body, 'color', colors.textColor);
    
    // Apply theme class to body
    if (isDark) {
      this.renderer.addClass(this.document.body, this.DARK_THEME_CLASS);
    } else {
      this.renderer.removeClass(this.document.body, this.DARK_THEME_CLASS);
    }
    
    // Apply styles to navbar
    const navbar = this.document.querySelector('nav.navbar');
    if (navbar) {
      this.renderer.setStyle(navbar, 'background-color', colors.navbarBg);
      // Add !important via priority style
      (navbar as HTMLElement).style.setProperty('background-color', colors.navbarBg, 'important');
    }
    
    // Apply styles to cards
    const cards = this.document.querySelectorAll('.card');
    cards.forEach(card => {
      this.renderer.setStyle(card, 'background-color', colors.cardBg);
      this.renderer.setStyle(card, 'border-color', colors.borderColor);
      if (isDark) {
        this.renderer.setStyle(card, 'box-shadow', '0 4px 8px rgba(0, 0, 0, 0.3)');
      } else {
        this.renderer.setStyle(card, 'box-shadow', '0 4px 8px rgba(0, 0, 0, 0.1)');
      }
    });
    
    // Apply styles to crane panels
    const panels = this.document.querySelectorAll('.crane-panel');
    panels.forEach(panel => {
      this.renderer.setStyle(panel, 'background-color', colors.panelBg);
      this.renderer.setStyle(panel, 'border-color', colors.borderColor);
      if (isDark) {
        this.renderer.setStyle(panel, 'box-shadow', '0 6px 12px rgba(0, 0, 0, 0.3)');
        this.renderer.setStyle(panel, 'border-width', '2px');
      } else {
        this.renderer.setStyle(panel, 'box-shadow', '0 6px 12px rgba(0, 0, 0, 0.1)');
      }
    });
    
    // Apply styles to action cards
    const actionCards = this.document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
      if (isDark) {
        this.renderer.setStyle(card, 'background', `linear-gradient(145deg, ${colors.secondaryColor}, ${colors.primaryColor})`);
        this.renderer.setStyle(card, 'color', '#ffffff');
        this.renderer.setStyle(card, 'box-shadow', '0 4px 8px rgba(0, 0, 0, 0.3)');
      } else {
        this.renderer.setStyle(card, 'background', `linear-gradient(145deg, ${colors.secondaryColor}, ${colors.primaryColor})`);
        this.renderer.setStyle(card, 'box-shadow', '0 4px 8px rgba(0, 0, 0, 0.1)');
      }
    });
    
    // Apply styles to status indicators
    const statusIndicators = this.document.querySelectorAll('.status-indicator, .notification-indicator');
    statusIndicators.forEach(indicator => {
      if (isDark) {
        this.renderer.setStyle(indicator, 'filter', 'brightness(1.2)');
      } else {
        this.renderer.setStyle(indicator, 'filter', 'none');
      }
    });
  }
}
