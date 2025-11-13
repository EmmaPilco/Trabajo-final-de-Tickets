// notificaciones-simple.js - SISTEMA 100% FUNCIONAL
class NotificacionesSimple {
    constructor() {
        console.log('🔔 Iniciando sistema simple de notificaciones');
    }

    // Crear notificación de nuevo turno (MUY SIMPLE)
    crearNotificacionTurno(turno) {
        console.log('🎯 Creando notificación para:', turno);
        
        const notificacion = {
            id: Date.now(),
            tipo: 'nuevo_turno',
            titulo: '📅 Nuevo Turno',
            mensaje: `${turno.cliente_nombre} - ${turno.fecha} ${turno.horario}`,
            tecnico: turno.tecnico,
            leida: false,
            fecha: new Date().toLocaleString('es-ES')
        };

        // Guardar en localStorage de forma DIRECTA
        this.guardarNotificacion(notificacion);
        
        return notificacion;
    }

    // Guardar notificación (DIRECTO)
    guardarNotificacion(notificacion) {
        try {
            // Obtener notificaciones existentes
            const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
            
            // Agregar nueva notificación al INICIO
            notificaciones.unshift(notificacion);
            
            // Guardar de vuelta
            localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
            
            console.log('✅ Notificación guardada:', notificacion);
            console.log('📊 Total notificaciones:', notificaciones.length);
            
        } catch (error) {
            console.error('❌ Error guardando notificación:', error);
        }
    }

    // Obtener notificaciones de un técnico (DIRECTO)
    obtenerNotificacionesTecnico(tecnico) {
        try {
            const todas = JSON.parse(localStorage.getItem('notificaciones') || '[]');
            const delTecnico = todas.filter(n => n.tecnico === tecnico);
            
            console.log(`📨 Notificaciones para ${tecnico}:`, delTecnico.length);
            return delTecnico;
            
        } catch (error) {
            console.error('❌ Error obteniendo notificaciones:', error);
            return [];
        }
    }

    // Contar no leídas (DIRECTO)
    contarNoLeidas(tecnico) {
        const notificaciones = this.obtenerNotificacionesTecnico(tecnico);
        const noLeidas = notificaciones.filter(n => !n.leida).length;
        
        console.log(`🔴 ${noLeidas} no leídas para ${tecnico}`);
        return noLeidas;
    }

    // Marcar como leída (DIRECTO)
    marcarLeida(id) {
        try {
            const todas = JSON.parse(localStorage.getItem('notificaciones') || '[]');
            const actualizadas = todas.map(n => 
                n.id === id ? { ...n, leida: true } : n
            );
            
            localStorage.setItem('notificaciones', JSON.stringify(actualizadas));
            console.log('✅ Notificación marcada como leída:', id);
            
        } catch (error) {
            console.error('❌ Error marcando como leída:', error);
        }
    }
}

// Crear instancia global INMEDIATA
const notificacionesSimple = new NotificacionesSimple();
console.log('✅ Sistema simple de notificaciones LISTO');