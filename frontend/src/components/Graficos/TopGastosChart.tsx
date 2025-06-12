import React, { useEffect, useState } from 'react';
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
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [error, setError] = useState('');
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    authFetch(`${api_url}/api/reportes/top-gastos`)
      .then((data: TopGastoData[]) => {
        if (!data || data.length === 0) {
          setError('No tienes gastos registrados este mes.');
          return;
        }

        // Invertimos los datos para que el más grande aparezca arriba en el gráfico
        const reversedData = data.reverse();
        const labels = reversedData.map(d => d.item);
        const montos = reversedData.map(d => d.monto);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Monto Gasto',
              data: montos,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        });
      })
      .catch(() => setError('No se pudo cargar el top de gastos.'));
  }, [api_url]);

  const options = {
    indexAxis: 'y' as const, // <-- ¡Esta línea convierte el gráfico en horizontal!
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monto en S/.'
        }
      }
    }
  };

  if (error) return <p className="chart-message">{error}</p>;
  if (chartData.labels.length === 0) return <p className="chart-message">Cargando top 5 de gastos...</p>;

  return (
    <div className="chart-wrapper">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default TopGastosChart;