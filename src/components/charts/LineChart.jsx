'use client';

import React, { useEffect, useRef } from 'react';
import styles from './LineChart.module.css';
import clsx from 'clsx';

const LineChart = ({
  data,
  xKey = 'label',
  yKey = 'value',
  title,
  height = 300,
  lineColor = '#1E3A8A',
  fillColor = '#EEF2FF',
  showPoints = true,
  showGrid = true,
  showLabels = true,
  showTooltip = true,
  smooth = true,
}) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const tooltip = tooltipRef.current;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.map((d) => d[yKey])) * 1.1;
    const minValue = Math.min(...data.map((d) => d[yKey])) * 0.9;

    const xStep = chartWidth / (data.length - 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (i / 5) * chartHeight;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
      }
      ctx.stroke();
    }

    // Calculate points
    const points = data.map((item, index) => ({
      x: padding.left + index * xStep,
      y: canvas.height - padding.bottom - ((item[yKey] - minValue) / (maxValue - minValue)) * chartHeight,
      value: item[yKey],
      label: item[xKey],
    }));

    // Draw fill
    ctx.beginPath();
    ctx.moveTo(points[0].x, canvas.height - padding.bottom);
    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, canvas.height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (smooth) {
      // Smooth curve using cubic bezier
      for (let i = 0; i < points.length - 1; i++) {
        const x1 = points[i].x;
        const y1 = points[i].y;
        const x2 = points[i + 1].x;
        const y2 = points[i + 1].y;

        const cp1x = x1 + (x2 - x1) / 3;
        const cp2x = x2 - (x2 - x1) / 3;

        ctx.bezierCurveTo(cp1x, y1, cp2x, y2, x2, y2);
      }
    } else {
      points.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
    }

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw points
    if (showPoints) {
      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    // Draw labels
    if (showLabels) {
      points.forEach((point, index) => {
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data[index][xKey], point.x, canvas.height - padding.bottom + 20);

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(data[index][yKey], point.x, point.y - 12);
      });
    }

    // Tooltip
    if (showTooltip) {
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        let closestPoint = null;
        let minDist = Infinity;

        points.forEach((point) => {
          const dist = Math.abs(point.x - mouseX);
          if (dist < minDist) {
            minDist = dist;
            closestPoint = point;
          }
        });

        if (closestPoint && minDist < 30) {
          tooltip.style.display = 'block';
          tooltip.style.left = e.clientX + 'px';
          tooltip.style.top = e.clientY - 40 + 'px';
          tooltip.innerHTML = `
            <strong>${closestPoint.label}</strong><br/>
            Value: ${closestPoint.value}
          `;
        } else {
          tooltip.style.display = 'none';
        }
      });
    }
  }, [data, xKey, yKey, lineColor, fillColor, showPoints, showGrid, showLabels, smooth]);

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

export default LineChart;
