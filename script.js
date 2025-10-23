   // Variables globales
   let tickets = [];

   // Cargar tickets al iniciar
   document.addEventListener('DOMContentLoaded', () => {
     cargarTickets();
     renderTickets();
   });

   // Guardar tickets en memoria
   function guardarTickets() {
     // Almacenamos en memoria durante la sesión
   }

   // Cargar tickets desde memoria
   function cargarTickets() {
     // Los tickets ya están en la variable global
   }

   // Renderizar tickets
   function renderTickets() {
     const ticketsList = document.getElementById('ticketsList');
     const clearBtn = document.getElementById('clearAllBtn');
     
     if (tickets.length === 0) {
       ticketsList.innerHTML = `
         <div class="empty-state">
           <div class="empty-state-icon">📭</div>
           <h3>No hay tickets creados</h3>
           <p>Crea tu primer ticket de soporte para comenzar</p>
         </div>
       `;
       clearBtn.style.display = 'none';
       return;
     }
     
     clearBtn.style.display = 'inline-block';
     ticketsList.innerHTML = '';
     
     // Mostrar tickets más recientes primero
     [...tickets].reverse().forEach(ticket => {
       const li = document.createElement('li');
       li.className = 'ticket-item';
       li.innerHTML = `
         <div class="ticket-header">
           <div class="ticket-title">${ticket.asunto}</div>
           <div class="ticket-status ${ticket.estado.toLowerCase()}">${ticket.estado}</div>
         </div>
         <div class="ticket-meta">
           👤 ${ticket.nombre} | 📧 ${ticket.email} | 📅 ${ticket.fecha}
         </div>
         <div class="ticket-message">${ticket.mensaje}</div>
         <div class="ticket-actions">
           <button class="btn-toggle" onclick="toggleEstado(${ticket.id})">
             Marcar como ${ticket.estado === 'Abierto' ? 'Cerrado' : 'Abierto'}
           </button>
         </div>
       `;
       ticketsList.appendChild(li);
     });
   }

   // Manejar envío del formulario
   document.getElementById('ticketForm').addEventListener('submit', (e) => {
     e.preventDefault();
     
     const nombre = document.getElementById('nombre').value.trim();
     const email = document.getElementById('email').value.trim();
     const asunto = document.getElementById('asunto').value.trim();
     const mensaje = document.getElementById('mensaje').value.trim();
     
     if (!nombre || !email || !asunto || !mensaje) {
       alert('Por favor, completa todos los campos.');
       return;
     }
     
     const ticket = {
       id: Date.now(),
       nombre,
       email,
       asunto,
       mensaje,
       estado: 'Abierto',
       fecha: new Date().toLocaleString('es-ES')
     };
     
     tickets.push(ticket);
     guardarTickets();
     renderTickets();
     
     // Limpiar formulario
     e.target.reset();
     
     // Scroll a la sección de tickets
     document.getElementById('mis-tickets').scrollIntoView({behavior: 'smooth'});
     
     // Mostrar confirmación
     alert('✅ Ticket creado exitosamente');
   });

   // Cambiar estado del ticket
   function toggleEstado(id) {
     tickets = tickets.map(ticket => {
       if (ticket.id === id) {
         ticket.estado = ticket.estado === 'Abierto' ? 'Cerrado' : 'Abierto';
       }
       return ticket;
     });
     guardarTickets();
     renderTickets();
   }

   // Eliminar todos los tickets
   document.getElementById('clearAllBtn').addEventListener('click', () => {
     if (confirm('¿Estás seguro de que deseas eliminar todos los tickets?')) {
       tickets = [];
       guardarTickets();
       renderTickets();
     }
   });