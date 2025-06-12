import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { authFetch } from '../../utils/authFetch';

// Es necesario registrar los componentes del gráfico que vamos a usar
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoriaData {
    categoria: string;
    total: number;
}

// --- 1. DEFINIMOS LOS TIPOS PARA EL ESTADO DEL GRÁFICO ---
interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
}

interface ChartDataState {
    labels: string[];
    datasets: ChartDataset[];
}
// --- FIN DE LA DEFINICIÓN DE TIPOS ---


const GastosPorCategoriaChart = () => {
    const [chartData, setChartData] = useState<ChartDataState>({
        labels: [],
        datasets: [],
    });
    const [error, setError] = useState('');
    const api_url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        authFetch(`${api_url}/api/reportes/gastos-por-categoria`)
            .then((data: CategoriaData[]) => {
                if (data.length === 0) {
                    setError('No hay datos de gastos para mostrar en el gráfico.');
                    return;
                }

                const labels = data.map(d => d.categoria);
                const totals = data.map(d => d.total);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Gastos por Categoría',
                            data: totals,
                            backgroundColor: [ // Puedes añadir más colores
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(153, 102, 255, 0.7)',
                                'rgba(255, 159, 64, 0.7)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                });
            })
            .catch(() => setError('No se pudo cargar el gráfico de gastos.'));
    }, [api_url]);

    const options = {
        responsive: true,
        cutout: '60%',
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: false,
            },
        },
    };

    if (error) return <p style={{ textAlign: 'center', color: 'gray', padding: '2rem' }}>{error}</p>;
    if (chartData.labels.length === 0) return <p style={{ textAlign: 'center', color: 'gray', padding: '2rem' }}>Cargando gráfico...</p>;

    return (
        <div className="chart-wrapper">
            <Doughnut options={options} data={chartData} />
        </div>
    );
};

export default GastosPorCategoriaChart;