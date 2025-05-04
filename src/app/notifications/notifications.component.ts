import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Interface for notification data
export interface Notification {
  id: number;
  craneId: string;
  timestamp: Date;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  category: 'maintenance' | 'operation' | 'system' | 'safety';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  // Filter states
  priorityFilter: string = 'all';
  categoryFilter: string = 'all';
  showUnreadOnly: boolean = false;
  searchText: string = '';
  
  // Selected crane ID from route parameter
  selectedCraneId: string | null = null;
  craneFiltered: boolean = false;

  // Notifications data
  notifications: Notification[] = [
    {
      id: 1,
      craneId: 'G400001',
      timestamp: new Date(2025, 4, 4, 8, 15),
      title: 'Maintenance Due',
      message: 'Scheduled hydraulic system maintenance required within 48 hours.',
      priority: 'medium',
      isRead: false,
      category: 'maintenance'
    },
    {
      id: 2,
      craneId: 'G400005',
      timestamp: new Date(2025, 4, 4, 9, 22),
      title: 'Emergency Brake Wear',
      message: 'Critical wear detected on emergency brake system. Immediate inspection required.',
      priority: 'high',
      isRead: false,
      category: 'safety'
    },
    {
      id: 3,
      craneId: 'G380003',
      timestamp: new Date(2025, 4, 3, 16, 45),
      title: 'Luffing Motor Temperature',
      message: 'Luffing motor temperature exceeding normal operational parameters.',
      priority: 'medium',
      isRead: true,
      category: 'operation'
    },
    {
      id: 4,
      craneId: 'M630001',
      timestamp: new Date(2025, 4, 3, 14, 10),
      title: 'Software Update Available',
      message: 'New control system update available. Schedule installation during next maintenance period.',
      priority: 'low',
      isRead: false,
      category: 'system'
    },
    {
      id: 5,
      craneId: 'G400005',
      timestamp: new Date(2025, 4, 2, 11, 30),
      title: 'Grab Cable Tension Warning',
      message: 'Abnormal tension detected in grab cables. Inspection recommended.',
      priority: 'medium',
      isRead: true,
      category: 'operation'
    },
    {
      id: 6,
      craneId: 'G400001',
      timestamp: new Date(2025, 4, 1, 9, 15),
      title: 'Oil Level Low',
      message: 'Hydraulic system oil level below recommended threshold. Refill required.',
      priority: 'medium',
      isRead: true,
      category: 'maintenance'
    },
    {
      id: 7,
      craneId: 'G380003',
      timestamp: new Date(2025, 4, 1, 7, 45),
      title: 'Annual Inspection Due',
      message: 'Annual certification inspection due in 10 days.',
      priority: 'low',
      isRead: false,
      category: 'maintenance'
    },
    {
      id: 8,
      craneId: 'M630001',
      timestamp: new Date(2025, 3, 30, 16, 20),
      title: 'Operator Authentication Failed',
      message: 'Multiple failed authentication attempts detected. Security check recommended.',
      priority: 'high',
      isRead: true,
      category: 'system'
    },
    {
      id: 9,
      craneId: 'G400005',
      timestamp: new Date(2025, 3, 29, 13, 10),
      title: 'Rotation Motor Overload',
      message: 'Rotation motor experienced overload condition. Performance check recommended.',
      priority: 'high',
      isRead: false,
      category: 'operation'
    },
    {
      id: 10,
      craneId: 'G400001',
      timestamp: new Date(2025, 3, 28, 10, 40),
      title: 'Wind Speed Warning',
      message: 'Operation near maximum wind speed threshold detected. Review safety protocols.',
      priority: 'medium',
      isRead: true,
      category: 'safety'
    }
  ];

  // Filtered notifications based on current filters
  filteredNotifications: Notification[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to route parameters to get craneId
    this.route.paramMap.subscribe(params => {
      this.selectedCraneId = params.get('craneId');
      this.craneFiltered = !!this.selectedCraneId;
      
      // If we have a craneId, auto-filter by crane
      if (this.selectedCraneId) {
        console.log('Filtering by crane ID:', this.selectedCraneId);
      }
      
      this.applyFilters();
    });
  }

  // Apply all active filters to the notifications
  applyFilters(): void {
    this.filteredNotifications = this.notifications.filter(notification => {
      // Crane ID filter (highest priority)
      if (this.selectedCraneId && notification.craneId !== this.selectedCraneId) {
        return false;
      }
      
      // Priority filter
      if (this.priorityFilter !== 'all' && notification.priority !== this.priorityFilter) {
        return false;
      }
      
      // Category filter
      if (this.categoryFilter !== 'all' && notification.category !== this.categoryFilter) {
        return false;
      }
      
      // Read/Unread filter
      if (this.showUnreadOnly && notification.isRead) {
        return false;
      }
      
      // Search text filter
      if (this.searchText.trim() !== '') {
        const searchLower = this.searchText.toLowerCase();
        return notification.title.toLowerCase().includes(searchLower) || 
               notification.message.toLowerCase().includes(searchLower) ||
               notification.craneId.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  }

  // Filter by priority
  filterByPriority(priority: string): void {
    this.priorityFilter = priority;
    this.applyFilters();
  }

  // Filter by category
  filterByCategory(category: string): void {
    this.categoryFilter = category;
    this.applyFilters();
  }

  // Toggle unread only filter
  toggleUnreadOnly(): void {
    this.showUnreadOnly = !this.showUnreadOnly;
    this.applyFilters();
  }

  // Search in notifications
  search(text: string): void {
    this.searchText = text;
    this.applyFilters();
  }

  // Mark a notification as read
  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.applyFilters();
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.applyFilters();
  }

  // Get count of unread notifications
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Get CSS class for priority badge
  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'high': return 'badge bg-danger';
      case 'medium': return 'badge bg-warning text-dark';
      case 'low': return 'badge bg-info text-dark';
      default: return 'badge bg-secondary';
    }
  }

  // Get icon for notification category
  getCategoryIcon(category: string): string {
    switch(category) {
      case 'maintenance': return 'bi bi-tools';
      case 'operation': return 'bi bi-gear';
      case 'system': return 'bi bi-cpu';
      case 'safety': return 'bi bi-shield-exclamation';
      default: return 'bi bi-bell';
    }
  }

  // Format date for display
  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today, ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else if (diffDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else {
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
  }
}
