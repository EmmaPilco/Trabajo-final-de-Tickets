document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ticketForm');
    const listaTickets = document.getElementById('listaTickets');
    const clearBtn = document.getElementById('clearTickets');
  
    let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  
    const renderTickets = () => {
      listaTickets.innerHTML = '';
      tickets.forEach(ticket => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${ticket.asunto}</strong> por <em>${ticket.nombre}</em><br/>
          <div class="ticket-meta">${ticket.email} | ${ticket.fecha}</div>
          <div class="ticket-status ${ticket.estado === 'Cerrado' ? 'cerrado' : ''}">${ticket.estado}</div>
          <p>${ticket.mensaje}</p>
          <button class="toggle-status" data-id="${ticket.id}">Marcar como ${ticket.estado === 'Abierto' ? 'Cerrado' : 'Abierto'}</button>
        `;
        listaTickets.prepend(li);
      });
    };
  
    const guardarTickets = () => {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    };
  
    form.addEventListener('submit', e => {
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
        fecha: new Date().toLocaleString()
      };
  
      tickets.push(ticket);
      guardarTickets();
      renderTickets();
      form.reset();
    });
  
    listaTickets.addEventListener('click', e => {
      if (e.target.classList.contains('toggle-status')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        tickets = tickets.map(ticket => {
          if (ticket.id === id) {
            ticket.estado = ticket.estado === 'Abierto' ? 'Cerrado' : 'Abierto';
          }
          return ticket;
        });
        guardarTickets();
        renderTickets();
      }
    });
  
    clearBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de eliminar todos los tickets?')) {
        tickets = [];
        guardarTickets();
        renderTickets();
      }
    });
  
    // Render inicial
    renderTickets();
  });
  