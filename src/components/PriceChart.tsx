import {useEffect, useRef} from 'react';
import type {IChartApi, ISeriesApi, LineData, Time} from 'lightweight-charts';
import {createChart, LineSeries} from 'lightweight-charts';
import type {PriceTimeSeriesDto} from '../services/api';

interface PriceChartProps {
  data: PriceTimeSeriesDto[];
  height?: number;
}

export default function PriceChart({ data, height = 400 }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const containerWidth = container.clientWidth || 800; // Default width if not available

    // Create chart with theme colors
    const chart = createChart(container, {
      layout: {
        background: { color: '#1f2937' }, // surface-dark
        textColor: '#d1d5db', // text color
      },
      grid: {
        vertLines: { 
          color: '#374151', // border-dark
          style: 1, // solid
        },
        horzLines: { 
          color: '#374151', // border-dark
          style: 1, // solid
        },
      },
      width: containerWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#374151', // border-dark
      },
      rightPriceScale: {
        borderColor: '#374151', // border-dark
        textColor: '#9ca3af', // text-muted
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      leftPriceScale: {
        visible: false,
      },
    });

    chartRef.current = chart;

    // Use primary color for the line (green #13ec6a from dashboard theme)
    seriesRef.current = chart.addSeries(LineSeries, {
      color: '#3b82f6', // primary-dashboard (green)
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          return new Intl.NumberFormat('ru-RU', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(price) + ' RUB';
        },
        minMove: 0.01,
      },
    });

    // Handle resize
    const handleResize = () => {
      if (container && chart) {
        const newWidth = container.clientWidth;
        if (newWidth > 0) {
          chart.applyOptions({ width: newWidth });
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chart) {
        chart.remove();
      }
    };
  }, [height]);

  useEffect(() => {
    if (!seriesRef.current || !data || data.length === 0) return;

    // Transform data from backend format to chart format
    const chartData: LineData[] = data.map((item) => ({
      time: (item.time / 1000) as Time, // Convert milliseconds to seconds for lightweight-charts
      value: item.price,
    }));

    seriesRef.current.setData(chartData);

    // Fit content to show all data
    if (chartRef.current && chartData.length > 0) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  return (
    <div ref={chartContainerRef} className="w-full rounded-lg bg-surface-dark" style={{ height: `${height}px` }}>
      {(!data || data.length === 0) && (
        <div className="flex items-center justify-center h-full">
          <p className="text-text-muted">No price history data available</p>
        </div>
      )}
    </div>
  );
}

