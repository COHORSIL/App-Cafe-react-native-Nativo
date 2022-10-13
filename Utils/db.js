import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
enablePromise(true);

const databaseName = 'cafe';

//Conexion a la base
export async function getDBConnection() {
  const db = await openDatabase({name: databaseName, location: 'default'});
  return db;
}

//-------------------------------------------------CLIENTES-----------------------------------------------

//Crear Tablas Cliente
export async function createTable(db) {
  const query = `CREATE TABLE IF NOT EXISTS Clientes(id INTEGER PRIMARY KEY AUTOINCREMENT, Codigo NVARCHAR(13) ,Nombre NVARCHAR(150), Identidad NVARCHAR(13), direccion NVARCHAR(300), telefono NVARCHAR(8), ubicacionFinca NVARCHAR(300), genero NVARCHAR(8), estado NVARCHAR(8) ) ;`;
  await db.executeSql(query);
}

//Insertar en tabla Cliente
export async function insertTask(db, item) {
  const insertQuery =
    'INSERT INTO Clientes (Codigo, Nombre, Identidad, direccion, telefono, ubicacionFinca, genero, estado)  values (?,?,?,?,?,?,?,?)';
  await db.executeSql(insertQuery, [
    item.Codigo,
    item.Nombre,
    item.Identidad,
    item.Direccion,
    item.Telefono,
    item.Ubicacion_Finca,
    item.Genero,
    0,
  ]);
}

//Obtener Datos Tabla Cliente
export async function getTask(db) {
  try {
    const task = [];
    const results = await db.executeSql(`SELECT * FROM Clientes`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        task.push(result.rows.item(index));
      }
    });
    return task;
  } catch (error) {
    console.error(error);
    throw Error('Error al obtener los datos !!!');
  }
}

//-------------------------------------------------MARCAS-----------------------------------------------

//Crear Tablas Marcas
export async function createTableMarcas(db) {
  const query = `CREATE TABLE IF NOT EXISTS Marcas(id INTEGER PRIMARY KEY AUTOINCREMENT, label NVARCHAR(50) ,value NVARCHAR(50)) ;`;
  await db.executeSql(query);
}

//Insertar en tabla Marcas
export async function insertTablaMarcas(db, item) {
  const insertQuery = 'INSERT INTO Marcas(label, value)  values (?, ?)';
  await db.executeSql(insertQuery, [item.label, item.label]);
}

//Obtener Datos Tabla Marcas
export async function getTablaMarcas(db) {
  try {
    const task = [];
    const results = await db.executeSql(`SELECT * FROM Marcas`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        task.push(result.rows.item(index));
      }
    });
    return task;
  } catch (error) {
    console.error(error);
    throw Error('Error al obtener los datos de la tabla marcas!!!');
  }
}

//-------------------------------------------------Notas-----------------------------------------------

//Crear Tablas Notas
export async function createTableNotas(db) {
  const query = `CREATE TABLE IF NOT EXISTS Notas(id INTEGER PRIMARY KEY AUTOINCREMENT, Cliente NVARCHAR(800) ,Beneficio NVARCHAR(50), Marca NVARCHAR(50), Pesos NVARCHAR(800), Tipo NVARCHAR(50), SumaLibras NVARCHAR(50), Muestras NVARCHAR(50), SumaSacos NVARCHAR(50), PrecioFijado NVARCHAR(50), Altura NVARCHAR(50), Descuentos NVARCHAR(800), FechaCreacion NVARCHAR(50), Estado NVARCHAR(50),  Observacion NVARCHAR(200));`;
  await db.executeSql(query);
}

//Insertar en tabla Notas
export async function insertTablaNotas(db, item) {
  console.log(item);
  const insertQuery =
    'INSERT INTO Notas(Cliente, Beneficio, Marca, Pesos, Tipo, SumaLibras, Muestras, SumaSacos, PrecioFijado, Altura, Descuentos, FechaCreacion, Estado, Observacion)  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
  await db.executeSql(insertQuery, [
    item.cliente,
    item.Beneficio,
    item.Marca,
    item.Pesos,
    item.Tipo,
    item.SumaLibras,
    item.Muestras,
    item.SumaSacos,
    item.PrecioFijado,
    item.Altura,
    item.EstadoCafe,
    item.FechaCreacion,
    item.Estado,
    item.Observacion
  ]);
}

//Iniciar base de Datos
export async function initDatabase() {
  const db = await getDBConnection();
  createTable(db);
  createTableMarcas(db);
  createTableNotas(db);
  db.close;
}
