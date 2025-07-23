import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler, // Importamos Filler para rellenar el área bajo la línea
} from 'chart.js';
import { authFetch } from '../../utils/authFetch';

// Registramos los nuevos elementos para el gráfico de LÍNEA
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

interface TendenciaData {
    labels: string[];
    data: number[];
}

const TendenciaDiariaChart = () => {
    const [chartConfig, setChartConfig] = useState<any>(null);
    const [error, setError] = useState('');
    const api_url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const cargarYConfigurarGrafico = async () => {
            try {
                // 1. Pedimos los datos a la API
                const apiData: TendenciaData = await authFetch(`${api_url}/api/reportes/tendencia-diaria`);

                if (!apiData || apiData.labels.length === 0) {
                    setError('No hay datos de tendencia para mostrar.');
                    return;
                }

                // 2. Leemos los colores del tema actual DESPUÉS de tener los datos
                const textColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-text-color').trim();
                const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim();
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
                const accentColorTransparent = getComputedStyle(document.documentElement).getPropertyValue('--accent-color-transparent').trim();

                // 3. Construimos el objeto de datos del gráfico con los colores del tema
                const data = {
                    labels: apiData.labels,
                    datasets: [
                        {
                            fill: true,
                            label: 'Gastos Diarios',
                            data: apiData.data,
                            borderColor: accentColor,
                            backgroundColor: accentColorTransparent,
                            tension: 0.4,
                            pointRadius: 3,
                            pointBackgroundColor: accentColor,
                        },
                    ],
                };

                // 4. Construimos el objeto de opciones del gráfico con los colores del tema
                const options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: textColor }, // Color dinámico
                            grid: { color: gridColor },   // Color dinámico
                        },
                        x: {
                            ticks: { color: textColor }, // Color dinámico
                            grid: { display: false },
                        },
                    },
                };

                // 5. Guardamos toda la configuración en el estado UNA SOLA VEZ
                setChartConfig({ data, options });

            } catch (err) {
                setError('No se pudo cargar el gráfico de tendencia.');
                console.error(err);
            }
        };

        cargarYConfigurarGrafico();
    }, [api_url]);

    // Lógica de renderizado
    if (error) return <p className="chart-message">{error}</p>;
    if (!chartConfig) return <p className="chart-message">Cargando tendencia...</p>;

    return (
        <div className="chart-wrapper">
            <Line options={chartConfig.options} data={chartConfig.data} />
        </div>
    );
};

export default TendenciaDiariaChart;