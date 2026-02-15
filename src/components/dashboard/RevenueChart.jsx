'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './RevenueChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RevenueChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [timeframe, setTimeframe] = useState('weekly');

  useEffect(() => {
    fetchRevenueData();
  }, [timeframe]);

  const fetchRevenueData = async () => {
    // Simulated data - replace with actual API call
    const data = {
      weekly: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        revenue: [4500, 5200, 4800, 5800, 6000, 4200, 3800],
        appointments: [12, 15, 13, 16, 18, 10, 8]
      },
      monthly: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        revenue: [18500, 21000, 19800, 22500],
        appointments: [58, 65, 62, 70]
      },
      yearly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        revenue: [72000, 68000, 75000, 82000, 79000, 85000, 88000, 92000, 89000, 95000, 98000, 102000],
        appointments: [220, 210, 235, 250, 240, 260, 270, 285, 275, 295, 305, 320]
      }
    };

    const selected = data[timeframe];
    
    setChartData({
      labels: selected.labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data: selected.revenue,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y-revenue',
        },
        {
          label: 'Appointments',
          data: selected.appointments,
          borderColor: '#48bb78',
          backgroundColor: 'rgba(72, 187, 120, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y-appointments',
        }
      ]
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1a202c',
        bodyColor: '#4a5568',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label.includes('Revenue')) {
              label += '$' + context.parsed.y.toLocaleString();
            } else {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      'y-revenue': {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      'y-appointments': {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return value + ' apts';
          }
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Revenue Overview</h3>
          <p className={styles.subtitle}>Track your financial performance</p>
        </div>
        
        <div className={styles.timeframeSelector}>
          <button 
            className={`${styles.timeBtn} ${timeframe === 'weekly' ? styles.active : ''}`}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`${styles.timeBtn} ${timeframe === 'monthly' ? styles.active : ''}`}
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`${styles.timeBtn} ${timeframe === 'yearly' ? styles.active : ''}`}
            onClick={() => setTimeframe('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className={styles.statsSummary}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Total Revenue</span>
          <span className={styles.statValue}>$184,500</span>
          <span className={styles.statTrend positive}>+12.5%</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Avg. per Day</span>
          <span className={styles.statValue}>$5,950</span>
          <span className={styles.statTrend positive}>+12.5%</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Total Appointments</span>
          <span className={styles.statValue}>3,245</span>
          <span className={styles.statTrend positive}>+15.2%</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Avg. per Appointment</span>
          <span className={styles.statValue}>$56.85</span>
          <span className={styles.statTrend negative}>-2.1%</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
          }
