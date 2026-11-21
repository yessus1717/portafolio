/* ==========================================================
   Projects · CONTENIDO EDITABLE
   Aquí añades, quitas o cambias tus proyectos. No hace falta tocar
   projects.js ni projects.css.

   CAMPOS DE CADA PROYECTO (solo id y title son obligatorios):
     id            identificador único, sin espacios (ej. 'mi-proyecto')
     title         nombre del proyecto
     category      una de: 'Cybersecurity', 'Pentesting', 'Networking',
                   'Programming', 'Automation', 'Other Projects'
     description   descripción general (también se ve en la tarjeta)
     image         ruta de la captura, ej. 'assets/projects/mi-proyecto.png'
                   (si falta o no carga, se muestra un icono)
     tools         lista de herramientas       ['Nmap', 'Wireshark']
     technologies  lista de tecnologías        ['Python', 'Bash']
     objectives    problema u objetivo (texto, o lista de textos)
     process       proceso de desarrollo (texto, o lista de textos)
     results       resultados o aprendizajes (texto, o lista de textos)
     githubUrl     enlace al repositorio (https://...)
     demoUrl       enlace a la demostración (https://...)
     demo          true → muestra la etiqueta "Demo Project" (solo ejemplos)

   Los campos que no tengas puedes omitirlos: esa sección simplemente
   no aparece. Los enlaces ausentes se muestran como "no disponible".
   Iconos de categoría: shield, target, network, code, cog, layers.
   ========================================================== */
window.Portfolio = window.Portfolio || {};
window.Portfolio.content = window.Portfolio.content || {};

window.Portfolio.content.projects = {
  title: 'Projects',
  description: 'Proyectos de tecnología y ciberseguridad. Selecciona uno para ver sus detalles.',

  categories: [
    { id: 'Cybersecurity',  icon: 'shield'  },
    { id: 'Pentesting',     icon: 'target'  },
    { id: 'Networking',     icon: 'network' },
    { id: 'Programming',    icon: 'code'    },
    { id: 'Automation',     icon: 'cog'     },
    { id: 'Other Projects', icon: 'layers'  }
  ],

  items: [
    {
      id: 'recoplus',
      title: 'RECOplus',
      category: 'Programming',
      description: 'Sitio web del proyecto RECOplus, publicado en GitHub Pages. El repositorio incluye las páginas de inicio, donar, donaciones, alianzas, guía y contacto.',
      image: 'assets/projects/recoplus.png',
      tools: ['GitHub', 'GitHub Pages', 'Supabase', 'OpenStreetMap', 'Botpress', 'Google AI Studio', 'Google Auth'],
      technologies: ['HTML', 'CSS', 'JavaScript'],
      githubUrl: 'https://github.com/RECOplus/RECOplus',
      demoUrl: 'https://recoplus.github.io/RECOplus/'
    },
    {
      id: 'linuxpath',
      title: 'LinuxPath',
      category: 'Programming',
      description: 'Página web para aprender Linux de manera fácil y con gamificación.',
      image: '',
      objectives: 'Facilitar el aprendizaje de Linux mediante una experiencia con gamificación.',
      tools: ['GitHub', 'Supabase', 'Google Auth'],
      technologies: ['HTML', 'CSS', 'JavaScript'],
      githubUrl: 'https://github.com/yessus1717/projecto-de-linux'
    }
  ]
};
