// Inicializaci�n de Modo Oscuro
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
  document.body.classList.add('dark-theme');
}
// Carga /content/site.json y arma toda la página con ese contenido.
// La clienta edita ese JSON (texto e imágenes) desde /admin sin tocar código.

function waLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function robustText(value, fallback) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || fallback;
}

async function loadSite() {
  const res = await fetch('/content/site.json', { cache: 'no-store' });
  const d = await res.json();

  // Meta
  const siteTitle = robustText(d.meta?.title, `${robustText(d.header?.name, 'Florencia Moreira')} | ${robustText(d.header?.role, 'Psicóloga')} | Psicoterapia en Uruguay`);
  document.title = siteTitle;
  document.getElementById('meta-description').setAttribute('content', robustText(d.meta?.description, 'Psicoterapia en Uruguay para adolescentes y adultos. Atención psicológica online y presencial.'));

  // Header
  document.getElementById('brand-logo').src = d.header.logo;
  document.getElementById('brand-name').textContent = d.header.name;
  document.getElementById('brand-role').textContent = d.header.role;

  // Hero
  document.getElementById('hero-eyebrow').textContent = d.hero.eyebrow;
  document.getElementById('hero-title1').textContent = d.hero.title_line1;
  document.getElementById('hero-title2').textContent = d.hero.title_line2;
  document.getElementById('hero-subtitle').textContent = d.hero.subtitle;
  const c1 = document.getElementById('hero-cta1');
  c1.textContent = d.hero.cta_primary_text; c1.href = d.hero.cta_primary_link;
  const c2 = document.getElementById('hero-cta2');
  c2.textContent = d.hero.cta_secondary_text; c2.href = d.hero.cta_secondary_link;
  // Modalidades
  document.getElementById('mod-eyebrow').textContent = d.modalities.eyebrow;
  document.getElementById('mod-title').textContent = d.modalities.title;
  const modGrid = document.getElementById('mod-grid');
  modGrid.innerHTML = d.modalities.items.map(item => `
    <div class="modality-card reveal-up">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink(d.contact.whatsapp_number, item.whatsapp_message)}">${item.cta_text}</a>
    </div>`).join('');

  // Sobre mi
  document.getElementById('about-eyebrow').textContent = d.about.eyebrow;
  document.getElementById('about-title').textContent = d.about.title;
  document.getElementById('about-image').src = d.about.image;
  document.getElementById('about-bullets').innerHTML = d.about.bullets.map(b => `<li>${b}</li>`).join('');
  document.getElementById('about-areas-label').textContent = d.about.areas_label;
  document.getElementById('about-areas').innerHTML = d.about.areas.map(a => `<span class="chip">${a}</span>`).join('');

  // Especialidades
  document.getElementById('spec-eyebrow').textContent = d.specialties.eyebrow;
  document.getElementById('spec-title').textContent = d.specialties.title;
  document.getElementById('spec-grid').innerHTML = d.specialties.items.map(s => `
    <div class="specialty-card reveal-up"><h3>${s.title}</h3><p>${s.description}</p></div>`).join('');
  document.getElementById('article-list').innerHTML = d.articles.map(a => `
    <div><h4>${a.title}</h4><p>${a.text}</p></div>`).join('');

  // Contacto
  document.getElementById('contact-eyebrow').textContent = d.contact.eyebrow;
  document.getElementById('contact-title').textContent = d.contact.title;
  document.getElementById('contact-subtitle').textContent = d.contact.subtitle;
  document.getElementById('contact-lines').innerHTML = `
    <a class="contact-line" href="mailto:${d.contact.email}">✉️ ${d.contact.email}</a>
    <a class="contact-line" href="tel:${d.contact.phone_link}">📞 ${d.contact.phone_display}</a>`;
  document.getElementById('social-row').innerHTML = `
    <a href="${d.contact.instagram}" target="_blank" rel="noopener" title="Instagram">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    </a>
    <a href="${d.contact.linkedin}" target="_blank" rel="noopener" title="LinkedIn">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
    </a>
    <a href="${waLink(d.contact.whatsapp_number, d.contact.whatsapp_message)}" target="_blank" rel="noopener" title="WhatsApp">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.126.551 4.137 1.523 5.908L0 24l6.233-1.488C7.962 23.447 9.927 24 12.031 24 18.677 24 24 18.677 24 12.031S18.677 0 12.031 0zm0 21.996c-1.85 0-3.618-.475-5.185-1.332l-.371-.202-3.856.921 1.026-3.771-.223-.355A9.972 9.972 0 0 1 2.033 12.03c0-5.508 4.484-9.992 9.998-9.992 5.513 0 9.997 4.484 9.997 9.992 0 5.509-4.484 9.996-9.997 9.996zm5.485-7.513c-.301-.151-1.782-.879-2.059-.979-.276-.1-.477-.151-.678.151-.201.301-.778.979-.953 1.18-.176.201-.352.226-.653.075-.301-.151-1.272-.469-2.423-1.498-.895-.8-1.501-1.788-1.677-2.089-.176-.301-.019-.464.132-.614.135-.136.301-.352.452-.528.151-.176.201-.301.301-.502.101-.201.05-.377-.025-.528-.075-.151-.678-1.633-.928-2.235-.243-.588-.49-.508-.678-.518-.175-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.51 0 1.48 1.079 2.912 1.23 3.113.151.201 2.122 3.238 5.139 4.538.718.31 1.278.495 1.716.634.721.229 1.378.197 1.896.119.584-.088 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.352z"/></svg>
    </a>`;

  document.getElementById('form-title').textContent = d.contact.form_title;
  document.getElementById('label-name').textContent = d.contact.form_name_label + ' *';
  document.getElementById('label-email').textContent = d.contact.form_email_label;
  document.getElementById('label-message').textContent = d.contact.form_message_label + ' *';
  document.getElementById('form-submit').textContent = d.contact.form_submit_text;

  // WhatsApp flotante
  document.getElementById('waFloat').href = waLink(d.contact.whatsapp_number, d.contact.whatsapp_message);

  // Footer
  document.getElementById('footer-name').textContent = d.footer.name;
  document.getElementById('footer-text').textContent = `© ${new Date().getFullYear()} · ${d.footer.text}`;
  const fe = document.getElementById('footer-email');
  fe.textContent = d.footer.email; fe.href = `mailto:${d.footer.email}`;
}

loadSite().then(initScrollReveal).catch(err => console.error('Error cargando contenido del sitio:', err));

// Menú mobile
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
);

const adminLink = document.querySelector('.admin-link');
if (adminLink) {
  adminLink.addEventListener('click', event => {
    const proceed = window.confirm('¿Estás segura de que deseas ir a la página de administración? Solo usuarios autorizados pueden acceder.');
    if (!proceed) event.preventDefault();
  });
}

// Envío del formulario de contacto vía Netlify Forms (AJAX, sin recargar la página)
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('formStatus');
  const data = new FormData(form);

  fetch('/', { method: 'POST', body: new URLSearchParams(data).toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .then(() => {
      status.textContent = 'Mensaje enviado. ¡Gracias! Te responderemos a la brevedad.';
      status.className = 'form-status ok';
      form.reset();
    })
    .catch(() => {
      status.textContent = 'Hubo un problema al enviar. Probá de nuevo o escribí por WhatsApp.';
      status.className = 'form-status err';
    });
});


// Funcionalidad de Toggle de Tema
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}


// ============================================
// SCROLL REVEAL ANIMATIONS

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }
}