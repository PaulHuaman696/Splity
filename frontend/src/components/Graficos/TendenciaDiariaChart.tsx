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
    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });
    const [error, setError] = useState('');
    const api_url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        authFetch(`${api_url}/api/reportes/tendencia-diaria`)
            .then((data: TendenciaData) => {
                if (!data || data.labels.length === 0) {
                    setError('No hay datos de tendencia para mostrar.');
                    return;
                }

                const chartConfig = {
                    labels: data.labels,
                    datasets: [
                        {
                            fill: true, // Rellenar el área bajo la línea
                            label: 'Gastos Diarios',
                            data: data.data,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.2)',
                            tension: 0.4, // Hace la línea curva y suave
                        },
                    ],
                };
                setChartData(chartConfig);
            })
            .catch(() => setError('No se pudo cargar el gráfico de tendencia.'));
    }, [api_url]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // No necesitamos leyenda para una sola línea
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    if (error) return <p className="chart-message">{error}</p>;
    if (chartData.labels.length === 0) return <p className="chart-message">Cargando tendencia...</p>;

    return (
        <div className="chart-wrapper">
            <Line options={options} data={chartData} />
        </div>
    );
};

export default TendenciaDiariaChart;