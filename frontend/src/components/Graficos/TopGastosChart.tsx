import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { authFetch } from '../../utils/authFetch';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TopGastoData {
  item: string;
  monto: number;
}

const TopGastosChart = () => {
  const [chartConfig, setChartConfig] = useState<{ data: any; options: any; } | null>(null);
  const [error, setError] = useState('');
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const cargarYConfigurarGrafico = async () => {
      try {
        // 1. Pedimos los datos a la API
        const apiData: TopGastoData[] = await authFetch(`${api_url}/api/reportes/top-gastos`);

        if (!apiData || apiData.length === 0) {
          setError('No tienes gastos registrados este mes.');
          return;
        }

        // 2. Leemos los colores del tema desde el CSS
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-text-color').trim();
        const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim();
        const dangerColor = getComputedStyle(document.documentElement).getPropertyValue('--danger-color').trim();
        const dangerColorTransparent = getComputedStyle(document.documentElement).getPropertyValue('--danger-color-transparent').trim();

        // 3. Preparamos los datos para el gráfico
        const reversedData = [...apiData].reverse();
        const labels = reversedData.map(d => d.item);
        const montos = reversedData.map(d => d.monto);

        const data = {
          labels,
          datasets: [{
            label: 'Monto Gasto',
            data: montos,
            borderColor: dangerColor,
            backgroundColor: dangerColorTransparent,
            borderWidth: 1,
          }],
        };

        // 4. Preparamos las opciones del gráfico con los colores del tema
        const options = {
          indexAxis: 'y' as const,
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: false },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { color: textColor },
              grid: { color: gridColor },
              title: { display: true, text: 'Monto en S/.', color: textColor },
            },
            y: {
              ticks: { color: textColor },
              grid: { color: 'transparent' },
            }
          }
        };

        // 5. Guardamos toda la configuración en el estado UNA SOLA VEZ
        setChartConfig({ data, options });

      } catch (err) {
        setError('No se pudo cargar el top de gastos.');
        console.error(err);
      }
    };

    cargarYConfigurarGrafico();
  }, [api_url]);

  if (error) return <p className="chart-message">{error}</p>;
  // Mientras chartConfig sea null, mostramos el mensaje de carga
  if (!chartConfig) return <p className="chart-message">Cargando top 5 de gastos...</p>;

  return (
    <div className="chart-wrapper">
      <Bar options={chartConfig.options} data={chartConfig.data} />
    </div>
  );
};

export default TopGastosChart;