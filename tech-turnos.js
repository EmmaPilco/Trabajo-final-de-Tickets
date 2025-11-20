// Gestión de turnos para técnicos - VERSIÓN CORREGIDA
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    mostrarInfoUsuario();
    cargarTurnosTecnico();
});

function cargarTurnosTecnico() {
    const nombreTecnico = localStorage.getItem('techNombreReal');
    
    console.log('🔍 Buscando turnos para:', nombreTecnico);
    
    // Cargar todos los turnos
    const storedTurnos = localStorage.getItem('turnos');
    const todosTurnos = storedTurnos ? JSON.parse(storedTurnos) : [];
    
    console.log('📊 Total de turnos en sistema:', todosTurnos.length);
    
    // Filtrar turnos del técnico actual
    const turnosTecnico = todosTurnos.filter(turno => {
        return turno.tecnico === nombreTecnico && turno.estado === 'confirmado';
    });
    
    console.log('✅ Turnos encontrados:', turnosTecnico.length);
    
    mostrarTurnos(turnosTecnico);
}

function mostrarTurnos(turnos) {
    const listaTurnos = document.getElementById('listaTurnos');
    
    if (turnos.length === 0) {
        listaTurnos.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <h3>No hay turnos asignados</h3>
                <p>No se encontraron turnos confirmados para ti en este momento.</p>
            </div>
        `;
        return;
    }
    
    // Ordenar turnos por fecha y hora
    turnos.sort((a, b) => {
        const fechaA = new Date(a.fecha + 'T' + a.horario);
        const fechaB = new Date(b.fecha + 'T' + b.horario);
        return fechaA - fechaB;
    });
    
    listaTurnos.innerHTML = '';
    
    turnos.forEach(turno => {
        const fechaTurno = new Date(turno.fecha + 'T' + turno.horario);
        const hoy = new Date();
        const esHoy = turno.fecha === hoy.toISOString().split('T')[0];
        const esProximo = fechaTurno >= hoy;
        
        const turnoElement = document.createElement('div');
        turnoElement.className = 'ticket-item';
        
        turnoElement.innerHTML = `
            <div class="ticket-header">
                <div class="ticket-title">
                    Turno #${turno.id} - ${turno.cliente_nombre}
                    ${esHoy ? '<span style="background: #dc3545; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8em; margin-left: 10px;">HOY</span>' : ''}
                </div>
                <div class="ticket-status ${esProximo ? 'abierto' : 'cerrado'}">
                    ${esProximo ? 'Próximo' : 'Pasado'}
                </div>
            </div>
            <div class="ticket-meta">
                👤 ${turno.cliente_nombre} | 📧 ${turno.cliente_email} | 
                📅 ${turno.fecha} | 🕒 ${turno.horario}
                ${turno.cliente_direccion ? `<br>📍 ${turno.cliente_direccion}` : ''}
            </div>
            <div class="ticket-message">
                <strong>Motivo:</strong> ${turno.descripcion}
            </div>
            <div class="ticket-actions">
                <button class="btn-toggle" onclick="marcarCompletado(${turno.id})">
                    ✅ Completado
                </button>
                <button class="btn-toggle" onclick="contactarCliente('${turno.cliente_email}', '${turno.cliente_nombre}')">
                    📧 Contactar
                </button>
                <button class="btn-toggle" onclick="verDetallesTurno(${turno.id})" style="background: #6c757d; border-color: #6c757d;">
                    📋 Detalles
                </button>
                ${turno.cliente_direccion ? `
                    <button class="btn-toggle" onclick="verEnMapa('${turno.cliente_direccion}')">
                        🗺️ Ver Mapa
                    </button>`:''}
            </div>
        `;
        
        listaTurnos.appendChild(turnoElement);
    });
}
function verEnMapa(direccion) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, '_blank');
}

function marcarCompletado(turnoId) {
    if (!confirm('¿Marcar este turno como completado?')) return;
    
    const storedTurnos = localStorage.getItem('turnos');
    let turnos = storedTurnos ? JSON.parse(storedTurnos) : [];
    
    let turnoActualizado = false;
    
    turnos = turnos.map(turno => {
        if (turno.id === turnoId) {
            turnoActualizado = true;
            return { 
                ...turno, 
                estado: 'completado',
                fecha_completado: new Date().toLocaleString('es-ES')
            };
        }
        return turno;
    });
    
    if (turnoActualizado) {
        localStorage.setItem('turnos', JSON.stringify(turnos));
        alert('✅ Turno marcado como completado');
        cargarTurnosTecnico();
    }
}

function contactarCliente(email, nombre) {
    const asunto = `SoporteTech - Acerca de tu turno`;
    const cuerpo = `Hola ${nombre}, te contacto respecto al turno agendado.`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}

function verDetallesTurno(turnoId) {
    const storedTurnos = localStorage.getItem('turnos');
    const turnos = storedTurnos ? JSON.parse(storedTurnos) : [];
    const turno = turnos.find(t => t.id === turnoId);
    
    if (turno) {
        const detalles = `
📅 DETALLES DEL TURNO
────────────────────
Número: #${turno.id}
Cliente: ${turno.cliente_nombre}
Email: ${turno.cliente_email}
Técnico: ${turno.tecnico}
Fecha: ${turno.fecha}
Horario: ${turno.horario}
Descripción: ${turno.descripcion}
Estado: ${turno.estado}
Creado: ${turno.fecha_creacion}
${turno.fecha_completado ? `Completado: ${turno.fecha_completado}` : ''}
        `;
        alert(detalles);
    }
}

function filtrarTurnos() {
    cargarTurnosTecnico();
}