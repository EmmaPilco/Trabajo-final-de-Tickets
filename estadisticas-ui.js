// estadisticas-ui.js - Interfaz para estadísticas
class EstadisticasUI {
    constructor() {
        console.log('🎨 Inicializando UI de estadísticas');
        this.stats = null;
    }

    // Cargar y mostrar todas las estadísticas
    cargarEstadisticas() {
        console.log('📈 Cargando estadísticas...');
        
        this.mostrarLoading();
        
        // Simular carga (en un sistema real sería instantáneo)
        setTimeout(() => {
            this.stats = estadisticas.generarReporteMensual();
            this.mostrarEstadisticas();
        }, 1000);
    }

    mostrarLoading() {
        const container = document.getElementById('estadisticasContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="estadisticas-loading">
                <div class="loading-spinner"></div>
                <h3>Generando reporte de estadísticas...</h3>
                <p>Analizando datos de turnos y tickets</p>
            </div>
        `;
    }

    mostrarEstadisticas() {
        const container = document.getElementById('estadisticasContainer');
        if (!container || !this.stats) return;

        const graficos = estadisticas.generarDatosGraficos(this.stats);

        container.innerHTML = `
            <!-- Métricas Principales -->
            <div class="metricas-principales">
                ${graficos.metricasPrincipales}
            </div>

            <!-- Gráficos -->
            <div class="graficos-container">
                <div class="grafico-card">
                    <h3>📊 Rendimiento por Técnico</h3>
                    <div class="grafico-placeholder">
                        <div style="text-align: center;">
                            <div style="font-size: 3em; margin-bottom: 10px;">📈</div>
                            <div>Gráfico de Barras - Turnos vs Tickets</div>
                            <small style="color: #888;">Turnos Completados: ${this.stats.porTecnico['Emmanuel Pilco']?.turnos.completados || 0} | Tickets Resueltos: ${this.stats.porTecnico['Emmanuel Pilco']?.tickets.cerrados || 0}</small>
                        </div>
                    </div>
                </div>
                
                <div class="grafico-card">
                    <h3>🥧 Estado de Turnos</h3>
                    <div class="grafico-placeholder">
                        <div style="text-align: center;">
                            <div style="font-size: 3em; margin-bottom: 10px;">📋</div>
                            <div>Gráfico Circular - Distribución</div>
                            <small style="color: #888;">Completados: ${this.stats.turnos.completados} | Pendientes: ${this.stats.turnos.pendientes}</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tablas de Estadísticas -->
            <div class="tablas-container">
                <div class="tabla-card">
                    <h3>👥 Rendimiento por Técnico</h3>
                    ${this.generarTablaTecnicos()}
                </div>
                
                <div class="tabla-card">
                    <h3>📅 Resumen del Mes</h3>
                    ${this.generarTablaResumen()}
                </div>
            </div>

            <!-- Cards de Resumen -->
            <div class="resumen-cards">
                <div class="resumen-card rendimiento">
                    <div class="resumen-icono">⚡</div>
                    <div class="resumen-valor">${this.stats.eficiencia.tasaCompletacionTurnos}%</div>
                    <div class="resumen-label">Tasa de Completación</div>
                </div>
                
                <div class="resumen-card tickets">
                    <div class="resumen-icono">🎫</div>
                    <div class="resumen-valor">${this.stats.tickets.tasaResolucion}%</div>
                    <div class="resumen-label">Tickets Resueltos</div>
                </div>
                
                <div class="resumen-card satisfaccion">
                    <div class="resumen-icono">⭐</div>
                    <div class="resumen-valor">${this.stats.eficiencia.satisfaccionClientes}/5</div>
                    <div class="resumen-label">Satisfacción Clientes</div>
                </div>
            </div>
        `;

        console.log('✅ Estadísticas mostradas correctamente');
    }

    generarTablaTecnicos() {
        const tecnicos = Object.keys(this.stats.porTecnico);
        
        if (tecnicos.length === 0) {
            return '<p style="text-align: center; color: #666; padding: 40px;">No hay datos de técnicos</p>';
        }

        let html = `
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>Técnico</th>
                        <th>Turnos</th>
                        <th>Tickets</th>
                        <th>Eficiencia</th>
                    </tr>
                </thead>
                <tbody>
        `;

        tecnicos.forEach(tecnico => {
            const stats = this.stats.porTecnico[tecnico];
            html += `
                <tr>
                    <td><strong>${tecnico.split(' ')[0]}</strong></td>
                    <td class="numero">${stats.turnos.completados}/${stats.turnos.total}</td>
                    <td class="numero">${stats.tickets.cerrados}/${stats.tickets.total}</td>
                    <td class="porcentaje ${this.obtenerClaseEficiencia(stats.eficiencia.tasaCompletacion)}">
                        ${stats.eficiencia.tasaCompletacion}%
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        return html;
    }

    generarTablaResumen() {
        return `
            <table class="stats-table">
                <tbody>
                    <tr>
                        <td><strong>Período:</strong></td>
                        <td>${this.stats.periodo.mes} ${this.stats.periodo.año}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Turnos:</strong></td>
                        <td class="numero">${this.stats.turnos.total}</td>
                    </tr>
                    <tr>
                        <td><strong>Turnos Completados:</strong></td>
                        <td class="numero positivo">${this.stats.turnos.completados}</td>
                    </tr>
                    <tr>
                        <td><strong>Turnos Pendientes:</strong></td>
                        <td class="numero neutral">${this.stats.turnos.pendientes}</td>
                    </tr>
                    <tr>
                        <td><strong>Tickets Totales:</strong></td>
                        <td class="numero">${this.stats.tickets.total}</td>
                    </tr>
                    <tr>
                        <td><strong>Tickets Abiertos:</strong></td>
                        <td class="numero neutral">${this.stats.tickets.abiertos}</td>
                    </tr>
                    <tr>
                        <td><strong>Tiempo Promedio:</strong></td>
                        <td class="numero">${this.stats.eficiencia.tiempoPromedioResolucion}</td>
                    </tr>
                    <tr>
                        <td><strong>Crecimiento Turnos:</strong></td>
                        <td class="numero ${this.stats.tendencias.crecimientoTurnos >= 0 ? 'positivo' : 'negativo'}">
                            ${this.stats.tendencias.crecimientoTurnos >= 0 ? '+' : ''}${this.stats.tendencias.crecimientoTurnos}%
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    obtenerClaseEficiencia(porcentaje) {
        if (porcentaje >= 80) return 'positivo';
        if (porcentaje >= 60) return 'neutral';
        return 'negativo';
    }

    // Exportar reporte
    exportarReporte() {
        if (!this.stats) {
            alert('Primero debe generar las estadísticas');
            return;
        }

        const datos = {
            titulo: `Reporte de Estadísticas - ${this.stats.periodo.mes} ${this.stats.periodo.año}`,
            fecha: new Date().toLocaleString('es-ES'),
            estadisticas: this.stats
        };

        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-estadisticas-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        alert('✅ Reporte exportado correctamente');
    }
}

// Instancia global
const estadisticasUI = new EstadisticasUI();

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Página de estadísticas cargada');
    
    if (document.getElementById('estadisticasContainer')) {
        estadisticasUI.cargarEstadisticas();
    }
});