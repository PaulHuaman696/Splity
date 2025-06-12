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

// Registramos los componentes necesarios para un gráfico de BARRAS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Tipado para los datos que esperamos de la API
interface HistorialData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

const HistorialMensualChart = () => {
  const [chartData, setChartData] = useState<HistorialData | null>(null);
  const [error, setError] = useState('');
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    authFetch(`${api_url}/api/reportes/historial-mensual`)
      .then((data: HistorialData) => {
        if (!data || data.labels.length === 0) {
          setError('No hay datos históricos para mostrar.');
          return;
        }
        setChartData(data);
      })
      .catch(() => setError('No se pudo cargar el gráfico de historial.'));
  }, [api_url]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false, // El título lo pondremos en el Dashboard
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // 👇 --- LA CORRECCIÓN ESTÁ AQUÍ --- 👇
          // Cambiamos el tipo de 'value' de 'number' a 'string | number'
          // para que coincida con la definición de tipos de Chart.js.
          callback: function(value: string | number) {
            return 'S/.' + value;
          }
        }
      }
    }
  };

  if (error) return <p className="chart-message">{error}</p>;
  if (!chartData) return <p className="chart-message">Cargando historial...</p>;

  // Añadimos un contenedor con clase para darle estilos si es necesario
  return (
    <div className="chart-wrapper">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default HistorialMensualChart;