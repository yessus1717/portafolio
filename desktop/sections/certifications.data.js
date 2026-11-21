/* ==========================================================
   Certifications · CONTENIDO EDITABLE
   Aquí añades, editas o eliminas tus credenciales. No hace falta
   tocar certifications.js ni certifications.css.

   CAMPOS DE CADA CREDENCIAL (solo id y name son obligatorios):
     id               identificador único, sin espacios
     name             nombre de la certificación, curso o programa
     issuer           institución o plataforma emisora
     category         una de: 'Cybersecurity', 'Ethical Hacking', 'Networking',
                      'Linux', 'Programming', 'General Technology'
     status           'obtained' | 'in-progress' | 'planned'
                      (si lo omites no se muestra ningún estado; nunca se
                      asume que algo está obtenido)
     issueDate        fecha de obtención: '2026-03-15', '2026-03' o '2026'
     expirationDate   fecha de vencimiento (mismo formato), si corresponde
     credentialId     código de la credencial, si existe
     verificationUrl  enlace de verificación (https://...). Si no lo pones,
                      no aparece ningún botón.
     description      descripción breve
     file             ruta del certificado en PDF, ej.
                      'certificados/mi-curso.pdf'. Se muestra incrustado en el
                      detalle de la credencial, con un enlace para abrirlo.
     image            ruta de tu propia imagen o insignia, ej.
                      'assets/certifications/mi-curso.png'. Si falta, se
                      muestra un icono genérico (no una insignia oficial).
     demo             true → muestra la etiqueta "Demo" (solo para ejemplos)

   Para eliminar una credencial, borra su bloque. Para crear una
   categoría, añade { id: '...', icon: '...' } en "categories".
   Iconos de categoría: award, shield, lock, network, penguin, code, layers.
   ========================================================== */
window.Portfolio = window.Portfolio || {};
window.Portfolio.content = window.Portfolio.content || {};

window.Portfolio.content.certifications = {
  title: 'Certifications',
  description: 'Certificados, cursos y programas de formación. Selecciona una credencial para ver sus detalles.',

  categories: [
    { id: 'Cybersecurity',      icon: 'shield'  },
    { id: 'Ethical Hacking',    icon: 'lock'    },
    { id: 'Networking',         icon: 'network' },
    { id: 'Linux',              icon: 'penguin' },
    { id: 'Programming',        icon: 'code'    },
    { id: 'General Technology', icon: 'layers'  }
  ],

  items: [
    {
      id: 'linux-essentials',
      name: 'Linux Essentials',
      issuer: 'Cisco Networking Academy (NetAcad)',
      category: 'Linux',
      status: 'obtained',
      file: 'certificados/Linux_Essentials_certificate.pdf'
    },
    {
      id: 'linux-unhatched',
      name: 'Linux Unhatched',
      issuer: 'Cisco Networking Academy (NetAcad)',
      category: 'Linux',
      status: 'obtained',
      file: 'certificados/Linux_Unhatched_certificate.pdf'
    },
    {
      id: 'networking-basics',
      name: 'Networking Basics',
      issuer: 'Cisco Networking Academy (NetAcad)',
      category: 'Networking',
      status: 'obtained',
      file: 'certificados/Networking_Basics_certificate.pdf'
    },
    {
      id: 'ethical-hacker',
      name: 'Ethical Hacker',
      issuer: 'Cisco Networking Academy (NetAcad)',
      category: 'Ethical Hacking',
      status: 'in-progress',
      description: 'Curso Ethical Hacker de NetAcad, actualmente en curso.'
    },
    {
      id: 'superate-david',
      name: 'Programa Supérate David',
      issuer: 'Fundación Emanuel Gonzales Revilla Jurado',
      category: 'General Technology',
      status: 'in-progress',
      description: 'Estudiante del programa Supérate David de la Fundación Emanuel Gonzales Revilla Jurado.'
    }
  ]
};
