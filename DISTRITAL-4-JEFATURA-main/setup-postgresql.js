// Script de ayuda para configurar PostgreSQL
// Ejecutar con: node setup-postgresql.js

require('dotenv').config();
const { Sequelize } = require('sequelize');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupPostgreSQL() {
  console.log('🔧 Configuración de PostgreSQL\n');
  console.log('Este script te ayudará a verificar la conexión y crear la base de datos.\n');

  // Obtener credenciales
  const dbHost = await question('Host de PostgreSQL (Enter para localhost): ') || 'localhost';
  const dbPort = await question('Puerto de PostgreSQL (Enter para 5432): ') || '5432';
  const dbUser = await question('Usuario de PostgreSQL (Enter para postgres): ') || 'postgres';
  const dbPassword = await question('Contraseña de PostgreSQL: ');
  
  if (!dbPassword) {
    console.log('\n❌ Error: Se requiere una contraseña');
    rl.close();
    process.exit(1);
  }

  const dbName = await question('Nombre de la base de datos (Enter para distrital4_jefatura): ') || 'distrital4_jefatura';

  console.log('\n🔍 Verificando conexión a PostgreSQL...\n');

  // Intentar conectar a PostgreSQL (sin especificar base de datos)
  const postgresDB = new Sequelize('postgres', dbUser, dbPassword, {
    host: dbHost,
    port: parseInt(dbPort),
    dialect: 'postgres',
    logging: false
  });

  try {
    await postgresDB.authenticate();
    console.log('✅ Conexión a PostgreSQL exitosa!\n');

    // Crear la base de datos si no existe
    console.log(`📋 Verificando si la base de datos "${dbName}" existe...`);
    
    const [results] = await postgresDB.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );

    if (results.length === 0) {
      console.log(`\n📝 Creando base de datos "${dbName}"...`);
      await postgresDB.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Base de datos "${dbName}" creada exitosamente!\n`);
    } else {
      console.log(`✅ La base de datos "${dbName}" ya existe.\n`);
    }

    // Verificar conexión a la base de datos específica
    await postgresDB.close();
    const targetDB = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: parseInt(dbPort),
      dialect: 'postgres',
      logging: false
    });

    await targetDB.authenticate();
    console.log(`✅ Conexión a la base de datos "${dbName}" exitosa!\n`);

    // Generar contenido para .env
    console.log('📝 Configuración para agregar a tu archivo .env:\n');
    console.log('='.repeat(50));
    console.log(`DB_HOST=${dbHost}`);
    console.log(`DB_PORT=${dbPort}`);
    console.log(`DB_NAME=${dbName}`);
    console.log(`DB_USER=${dbUser}`);
    console.log(`DB_PASSWORD=${dbPassword}`);
    console.log(`DB_SSL=false`);
    console.log('='.repeat(50));
    console.log('\n💡 Crea un archivo .env en la raíz del proyecto con estas variables.\n');

    await targetDB.close();
    console.log('✅ ¡Configuración completada!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPosibles causas:');
    console.error('  1. PostgreSQL no está instalado o no está corriendo');
    console.error('  2. La contraseña es incorrecta');
    console.error('  3. El usuario no existe o no tiene permisos');
    console.error('\n💡 Soluciones:');
    console.error('  - Verifica que PostgreSQL esté instalado y corriendo');
    console.error('  - Verifica la contraseña del usuario postgres');
    console.error('  - En Windows, verifica el servicio PostgreSQL en "Servicios"');
    console.error('  - Si olvidaste la contraseña, puedes resetearla en pg_hba.conf\n');
  } finally {
    rl.close();
  }
}

setupPostgreSQL();

