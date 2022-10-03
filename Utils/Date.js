export default function Date(texto) {
  var cadena = texto.substr(0, 10);
  var day = cadena.substr(-2, 2);
  var month = cadena.substr(-5, 2);
  var year = texto.substr(0, 4);

  var fecha = day + "-" + month + "-" + year;
  return fecha;
}
