// Sistema de gestión de turnos
let turnos = [];
let horarioSeleccionado = null;

// Horarios disponibles (8:00 a 18:00)
const HORARIOS_DISPONIBLES = [
    '08:00', '09:00', '10:00', '11:00', 
    '12:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00'
];

// Inicializar fecha mínima (hoy)
document.addEventListener('DOMContentLoaded', function() {
    const fechaInput = document.getElementById('fecha_turno');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;
    
    cargarTurnos();
});

function cargarTurnos() {
    const storedTurnos = localStorage.getItem('turnos');
    if (storedTurnos) {
        turnos = JSON.parse(storedTurnos);
    }
}

function guardarTurnos() {
    localStorage.setItem('turnos', JSON.stringify(turnos));
}

function cargarDisponibilidad() {
    // Resetear selección al cambiar técnico
    horarioSeleccionado = null;
    document.getElementById('fecha_turno').value = '';
    document.getElementById('horarios-container').style.display = 'none';
    document.getElementById('submitTurno').disabled = true;
}

function cargarHorariosDisponibles() {
    const tecnico = document.getElementById('tecnico').value;
    const fecha = document.getElementById('fecha_turno').value;
    
    if (!tecnico || !fecha) {
        return;
    }
    
    // Validar que sea día laboral (lunes a viernes)
    const fechaObj = new Date(fecha);
    const diaSemana = fechaObj.getDay(); // 0: domingo, 6: sábado
    
    if (diaSemana === 0 || diaSemana === 6) {
        alert('⚠️ Los turnos solo están disponibles de lunes a viernes.');
        document.getElementById('fecha_turno').value = '';
        document.getElementById('horarios-container').style.display = 'none';
        return;
    }
    
    const horariosContainer = document.getElementById('horarios-container');
    const horariosGrid = document.getElementById('horarios-grid');
    
    // Obtener horarios ocupados para este técnico en esta fecha
    const horariosOcupados = turnos
        .filter(turno => 
            turno.tecnico === tecnico && 
            turno.fecha === fecha &&
            turno.estado !== 'cancelado'
        )
        .map(turno => turno.horario);
    
    // Generar botones de horarios
    horariosGrid.innerHTML = '';
    
    HORARIOS_DISPONIBLES.forEach(horario => {
        const estaOcupado = horariosOcupados.includes(horario);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `horario-btn ${estaOcupado ? 'ocupado' : ''}`;
        button.textContent = horario;
        button.disabled = estaOcupado;
        
        if (!estaOcupado) {
            button.addEventListener('click', () => seleccionarHorario(horario, button));
        }
        
        horariosGrid.appendChild(button);
    });
    
    horariosContainer.style.display = 'block';
}

function seleccionarHorario(horario, button) {
    // Remover selección anterior
    document.querySelectorAll('.horario-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Seleccionar nuevo horario
    button.classList.add('selected');
    horarioSeleccionado = horario;
    
    // Habilitar botón de confirmación
    document.getElementById('submitTurno').disabled = false;
}

// Manejar envío del formulario
document.getElementById('turnoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('cliente_nombre').value.trim();
    const email = document.getElementById('cliente_email').value.trim();
    const tecnico = document.getElementById('tecnico').value;
    const fecha = document.getElementById('fecha_turno').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    
    if (!nombre || !email || !tecnico || !fecha || !horarioSeleccionado || !descripcion) {
        alert('Por favor, completa todos los campos y selecciona un horario.');
        return;
    }
    
    // Crear nuevo turno
    const nuevoTurno = {
        id: Date.now(),
        cliente_nombre: nombre,
        cliente_email: email,
        tecnico: tecnico,
        fecha: fecha,
        horario: horarioSeleccionado,
        descripcion: descripcion,
        estado: 'confirmado',
        fecha_creacion: new Date().toLocaleString('es-ES')
    };
    
    turnos.push(nuevoTurno);
    guardarTurnos();
    
    // Mostrar confirmación
    mostrarConfirmacion(nuevoTurno);
    
    // Limpiar formulario
    this.reset();
    document.getElementById('horarios-container').style.display = 'none';
    document.getElementById('submitTurno').disabled = true;
    horarioSeleccionado = null;
});

function mostrarConfirmacion(turno) {
    const confirmacionHTML = `
        <div class="confirmacion-turno">
            <h4>✅ Turno Confirmado</h4>
            <p><strong>Número de turno:</strong> #${turno.id}</p>
            <p><strong>Técnico:</strong> ${turno.tecnico}</p>
            <p><strong>Fecha:</strong> ${turno.fecha}</p>
            <p><strong>Horario:</strong> ${turno.horario}</p>
            <p>Recibirás un recordatorio por email. Guarda este número para cualquier consulta.</p>
        </div>
    `;
    
    // Insertar después del formulario
    const form = document.getElementById('turnoForm');
    form.insertAdjacentHTML('afterend', confirmacionHTML);
    
    // Auto-remover después de 10 segundos
    setTimeout(() => {
        const confirmacion = document.querySelector('.confirmacion-turno');
        if (confirmacion) {
            confirmacion.remove();
        }
    }, 10000);
}

// Función para que los técnicos vean sus turnos (se integrará con el dashboard)
function obtenerTurnosPorTecnico(emailTecnico) {
    return turnos.filter(turno => {
        const emailTecnicoFormateado = turno.tecnico.toLowerCase().replace(' ', '.') + '@soporte.com';
        return emailTecnicoFormateado === emailTecnico && turno.estado === 'confirmado';
    });
}