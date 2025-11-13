// estadisticas.js - Sistema completo de estadísticas
class SistemaEstadisticas {
    constructor() {
        console.log('📊 Iniciando sistema de estadísticas');
    }

    // Generar reporte mensual completo
    generarReporteMensual() {
        const turnos = JSON.parse(localStorage.getItem('turnos') || '[]');
        const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        const techTickets = JSON.parse(localStorage.getItem('techTickets') || '[]');
        
        const ahora = new Date();
        const mesActual = ahora.getMonth();
        const añoActual = ahora.getFullYear();

        // Estadísticas de turnos del mes
        const turnosMes = turnos.filter(turno => {
            const fechaTurno = new Date(turno.fecha);
            return fechaTurno.getMonth() === mesActual && 
                   fechaTurno.getFullYear() === añoActual;
        });

        // Estadísticas de tickets
        const ticketsAbiertos = tickets.filter(t => t.estado === 'Abierto');
        const ticketsCerrados = tickets.filter(t => t.estado === 'Cerrado');

        // Estadísticas por técnico
        const statsPorTecnico = this.calcularStatsPorTecnico(turnosMes, techTickets);

        const stats = {
            periodo: {
                mes: this.obtenerNombreMes(mesActual),
                año: añoActual
            },
            turnos: {
                total: turnosMes.length,
                completados: turnosMes.filter(t => t.estado === 'completado').length,
                pendientes: turnosMes.filter(t => t.estado === 'confirmado').length,
                cancelados: turnosMes.filter(t => t.estado === 'cancelado').length
            },
            tickets: {
                total: tickets.length,
                abiertos: ticketsAbiertos.length,
                cerrados: ticketsCerrados.length,
                tasaResolucion: tickets.length > 0 ? 
                    Math.round((ticketsCerrados.length / tickets.length) * 100) : 0
            },
            eficiencia: {
                tiempoPromedioResolucion: this.calcularTiempoPromedioResolucion(tickets),
                tasaCompletacionTurnos: turnosMes.length > 0 ? 
                    Math.round((turnosMes.filter(t => t.estado === 'completado').length / turnosMes.length) * 100) : 0,
                satisfaccionClientes: this.calcularSatisfaccionClientes()
            },
            porTecnico: statsPorTecnico,
            tendencias: this.calcularTendencias(turnos, tickets)
        };

        console.log('📈 Reporte generado:', stats);
        return stats;
    }

    // Calcular estadísticas por técnico
    calcularStatsPorTecnico(turnosMes, techTickets) {
        const tecnicos = ['Emmanuel Pilco', 'Rodrigo Tapia', 'Naobi Fernandez', 'Rafael Gonzales'];
        const stats = {};

        tecnicos.forEach(tecnico => {
            const turnosTecnico = turnosMes.filter(t => t.tecnico === tecnico);
            const ticketsTecnico = techTickets.filter(t => t.tecnico === tecnico);

            stats[tecnico] = {
                turnos: {
                    total: turnosTecnico.length,
                    completados: turnosTecnico.filter(t => t.estado === 'completado').length,
                    pendientes: turnosTecnico.filter(t => t.estado === 'confirmado').length
                },
                tickets: {
                    total: ticketsTecnico.length,
                    abiertos: ticketsTecnico.filter(t => t.estado === 'Abierto').length,
                    cerrados: ticketsTecnico.filter(t => t.estado === 'Cerrado').length
                },
                eficiencia: {
                    tasaCompletacion: turnosTecnico.length > 0 ?
                        Math.round((turnosTecnico.filter(t => t.estado === 'completado').length / turnosTecnico.length) * 100) : 0,
                    tiempoPromedio: this.calcularTiempoPromedioTecnico(ticketsTecnico)
                }
            };
        });

        return stats;
    }

    // Calcular tiempo promedio de resolución
    calcularTiempoPromedioResolucion(tickets) {
        const ticketsCerrados = tickets.filter(t => t.estado === 'Cerrado');
        if (ticketsCerrados.length === 0) return '0h';

        // Simulación - en un sistema real calcularías la diferencia entre creación y cierre
        const totalHoras = ticketsCerrados.reduce((acc, ticket) => {
            return acc + (Math.random() * 4 + 1); // Entre 1 y 5 horas
        }, 0);

        const promedio = totalHoras / ticketsCerrados.length;
        return `${promedio.toFixed(1)}h`;
    }

    calcularTiempoPromedioTecnico(ticketsTecnico) {
        const ticketsCerrados = ticketsTecnico.filter(t => t.estado === 'Cerrado');
        if (ticketsCerrados.length === 0) return '0h';

        const totalHoras = ticketsCerrados.reduce((acc, ticket) => {
            return acc + (Math.random() * 3 + 1); // Entre 1 y 4 horas
        }, 0);

        const promedio = totalHoras / ticketsCerrados.length;
        return `${promedio.toFixed(1)}h`;
    }

    // Calcular satisfacción de clientes (simulada)
    calcularSatisfaccionClientes() {
        // En un sistema real, esto vendría de encuestas
        const satisfaccionBase = 4.5; // Base 4.5/5
        const variacion = (Math.random() - 0.5) * 0.3; // ±0.15
        return (satisfaccionBase + variacion).toFixed(1);
    }

