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




const GastosPorCategoriaChart = () => {
    // Estado para los datos que vienen de la API
    const [apiData, setApiData] = useState<CategoriaData[]>([]);
    const [chartData, setChartData] = useState<any>({ datasets: [] });
    const [chartOptions, setChartOptions] = useState<any>({});
    const [error, setError] = useState('');
    const api_url = import.meta.env.VITE_API_URL;

    // useEffect para buscar los datos iniciales
    useEffect(() => {
        authFetch(`${api_url}/api/reportes/gastos-por-categoria`)
            .then((data) => {
                if (data.length === 0) {
                    setError('No hay datos de gastos para mostrar.');
                    return;
                }
                setApiData(data);
            })
            .catch(() => setError('No se pudo cargar el gráfico de gastos.'));
    }, [api_url]);

    // useEffect para CONSTRUIR el gráfico cuando los datos o el tema cambien
    useEffect(() => {
        // Leemos las variables de color directamente del CSS
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-text-color').trim();
        const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--chart-color-1').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--chart-color-2').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--chart-color-3').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--chart-color-4').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--chart-color-5').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--chart-color-6').trim(),
        ];

        // Configuramos las opciones del gráfico con los colores del tema
        setChartOptions({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom' as const,
                    labels: {
                        color: textColor, // Usamos el color del tema
                        font: { size: 12 }
                    }
                },
                title: {
                    display: false, // El título lo manejamos en el Dashboard
                },
            },
        });

        // Formateamos los datos del gráfico con los colores del tema
        if (apiData.length > 0) {
            setChartData({
                labels: apiData.map(d => d.categoria),
                datasets: [
                    {
                        label: 'Gastos por Categoría',
                        data: apiData.map(d => d.total),
                        backgroundColor: colors,
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--surface-color').trim(),
                        borderWidth: 1.5,
                    },
                ],
            });
        }

    }, [apiData]); // Este efecto se re-ejecuta si los datos de la API cambian

    

    if (error) return <p className="chart-message">{error}</p>;
    if (apiData.length === 0 && !error) return <p className="chart-message">Cargando gráfico...</p>;

    return (
        <div className="chart-wrapper">
            <Doughnut options={chartOptions} data={chartData} />
        </div>
    );
};

export default GastosPorCategoriaChart;