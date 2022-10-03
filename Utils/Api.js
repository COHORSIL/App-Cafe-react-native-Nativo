export function apikey() {
  let key = "hsdujnn28328hhfj";

  return key;
}

export function apikey2() {
  let key = "ojkasdyunnhjhjdhjf";

  return key;
}

export function ruta() {
  let ruta = "http://201.190.6.19/rest";

  return ruta;
}

export function soporte() {
  let url = `${ruta()}/soporte.php?apikey=${apikey()}`;
  return url;
}

export function User() {
  let url = `${ruta()}/login.php?apikey=${apikey()}`;
  return url;
}

export function sesion() {
  let url = `${ruta()}/sesion.php?apikey=${apikey()}`;
  return url;
}

export function Reporte() {
  let url = `${ruta()}/invernadero/reporteGeneral.php?apikey=${apikey2()}`;
  return url;
}

export function Categoria() {
  let url = `${ruta()}/invernadero/categorias.php?apikey=${apikey2()}`;
  return url;
}

export function Proceso() {
  let url = `${ruta()}/invernadero/Proceso.php?apikey=${apikey2()}`;
  return url;
}

export function Plantula() {
  let url = `${ruta()}/invernadero/Plantula.php?apikey=${apikey2()}`;
  return url;
}

export function Variedad() {
  let url = `${ruta()}/invernadero/variedad.php?apikey=${apikey2()}`;
  return url;
}