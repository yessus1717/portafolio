/* ==========================================================
   Contact · CONTENIDO EDITABLE
   Aquí cambias tus datos de contacto. No hace falta tocar
   contact.js ni contact.css.

   CAMPOS DE CADA MÉTODO (en "methods"):
     id        identificador único, sin espacios
     icon      'linkedin' | 'phone'
     label     nombre del método (ej. 'LinkedIn')
     value     texto principal que se muestra en la tarjeta
     action    texto del botón (ej. 'Abrir perfil')
     hint      (opcional) nota pequeña bajo el botón
     url       enlace https:// → se abre en una pestaña nueva
     tel       número en formato internacional sin espacios
               (ej. '+50763991249') → crea un enlace tel:
   Cada método usa "url" o "tel". Solo se muestran los datos que
   escribas aquí: no se agrega nada por defecto.
   ========================================================== */
window.Portfolio = window.Portfolio || {};
window.Portfolio.content = window.Portfolio.content || {};

window.Portfolio.content.contact = {
  title: 'Get in Touch',
  command: '$ contact --list',
  message: '¿Tienes una oportunidad, proyecto o propuesta relacionada con tecnología o ciberseguridad? Me gustaría conectar contigo.',

  methods: [
    {
      id: 'linkedin',
      icon: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/jesús-batista-b21480407',
      action: 'Abrir perfil',
      hint: 'Se abre en una pestaña nueva.',
      url: 'https://www.linkedin.com/in/jesús-batista-b21480407/'
    },
    {
      id: 'phone',
      icon: 'phone',
      label: 'Teléfono',
      value: '+507 63991249',
      action: 'Llamar',
      hint: 'Funciona en dispositivos compatibles con llamadas.',
      tel: '+50763991249'
    }
  ]
};
