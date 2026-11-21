/* ==========================================================
   Skills · CONTENIDO EDITABLE
   Aquí añades, quitas o cambias tus habilidades. No hace falta
   tocar skills.js ni skills.css.

   ESTRUCTURA
   - categories: cada una es un panel. Campos:
       id            identificador único (solo si otra categoría la referencia)
       title         nombre del panel
       icon          icono del panel
       description   texto breve bajo el título
       items         lista de habilidades o herramientas
       related       (opcional) ids de items de OTRAS categorías que se
                     muestran como etiquetas bajo "Herramientas relacionadas"
       relatedTitle  (opcional) cambia ese título
   - items: cada elemento. Campos:
       id            (opcional) solo si lo referencias desde "related"
       name          nombre de la tecnología o habilidad
       icon          icono representativo
       description   descripción breve (qué es, no cuánto la dominas)
       level         (opcional) texto manual, ej. 'Básico'. Si no lo pones,
                     no se muestra nada. Aquí NO hay porcentajes ni barras.

   ICONOS DISPONIBLES
   lock, target, bug, eye, shield, activity, packet, radar, file, wifi,
   wifilock, plug, terminal, penguin, cog, code, tags, palette, braces,
   script, globe, table, window, blocks, wrench, layers, flag
   ========================================================== */
window.Portfolio = window.Portfolio || {};
window.Portfolio.content = window.Portfolio.content || {};

window.Portfolio.content.skills = {
  title: 'Skills',
  intro: 'Conocimientos, herramientas y tecnologías de mi entorno de aprendizaje en ciberseguridad y desarrollo.',
  note: 'Esta sección muestra lo que estudio y utilizo. No representa niveles de dominio ni experiencia profesional.',

  interests: {
    title: 'Areas of Interest',
    icon: 'flag',
    note: 'Áreas en las que me interesa desarrollarme profesionalmente.',
    items: ['Red Team', 'Blue Team', 'SOC Analysis', 'Pentesting', 'Network Security']
  },

  categories: [
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      icon: 'shield',
      description: 'Áreas de la ciberseguridad que forman parte de mi aprendizaje.',
      items: [
        { name: 'Ethical Hacking', icon: 'lock', description: 'Pruebas de seguridad realizadas de forma autorizada y responsable para encontrar debilidades.' },
        { name: 'Pentesting', icon: 'target', description: 'Evaluación controlada de sistemas, redes y aplicaciones para identificar vulnerabilidades.' },
        { name: 'Vulnerability Assessment', icon: 'bug', description: 'Identificación y priorización de vulnerabilidades en sistemas y servicios.' },
        { name: 'Security Analysis', icon: 'eye', description: 'Revisión de eventos y configuraciones para detectar riesgos y amenazas.' }
      ]
    },
    {
      id: 'networking',
      title: 'Networking',
      icon: 'network',
      description: 'Seguridad y análisis de redes.',
      related: ['wireshark', 'nmap', 'tcpdump', 'netcat'],
      items: [
        { name: 'Network Security', icon: 'shield', description: 'Protección de las redes y de la información que circula por ellas.' },
        { name: 'Network Traffic Analysis', icon: 'activity', description: 'Observación del tráfico para entender su comportamiento y detectar anomalías.' },
        { name: 'Packet Capture', icon: 'packet', description: 'Captura de paquetes para inspeccionar la comunicación entre equipos.' },
        { name: 'Network Scanning', icon: 'radar', description: 'Descubrimiento de equipos, puertos y servicios activos en una red.' },
        { name: 'Protocol Analysis', icon: 'file', description: 'Estudio del funcionamiento de los protocolos de red a partir de su tráfico.' },
        { name: 'Sniffers', icon: 'wifi', description: 'Herramientas que capturan y muestran el tráfico que pasa por una red.' }
      ]
    },
    {
      id: 'os',
      title: 'Operating Systems',
      icon: 'terminal',
      description: 'Sistemas operativos con los que trabajo y aprendo.',
      items: [
        { name: 'Linux', icon: 'penguin', description: 'Sistema operativo de código abierto, muy usado en servidores y en ciberseguridad.' },
        { name: 'Kali Linux', icon: 'terminal', description: 'Distribución de Linux orientada a pruebas de seguridad y pentesting.' },
        { name: 'Linux Administration', icon: 'cog', description: 'Uso y administración de entornos Linux desde la terminal.' }
      ]
    },
    {
      id: 'programming',
      title: 'Programming & Development',
      icon: 'code',
      description: 'Lenguajes y tecnologías de desarrollo.',
      items: [
        { name: 'Python', icon: 'script', description: 'Lenguaje de programación versátil, muy usado en automatización y seguridad.' },
        { name: 'HTML', icon: 'tags', description: 'Lenguaje de marcado para estructurar el contenido de las páginas web.' },
        { name: 'CSS', icon: 'palette', description: 'Lenguaje de estilos para dar diseño y formato a las páginas web.' },
        { name: 'JavaScript', icon: 'braces', description: 'Lenguaje de programación para añadir interactividad a las páginas web.' }
      ]
    },
    {
      id: 'tools',
      title: 'Security Tools',
      icon: 'wrench',
      description: 'Herramientas de ciberseguridad que utilizo o estoy aprendiendo.',
      items: [
        { id: 'burp', name: 'Burp Suite', icon: 'globe', description: 'Plataforma para probar la seguridad de aplicaciones web.' },
        { id: 'nmap', name: 'Nmap', icon: 'radar', description: 'Escáner de redes para descubrir equipos, puertos y servicios.' },
        { id: 'wireshark', name: 'Wireshark', icon: 'activity', description: 'Analizador de protocolos para capturar e inspeccionar tráfico de red.' },
        { id: 'tcpdump', name: 'TCPdump', icon: 'packet', description: 'Herramienta de línea de comandos para capturar paquetes de red.' },
        { id: 'netcat', name: 'Netcat', icon: 'plug', description: 'Utilidad para leer y escribir datos a través de conexiones de red.' },
        { id: 'airmon', name: 'Airmon-ng', icon: 'wifi', description: 'Herramienta de la suite Aircrack-ng para activar el modo monitor en tarjetas Wi-Fi.' },
        { id: 'aircrack', name: 'Aircrack-ng', icon: 'wifilock', description: 'Suite de herramientas para evaluar la seguridad de redes Wi-Fi.' }
      ]
    },
    {
      id: 'productivity',
      title: 'Productivity & Other Technologies',
      icon: 'layers',
      description: 'Herramientas de productividad y desarrollo de aplicaciones.',
      items: [
        { name: 'Microsoft Excel', icon: 'table', description: 'Hoja de cálculo para organizar, calcular y analizar datos.' },
        { name: 'Visual Studio', icon: 'window', description: 'Entorno de desarrollo integrado de Microsoft.' },
        { name: 'Power Apps', icon: 'blocks', description: 'Plataforma de Microsoft para crear aplicaciones con poco código.' }
      ]
    }
  ]
};