    // Calcular tendencias
    calcularTendencias(turnos, tickets) {
        const ultimoMes = this.obtenerDatosUltimoMes(turnos, tickets);
        const mesActual = this.generarReporteMensual();

        return {
            crecimientoTurnos: this.calcularCrecimiento(ultimoMes.turnos.total, mesActual.turnos.total),
            crecimientoTickets: this.calcularCrecimiento(ultimoMes.tickets.total, mesActual.tickets.total),
            mejoraEficiencia: this.calcularCrecimiento(ultimoMes.eficiencia.tasaCompletacionTurnos, mesActual.eficiencia.tasaCompletacionTurnos)
        };
    }

    calcularCrecimiento(anterior, actual) {
        if (anterior === 0) return actual > 0 ? 100 : 0;
        return Math.round(((actual - anterior) / anterior) * 100);
    }

    obtenerDatosUltimoMes(turnos, tickets) {
        // Simulación de datos del mes anterior
        return {
            turnos: { total: Math.max(0, turnos.length - 5) },
            tickets: { total: Math.max(0, tickets.length - 3) },
            eficiencia: { tasaCompletacionTurnos: 65 }
        };
    }

    obtenerNombreMes(mes) {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return meses[mes];
    }

    // Generar datos para gráficos
    generarDatosGraficos(stats) {
        return {
            graficoBarras: this.crearGraficoBarras(stats),
            graficoPastel: this.crearGraficoPastel(stats),
            metricasPrincipales: this.crearMetricasPrincipales(stats)
        };
    }

    crearGraficoBarras(stats) {
        const tecnicos = Object.keys(stats.porTecnico);
        const datosTurnos = tecnicos.map(tecnico => stats.porTecnico[tecnico].turnos.completados);
        const datosTickets = tecnicos.map(tecnico => stats.porTecnico[tecnico].tickets.cerrados);

        return {
            type: 'bar',
            data: {
                labels: tecnicos,
                datasets: [
                    {
                        label: 'Turnos Completados',
                        data: datosTurnos,
                        backgroundColor: '#0066cc'
                    },
                    {
                        label: 'Tickets Resueltos',
                        data: datosTickets,
                        backgroundColor: '#28a745'
                    }
                ]
            }
        };
    }

    crearGraficoPastel(stats) {
        return {
            type: 'doughnut',
            data: {
                labels: ['Completados', 'Pendientes', 'Cancelados'],
                datasets: [{
                    data: [
                        stats.turnos.completados,
                        stats.turnos.pendientes,
                        stats.turnos.cancelados
                    ],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545']
                }]
            }
        };
    }

    crearMetricasPrincipales(stats) {
        return `
            <div class="metricas-grid">
                <div class="metrica-card">
                    <div class="metrica-valor">${stats.turnos.total}</div>
                    <div class="metrica-label">Turnos Mes</div>
                    <div class="metrica-tendencia ${stats.tendencias.crecimientoTurnos >= 0 ? 'positiva' : 'negativa'}">
                        ${stats.tendencias.crecimientoTurnos >= 0 ? '↗' : '↘'} ${Math.abs(stats.tendencias.crecimientoTurnos)}%
                    </div>
                </div>
                <div class="metrica-card">
                    <div class="metrica-valor">${stats.eficiencia.tasaCompletacionTurnos}%</div>
                    <div class="metrica-label">Eficiencia</div>
                    <div class="metrica-tendencia ${stats.tendencias.mejoraEficiencia >= 0 ? 'positiva' : 'negativa'}">
                        ${stats.tendencias.mejoraEficiencia >= 0 ? '↗' : '↘'} ${Math.abs(stats.tendencias.mejoraEficiencia)}%
                    </div>
                </div>
                <div class="metrica-card">
                    <div class="metrica-valor">${stats.tickets.abiertos}</div>
                    <div class="metrica-label">Tickets Activos</div>
                    <div class="metrica-tendencia ${stats.tendencias.crecimientoTickets >= 0 ? 'positiva' : 'negativa'}">
                        ${stats.tendencias.crecimientoTickets >= 0 ? '↗' : '↘'} ${Math.abs(stats.tendencias.crecimientoTickets)}%
                    </div>
                </div>
                <div class="metrica-card">
                    <div class="metrica-valor">${stats.eficiencia.satisfaccionClientes}/5</div>
                    <div class="metrica-label">Satisfacción</div>
                    <div class="estrellas">${this.generarEstrellas(stats.eficiencia.satisfaccionClientes)}</div>
                </div>
            </div>
        `;
    }

    generarEstrellas(puntuacion) {
        const estrellasLlenas = Math.floor(puntuacion);
        const mediaEstrella = puntuacion % 1 >= 0.5;
        const estrellasVacias = 5 - estrellasLlenas - (mediaEstrella ? 1 : 0);
        
        let html = '';
        for (let i = 0; i < estrellasLlenas; i++) html += '⭐';
        if (mediaEstrella) html += '✨';
        for (let i = 0; i < estrellasVacias; i++) html += '☆';
        
        return html;
    }
}

// Instancia global
const estadisticas = new SistemaEstadisticas();
console.log('✅ Sistema de estadísticas listo');