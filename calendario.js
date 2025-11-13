// calendario.js - Sistema completo de calendario
class CalendarioAvanzado {
    constructor() {
        console.log('📅 Iniciando sistema de calendario');
        this.meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        this.diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        this.fechaActual = new Date();
        this.mesActual = this.fechaActual.getMonth();
        this.añoActual = this.fechaActual.getFullYear();
    }

    // Generar calendario del mes actual
    generarCalendarioMes(tecnico = null) {
        console.log(`📅 Generando calendario para ${this.meses[this.mesActual]} ${this.añoActual}`);
        
        const primerDia = new Date(this.añoActual, this.mesActual, 1);
        const ultimoDia = new Date(this.añoActual, this.mesActual + 1, 0);
        const diasEnMes = ultimoDia.getDate();
        const diaInicioSemana = primerDia.getDay();
        
        const turnos = this.obtenerTurnosMes(tecnico);
        
        let calendarioHTML = `
            <div class="calendario-header">
                <div class="calendario-titulo">
                    <h2>${this.meses[this.mesActual]} ${this.añoActual}</h2>
                    <div class="calendario-subtitulo">Calendario de Turnos</div>
                </div>
                <div class="calendario-controles">
                    <button class="btn-calendario" onclick="calendario.mesAnterior()">
                        ◀ Mes Anterior
                    </button>
                    <button class="btn-calendario btn-hoy" onclick="calendario.irHoy()">
                        📅 Hoy
                    </button>
                    <button class="btn-calendario" onclick="calendario.mesSiguiente()">
                        Mes Siguiente ▶
                    </button>
                </div>
            </div>
            
            <div class="dias-semana">
                ${this.diasSemana.map(dia => `<div class="dia-semana">${dia}</div>`).join('')}
            </div>
            
            <div class="dias-mes">
        `;

        // Días vacíos al inicio
        for (let i = 0; i < diaInicioSemana; i++) {
            calendarioHTML += `<div class="dia vacio"></div>`;
        }

        // Días del mes
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaCompleta = `${this.añoActual}-${(this.mesActual + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
            const turnosDia = this.obtenerTurnosDia(turnos, fechaCompleta);
            
            calendarioHTML += this.generarDiaCalendario(dia, fechaCompleta, turnosDia);
        }

        calendarioHTML += `</div>`;
        return calendarioHTML;
    }

    // Generar HTML para un día específico
    generarDiaCalendario(dia, fechaCompleta, turnosDia) {
        const esHoy = this.esHoy(fechaCompleta);
        const esPasado = this.esPasado(fechaCompleta);
        const esFinSemana = this.esFinSemana(fechaCompleta);
        
        const clasesDia = [
            'dia',
            esHoy ? 'hoy' : '',
            esPasado ? 'pasado' : '',
            esFinSemana ? 'fin-semana' : '',
            turnosDia.length > 0 ? 'con-turnos' : ''
        ].filter(Boolean).join(' ');

        return `
            <div class="${clasesDia}" onclick="calendario.mostrarDetallesDia('${fechaCompleta}')">
                <div class="numero-dia">${dia}</div>
                ${turnosDia.length > 0 ? `
                    <div class="indicador-turnos">
                        <span class="contador-turnos">${turnosDia.length}</span>
                        <div class="tipos-turnos">
                            ${this.generarTiposTurnos(turnosDia)}
                        </div>
                    </div>
                ` : ''}
                ${esHoy ? '<div class="indicador-hoy">Hoy</div>' : ''}
            </div>
        `;
    }

    // Generar indicadores de tipos de turnos
    generarTiposTurnos(turnosDia) {
        const tipos = {};
        turnosDia.forEach(turno => {
            const tipo = turno.estado || 'confirmado';
            tipos[tipo] = (tipos[tipo] || 0) + 1;
        });

        return Object.entries(tipos).map(([tipo, cantidad]) => {
            const clase = `tipo-${tipo}`;
            return `<span class="tipo-turno ${clase}" title="${cantidad} ${tipo}">●</span>`;
        }).join('');
    }

    // Obtener turnos del mes
    obtenerTurnosMes(tecnico = null) {
        try {
            const turnos = JSON.parse(localStorage.getItem('turnos') || '[]');
            
            if (!tecnico) {
                return turnos.filter(turno => {
                    const fechaTurno = new Date(turno.fecha);
                    return fechaTurno.getMonth() === this.mesActual && 
                           fechaTurno.getFullYear() === this.añoActual;
                });
            }
            
            return turnos.filter(turno => {
                const fechaTurno = new Date(turno.fecha);
                return turno.tecnico === tecnico &&
                       fechaTurno.getMonth() === this.mesActual && 
                       fechaTurno.getFullYear() === this.añoActual;
            });
        } catch (error) {
            console.error('❌ Error obteniendo turnos:', error);
            return [];
        }
    }

    // Obtener turnos de un día específico
    obtenerTurnosDia(turnos, fecha) {
        return turnos.filter(turno => turno.fecha === fecha);
    }

    // Verificaciones de fecha
    esHoy(fecha) {
        const hoy = new Date().toISOString().split('T')[0];
        return fecha === hoy;
    }

    esPasado(fecha) {
        const hoy = new Date();
        const fechaDia = new Date(fecha);
        return fechaDia < hoy && !this.esHoy(fecha);
    }

    esFinSemana(fecha) {
        const fechaDia = new Date(fecha);
        const diaSemana = fechaDia.getDay();
        return diaSemana === 0 || diaSemana === 6; // 0: Domingo, 6: Sábado
    }

    // Navegación del calendario
    mesAnterior() {
        this.mesActual--;
        if (this.mesActual < 0) {
            this.mesActual = 11;
            this.añoActual--;
        }
        this.actualizarCalendario();
    }

    mesSiguiente() {
        this.mesActual++;
        if (this.mesActual > 11) {
            this.mesActual = 0;
            this.añoActual++;
        }
        this.actualizarCalendario();
    }

    irHoy() {
        this.fechaActual = new Date();
        this.mesActual = this.fechaActual.getMonth();
        this.añoActual = this.fechaActual.getFullYear();
        this.actualizarCalendario();
    }

    // Actualizar el calendario en la UI
    actualizarCalendario() {
        const container = document.getElementById('calendarioContainer');
        if (container) {
            container.innerHTML = this.generarCalendarioMes();
        }
    }

    // Mostrar detalles de un día
    mostrarDetallesDia(fecha) {
        const turnos = this.obtenerTurnosDia(this.obtenerTurnosMes(), fecha);
        this.mostrarModalDia(fecha, turnos);
    }

    // Mostrar modal con detalles del día
    mostrarModalDia(fecha, turnos) {
        const fechaFormateada = this.formatearFecha(fecha);
        
        const modalHTML = `
            <div class="modal-calendario" id="modalDia">
                <div class="modal-contenido">
                    <div class="modal-header">
                        <h3>📅 Turnos del ${fechaFormateada}</h3>
                        <button class="btn-cerrar" onclick="calendario.cerrarModal()">×</button>
                    </div>
                    
                    <div class="modal-body">
                        ${turnos.length === 0 ? `
                            <div class="sin-turnos">
                                <div class="icono-vacio">📭</div>
                                <p>No hay turnos programados para este día</p>
                                <button class="btn-agendar" onclick="calendario.agendarTurno('${fecha}')">
                                    ➕ Agendar Turno
                                </button>
                            </div>
                        ` : `
                            <div class="lista-turnos-dia">
                                ${turnos.map(turno => this.generarCardTurno(turno)).join('')}
                            </div>
                            <div class="modal-actions">
                                <button class="btn-agendar" onclick="calendario.agendarTurno('${fecha}')">
                                    ➕ Agendar Otro Turno
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Remover modal existente
        this.cerrarModal();
        
        // Agregar nuevo modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Generar card de turno para el modal
    generarCardTurno(turno) {
        return `
            <div class="turno-card ${turno.estado}">
                <div class="turno-header">
                    <div class="turno-hora">🕒 ${turno.horario}</div>
                    <div class="turno-estado ${turno.estado}">
                        ${this.obtenerIconoEstado(turno.estado)} ${turno.estado}
                    </div>
                </div>
                <div class="turno-cliente">
                    <strong>👤 ${turno.cliente_nombre}</strong>
                </div>
                <div class="turno-tecnico">
                    <span class="tecnico-badge">🛠️ ${turno.tecnico}</span>
                </div>
                <div class="turno-descripcion">
                    ${turno.descripcion}
                </div>
                <div class="turno-acciones">
                    <button class="btn-turno contacto" onclick="calendario.contactarCliente('${turno.cliente_email}')">
                        📧 Contactar
                    </button>
                    <button class="btn-turno completar" onclick="calendario.marcarCompletado(${turno.id})">
                        ✅ Completar
                    </button>
                </div>
            </div>
        `;
    }

    // Obtener icono según estado
    obtenerIconoEstado(estado) {
        const iconos = {
            'confirmado': '⏳',
            'completado': '✅',
            'cancelado': '❌'
        };
        return iconos[estado] || '📅';
    }

    // Formatear fecha bonita
    formatearFecha(fecha) {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    }

    // Cerrar modal
    cerrarModal() {
        const modalExistente = document.getElementById('modalDia');
        if (modalExistente) {
            modalExistente.remove();
        }
    }

    // Agendar turno (redirige a la página de turnos)
    agendarTurno(fecha) {
        this.cerrarModal();
        // Guardar la fecha seleccionada para pre-llenar el formulario
        localStorage.setItem('fechaSeleccionada', fecha);
        window.location.href = 'turnos.html';
    }

    // Contactar cliente
    contactarCliente(email) {
        window.location.href = `mailto:${email}?subject=Turno SoporteTech`;
    }

    // Marcar turno como completado
    marcarCompletado(turnoId) {
        if (!confirm('¿Marcar este turno como completado?')) return;
        
        try {
            const turnos = JSON.parse(localStorage.getItem('turnos') || '[]');
            const turnoIndex = turnos.findIndex(t => t.id === turnoId);
            
            if (turnoIndex !== -1) {
                turnos[turnoIndex].estado = 'completado';
                turnos[turnoIndex].fecha_completado = new Date().toLocaleString('es-ES');
                localStorage.setItem('turnos', JSON.stringify(turnos));
                
                this.cerrarModal();
                this.actualizarCalendario();
                alert('✅ Turno marcado como completado');
            }
        } catch (error) {
            console.error('❌ Error marcando turno como completado:', error);
            alert('❌ Error al actualizar el turno');
        }
    }

    // Filtrar por técnico
    filtrarPorTecnico(tecnico) {
        const container = document.getElementById('calendarioContainer');
        if (container) {
            if (tecnico === 'todos') {
                container.innerHTML = this.generarCalendarioMes();
            } else {
                container.innerHTML = this.generarCalendarioMes(tecnico);
            }
        }
    }
}

// Instancia global
const calendario = new CalendarioAvanzado();
console.log('✅ Sistema de calendario listo');