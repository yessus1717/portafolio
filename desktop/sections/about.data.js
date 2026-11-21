/* ==========================================================
   About Me · CONTENIDO EDITABLE
   Aquí cambias tu información. No hace falta tocar about.js.
   Iconos disponibles: user, pin, target, lock, terminal, network,
   eye, shield, code, layers, flag, globe.
   ========================================================== */
window.Portfolio = window.Portfolio || {};
window.Portfolio.content = window.Portfolio.content || {};

window.Portfolio.content.about = {
  profile: {
    name: 'Jesus Batista',
    title: 'Estudiante de Tecnología',
    location: 'Chiriquí, Panamá',
    // Tu fotografía: pon aquí la ruta de la imagen (por ejemplo 'assets/foto.jpg').
    // Mientras esté vacío se muestra un espacio reservado.
    photo: ''
  },

  story: {
    title: 'Sobre mí',
    icon: 'user',
    paragraphs: [
      'Desde pequeño me ha atraído el mundo de la tecnología, sobre todo entender cómo funcionan las cosas y cómo se crean. Me llama la atención descubrir fallas, comprender por qué ocurren y encontrar la mejor manera de solucionarlas.',
      'Esa curiosidad me llevó a conocer la ciberseguridad, y decidí que ese sería el camino de mi futuro profesional.'
    ]
  },

  interests: {
    title: 'Áreas de interés',
    icon: 'target',
    items: [
      { icon: 'target',   title: 'Pentesting',       text: 'Evaluar sistemas y aplicaciones para encontrar debilidades antes de que lo haga un atacante.' },
      { icon: 'lock',     title: 'Ethical Hacking',  text: 'Aplicar la mentalidad ofensiva de forma responsable y autorizada para mejorar la seguridad.' },
      { icon: 'terminal', title: 'Linux',            text: 'Entender el sistema y la terminal que son la base del trabajo en ciberseguridad.' },
      { icon: 'network',  title: 'Network Security', text: 'Comprender cómo viaja la información por una red y cómo protegerla.' },
      { icon: 'eye',      title: 'Análisis SOC',     text: 'Monitorear, detectar y analizar amenazas e incidentes de seguridad.' }
    ]
  },

  tools: {
    title: 'Herramientas y tecnologías',
    icon: 'layers',
    note: 'Tecnologías y herramientas de mi entorno de aprendizaje e interés.',
    categories: [
      {
        icon: 'shield',
        title: 'Ciberseguridad y análisis de redes',
        items: ['Kali Linux', 'Wireshark', 'Nmap', 'Burp Suite', 'TCPdump', 'Netcat', 'Sniffers', 'Airmon-ng', 'Aircrack-ng']
      },
      {
        icon: 'code',
        title: 'Desarrollo y programación',
        items: ['HTML', 'CSS', 'JavaScript', 'Python']
      },
      {
        icon: 'layers',
        title: 'Productividad y otras tecnologías',
        items: ['Microsoft Excel', 'Visual Studio', 'Power Apps']
      }
    ]
  },

  goals: {
    title: 'Career Goals',
    icon: 'flag',
    paragraphs: [
      'Mi objetivo es trabajar en el área de Red Team, como analista SOC o en Blue Team dentro de una empresa especializada en ciberseguridad.',
      'Quiero desarrollar y aplicar mis habilidades para contribuir a que las personas usen con más seguridad las plataformas y servicios de las empresas. Me interesa formar parte de equipos que identifican vulnerabilidades, detectan amenazas y protegen los sistemas y la información.'
    ]
  },

  languages: {
    title: 'Idiomas',
    icon: 'globe',
    items: [
      { name: 'Español', level: 'Nativo' },
      { name: 'Inglés',  level: 'C1' }
    ]
  }
};
