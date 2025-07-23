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
    borderColor: string;
    borderWidth: number;
  }[];
}

const HistorialMensualChart = () => {
  const [chartData, setChartData] = useState<HistorialData | null>(null);
  // Estado para las opciones del gráfico, que construiremos dinámicamente
  const [chartOptions, setChartOptions] = useState<any>({});
  const [error, setError] = useState('');
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const cargarYConfigurarGrafico = async () => {
      try {
        // 1. Pedimos los datos a la API (estos ya traen los colores para las barras)
        const apiData: HistorialData = await authFetch(`${api_url}/api/reportes/historial-mensual`);

        if (!apiData || apiData.labels.length === 0) {
          setError('No hay datos históricos para mostrar.');
          return;
        }

        // 2. Guardamos los datos del gráfico tal como vienen del backend
        setChartData(apiData);

        // 3. Leemos los colores para la INTERFAZ del gráfico desde el CSS
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-text-color').trim();
        const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim();

        // 4. Construimos el objeto de opciones con los colores dinámicos
        const options = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
              labels: {
                color: textColor, // <-- Color dinámico para la leyenda
              }
            },
            title: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: textColor, // <-- Color dinámico para el eje Y
                callback: (value: string | number) => 'S/.' + value
              },
              grid: {
                color: gridColor, // <-- Color dinámico para la rejilla
              }
            },
            x: {
              ticks: {
                color: textColor, // <-- Color dinámico para el eje X
              },
              grid: {
                display: false, // Ocultamos las líneas verticales para un look más limpio
              }
            }
          }
        };

        setChartOptions(options);

      } catch (err) {
        setError('No se pudo cargar el gráfico de historial.');
        console.error(err);
      }
    };

    cargarYConfigurarGrafico();
  }, [api_url]);

  if (error) return <p className="chart-message">{error}</p>;
  if (!chartData) return <p className="chart-message">Cargando historial...</p>;

  // Añadimos un contenedor con clase para darle estilos si es necesario
  return (
        <div className="chart-wrapper">
            <Bar options={chartOptions} data={chartData} />
        </div>
    );
};

export default HistorialMensualChart;