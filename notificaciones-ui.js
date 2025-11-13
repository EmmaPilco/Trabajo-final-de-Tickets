// notificaciones-ui-design.js - CON DISEÑO MEJORADO
console.log('🎨 Cargando interfaz con diseño mejorado...');

// Inicializar inmediatamente
function inicializarNotificacionesUI() {
    console.log('🚀 Inicializando notificaciones UI con diseño...');
    
    // Actualizar cada 3 segundos
    setInterval(actualizarUI, 3000);
    
    // Actualizar ahora
    setTimeout(actualizarUI, 1000);
    
    console.log('✅ UI de notificaciones con diseño inicializada');
}

// Actualizar toda la UI
function actualizarUI() {
    const tecnico = localStorage.getItem('techNombreReal');
    if (!tecnico) {
        console.log('⚠️ No hay técnico logueado');
        return;
    }
    
    actualizarBadge(tecnico);
    actualizarLista(tecnico);
}

// Actualizar solo el badge
function actualizarBadge(tecnico) {
    const badge = document.getElementById('badgeNotificaciones');
    if (!badge) {
        console.log('⚠️ No se encontró el badge');
        return;
    }
    
    try {
        const noLeidas = notificacionesSimple.contarNoLeidas(tecnico);
        
        if (noLeidas > 0) {
            badge.textContent = noLeidas;
            badge.style.display = 'flex';
            console.log(`🟢 Badge actualizado: ${noLeidas}`);
        } else {
            badge.style.display = 'none';
            console.log('🟡 No hay notificaciones no leídas');
        }
    } catch (error) {
        console.error('❌ Error actualizando badge:', error);
    }
}

// Actualizar la lista con diseño mejorado
function actualizarLista(tecnico) {
    const lista = document.getElementById('listaNotificaciones');
    if (!lista) return;
    
    try {
        const notificaciones = notificacionesSimple.obtenerNotificacionesTecnico(tecnico);
        
        if (notificaciones.length === 0) {
            lista.innerHTML = `
                <div class="sin-notificaciones">
                    <div class="icono">📭</div>
                    <h4>No hay notificaciones</h4>
                    <p>Te notificaremos cuando tengas nuevos turnos</p>
                    <small>Los turnos agendados aparecerán aquí automáticamente</small>
                </div>
            `;
            return;
        }
        
        lista.innerHTML = notificaciones.map(notif => `
            <div class="notificacion-item ${notif.leida ? 'leida' : 'no-leida'}" 
                 onclick="marcarLeidaYActualizar(${notif.id})">
                <div class="notificacion-header">
                    <div class="notificacion-titulo">${notif.titulo}</div>
                    <div class="notificacion-fecha">${formatearFechaBonita(notif.fecha)}</div>
                </div>
                <div class="notificacion-mensaje">${notif.mensaje}</div>
                <div class="notificacion-acciones">
                    <button class="btn-accion btn-marcar-leida" onclick="event.stopPropagation(); marcarLeidaYActualizar(${notif.id})">
                        ✅ Leída
                    </button>
                    <button class="btn-accion btn-eliminar-notificacion" onclick="event.stopPropagation(); eliminarNotificacion(${notif.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('❌ Error actualizando lista:', error);
    }
}

// Función para marcar como leída
function marcarLeidaYActualizar(id) {
    notificacionesSimple.marcarLeida(id);
    actualizarUI();
    mostrarToast('Notificación marcada como leída', 'success');
}

// Función para eliminar notificación
function eliminarNotificacion(id) {
    if (confirm('¿Eliminar esta notificación?')) {
        // Para eliminar, necesitamos agregar esta función al sistema simple
        eliminarNotificacionSimple(id);
        actualizarUI();
        mostrarToast('Notificación eliminada', 'success');
    }
}

// Agregar función de eliminar al sistema simple
function eliminarNotificacionSimple(id) {
    try {
        const todas = JSON.parse(localStorage.getItem('notificaciones') || '[]');
        const filtradas = todas.filter(n => n.id !== id);
        localStorage.setItem('notificaciones', JSON.stringify(filtradas));
        console.log('🗑️ Notificación eliminada:', id);
    } catch (error) {
        console.error('❌ Error eliminando notificación:', error);
    }
}

// Marcar todas como leídas
function marcarTodasLeidas() {
    const tecnico = localStorage.getItem('techNombreReal');
    if (!tecnico) return;
    
    try {
        const todas = JSON.parse(localStorage.getItem('notificaciones') || '[]');
        const actualizadas = todas.map(n => 
            n.tecnico === tecnico ? { ...n, leida: true } : n
        );
        localStorage.setItem('notificaciones', JSON.stringify(actualizadas));
        
        actualizarUI();
        mostrarToast('Todas las notificaciones marcadas como leídas', 'success');
    } catch (error) {
        console.error('❌ Error marcando todas como leídas:', error);
    }
}

// Formatear fecha de manera más bonita
function formatearFechaBonita(fechaStr) {
    try {
        const fecha = new Date(fechaStr);
        const ahora = new Date();
        const diffMs = ahora - fecha;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffMins < 1) return 'Ahora mismo';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours} h`;
        if (diffHours < 48) return 'Ayer';
        
        return fecha.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Reciente';
    }
}

// Toggle del panel
function togglePanelNotificaciones() {
    const panel = document.getElementById('panelNotificaciones');
    if (!panel) return;
    
    panel.classList.toggle('activo');
    
    if (panel.classList.contains('activo')) {
        const tecnico = localStorage.getItem('techNombreReal');
        if (tecnico) actualizarLista(tecnico);
    }
}

// Mostrar toast bonito
function mostrarToast(mensaje, tipo = 'success') {
    // Eliminar toast existente
    const toastExistente = document.querySelector('.toast-notificacion');
    if (toastExistente) {
        toastExistente.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast-notificacion ${tipo}`;
    toast.innerHTML = `
        ${tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : '⚠️'}
        ${mensaje}
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Página cargada, verificando técnico...');
    
    if (localStorage.getItem('techLoggedIn') === 'true') {
        console.log('🔑 Técnico autenticado, iniciando UI con diseño...');
        inicializarNotificacionesUI();
    }
});

// Cerrar panel al hacer clic fuera
document.addEventListener('click', function(event) {
    const panel = document.getElementById('panelNotificaciones');
    const btn = document.querySelector('.btn-notificaciones');
    
    if (panel && panel.classList.contains('activo') && 
        !panel.contains(event.target) && 
        !btn.contains(event.target)) {
        panel.classList.remove('activo');
    }
});

console.log('✅ UI con diseño mejorado cargada');