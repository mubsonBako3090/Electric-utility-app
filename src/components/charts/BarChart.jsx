'use client';

import React, { useEffect, useRef } from 'react';
import styles from './BarChart.module.css';
import clsx from 'clsx';

const BarChart = ({
  data,
  xKey = 'label',
  yKey = 'value',
  title,
  height = 300,
  barColor = '#1E3A8A',
  showGrid = true,
  showLabels = true,
  showTooltip = true,
  animate = true,
}) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const tooltip = tooltipRef.current;

    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Calculate chart dimensions
    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;

    // Find max value for scaling
    const maxValue = Math.max(...data.map((d) => d[yKey])) * 1.1;

    // Bar dimensions
    const barWidth = (chartWidth / data.length) * 0.7;
    const barSpacing = (chartWidth / data.length) * 0.3;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (i / 5) * chartHeight;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
      }

      ctx.stroke();
    }

    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item[yKey] / maxValue) * chartHeight;
      const x = padding.left + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = canvas.height - padding.bottom - barHeight;

      // Bar
      ctx.fillStyle = barColor;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Animation effect
      if (animate) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'white';
        ctx.fillRect(x + barWidth * 0.8, y, 2, barHeight);
        ctx.restore();
      }

      // Label
      if (showLabels) {
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          item[xKey],
          x + barWidth / 2,
          canvas.height - padding.bottom + 20
        );

        // Value on top of bar
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(
          item[yKey],
          x + barWidth / 2,
          y - 8
        );
      }
    });

    // Tooltip handling
    if (showTooltip) {
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let hoveredIndex = -1;
        data.forEach((item, index) => {
          const x = padding.left + index * (barWidth + barSpacing) + barSpacing / 2;
          if (mouseX >= x && mouseX <= x + barWidth) {
            hoveredIndex = index;
          }
        });

        if (hoveredIndex !== -1 && mouseY <= canvas.height - padding.bottom) {
          const item = data[hoveredIndex];
          tooltip.style.display = 'block';
          tooltip.style.left = e.clientX + 'px';
          tooltip.style.top = e.clientY - 40 + 'px';
          tooltip.innerHTML = `
            <strong>${item[xKey]}</strong><br/>
            Value: ${item[yKey]}
          `;
        } else {
          tooltip.style.display = 'none';
        }
      });
    }
  }, [data, xKey, yKey, barColor, showGrid, showLabels, animate]);

  return (
    <div className={styles.chartContainer}>
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <div className={styles.chartWrapper} style={{ height }}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          style={{ width: '100%', height: '100%' }}
        />
        <div ref={tooltipRef} className={styles.tooltip} />
      </div>
    </div>
  );
};

export default BarChart;
