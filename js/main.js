// Carga /content/site.json y arma toda la página con ese contenido.
// La clienta edita ese JSON (texto e imágenes) desde /admin sin tocar código.

function waLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

async function loadSite() {
  const res = await fetch('/content/site.json', { cache: 'no-store' });
  const d = await res.json();

  // Meta
  document.title = d.meta.title;
  document.getElementById('meta-description').setAttribute('content', d.meta.description);

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
  document.getElementById('hero-image').src = d.hero.image;
  document.getElementById('hero-caption').textContent = d.hero.image_caption;

  // Modalidades
  document.getElementById('mod-eyebrow').textContent = d.modalities.eyebrow;
  document.getElementById('mod-title').textContent = d.modalities.title;
  const modGrid = document.getElementById('mod-grid');
  modGrid.innerHTML = d.modalities.items.map(item => `
    <div class="modality-card">
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
    <div class="specialty-card"><h3>${s.title}</h3><p>${s.description}</p></div>`).join('');
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
    <a href="${d.contact.instagram}" target="_blank" rel="noopener" title="Instagram">IG</a>
    <a href="${d.contact.linkedin}" target="_blank" rel="noopener" title="LinkedIn">in</a>
    <a href="${waLink(d.contact.whatsapp_number, d.contact.whatsapp_message)}" target="_blank" rel="noopener" title="WhatsApp">WA</a>`;

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

loadSite().catch(err => console.error('Error cargando contenido del sitio:', err));

// Menú mobile
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
);

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
