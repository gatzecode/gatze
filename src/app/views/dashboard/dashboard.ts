import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { ConfigService } from '../../core/services/config.service';
import { BasicDataset } from './charts/basic-dataset';

export interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  color: string;
}

export interface RecentTransaction {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: Date;
}

export interface Activity {
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatBadgeModule,
    BasicDataset
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  configService = inject(ConfigService);

  // Tarjetas de estadísticas
  stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: '$48,574',
      icon: 'attach_money',
      change: '+12.5%',
      changeType: 'positive',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'New Orders',
      value: 156,
      icon: 'shopping_cart',
      change: '+8.2%',
      changeType: 'positive',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Active Users',
      value: '2,847',
      icon: 'people',
      change: '-3.1%',
      changeType: 'negative',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      icon: 'trending_up',
      change: '+0.8%',
      changeType: 'positive',
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  // Transacciones recientes
  recentTransactions: RecentTransaction[] = [
    {
      id: 'TRX-001',
      customer: 'John Doe',
      product: 'Premium Subscription',
      amount: 99.99,
      status: 'completed',
      date: new Date('2024-01-15'),
    },
    {
      id: 'TRX-002',
      customer: 'Jane Smith',
      product: 'Enterprise Plan',
      amount: 299.99,
      status: 'pending',
      date: new Date('2024-01-15'),
    },
    {
      id: 'TRX-003',
      customer: 'Bob Johnson',
      product: 'Basic Plan',
      amount: 29.99,
      status: 'completed',
      date: new Date('2024-01-14'),
    },
    {
      id: 'TRX-004',
      customer: 'Alice Williams',
      product: 'Pro Plan',
      amount: 149.99,
      status: 'completed',
      date: new Date('2024-01-14'),
    },
    {
      id: 'TRX-005',
      customer: 'Charlie Brown',
      product: 'Premium Subscription',
      amount: 99.99,
      status: 'cancelled',
      date: new Date('2024-01-13'),
    },
  ];

  // Columnas de la tabla
  displayedColumns: string[] = ['id', 'customer', 'product', 'amount', 'status', 'date'];

  // Actividades recientes
  recentActivities: Activity[] = [
    {
      icon: 'shopping_bag',
      title: 'New order received',
      description: 'Order #12345 from Jane Smith',
      time: '5 min ago',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: 'person_add',
      title: 'New user registered',
      description: 'Michael Chen joined the platform',
      time: '15 min ago',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: 'error',
      title: 'Payment failed',
      description: 'Transaction #98765 requires attention',
      time: '1 hour ago',
      color: 'text-red-600 dark:text-red-400',
    },
    {
      icon: 'campaign',
      title: 'Marketing campaign started',
      description: 'Summer Sale 2024 is now live',
      time: '2 hours ago',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: 'inventory',
      title: 'Stock alert',
      description: 'Product "Widget Pro" running low',
      time: '3 hours ago',
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  // Datos para gráfico de barras (simulado)
  chartData = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 52 },
    { label: 'Thu', value: 90 },
    { label: 'Fri', value: 85 },
    { label: 'Sat', value: 45 },
    { label: 'Sun', value: 58 },
  ];

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
