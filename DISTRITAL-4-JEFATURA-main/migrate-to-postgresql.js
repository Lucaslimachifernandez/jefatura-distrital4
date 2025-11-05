// Script de migración de SQLite a PostgreSQL
// Ejecutar con: node migrate-to-postgresql.js

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const logger = require('./utils/logger');

// Configuración de SQLite (origen)
const sqliteDB = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Configuración de PostgreSQL (destino)
const postgresDB = new Sequelize(
  process.env.DB_NAME || 'distrital4_jefatura',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

// Definir modelos para SQLite (origen)
const UserSQLite = sqliteDB.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  lastName: DataTypes.STRING,
  phone: DataTypes.STRING,
  hierarchy: DataTypes.STRING,
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  timestamps: false,
});

const NovedadSQLite = sqliteDB.define('Novedad', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fechaDelHecho: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  horaDelHecho: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  altura: DataTypes.STRING,
  entreCalles: DataTypes.STRING,
  barrio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordenadas: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  encuadreLegal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  victima: DataTypes.STRING,
  edadVictima: DataTypes.STRING,
  generoVictima: DataTypes.STRING,
  observaciones: DataTypes.TEXT,
  sumario: DataTypes.STRING,
  expediente: DataTypes.STRING,
  dependencia: DataTypes.STRING,
  detallesNovedad: DataTypes.TEXT,
  lugar: DataTypes.STRING,
  bienAfectado: DataTypes.STRING,
  nombreImputado: DataTypes.STRING,
  esclarecidos: DataTypes.STRING,
  fechaCreacion: DataTypes.STRING,
  horaCarga: DataTypes.STRING,
}, {
  timestamps: false,
});

// Definir modelos para PostgreSQL (destino)
const UserPostgres = postgresDB.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  lastName: DataTypes.STRING,
  phone: DataTypes.STRING,
  hierarchy: DataTypes.STRING,
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  timestamps: false,
});

const NovedadPostgres = postgresDB.define('Novedad', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fechaDelHecho: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  horaDelHecho: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  altura: DataTypes.STRING,
  entreCalles: DataTypes.STRING,
  barrio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordenadas: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  encuadreLegal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  victima: DataTypes.STRING,
  edadVictima: DataTypes.STRING,
  generoVictima: DataTypes.STRING,
  observaciones: DataTypes.TEXT,
  sumario: DataTypes.STRING,
  expediente: DataTypes.STRING,
  dependencia: DataTypes.STRING,
  detallesNovedad: DataTypes.TEXT,
  lugar: DataTypes.STRING,
  bienAfectado: DataTypes.STRING,
  nombreImputado: DataTypes.STRING,
  esclarecidos: DataTypes.STRING,
  fechaCreacion: DataTypes.STRING,
  horaCarga: DataTypes.STRING,
}, {
  timestamps: false,
});

async function migrate() {
  try {
    console.log('🔍 Iniciando proceso de migración de SQLite a PostgreSQL...\n');

    // Verificar que existe el archivo SQLite
    if (!fs.existsSync('./database.sqlite')) {
      console.log('❌ Error: No se encontró el archivo database.sqlite');
      console.log('   El archivo debe estar en la raíz del proyecto.');
      process.exit(1);
    }

    // Conectar a SQLite
    console.log('📂 Conectando a SQLite...');
    await sqliteDB.authenticate();
    console.log('✅ Conexión a SQLite establecida\n');

    // Conectar a PostgreSQL
    console.log('🐘 Conectando a PostgreSQL...');
    await postgresDB.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida\n');

    // Sincronizar modelos en PostgreSQL (crear tablas si no existen)
    console.log('📋 Sincronizando esquema en PostgreSQL...');
    await postgresDB.sync({ alter: false });
    console.log('✅ Esquema sincronizado\n');

    // Migrar Usuarios
    console.log('👥 Migrando usuarios...');
    const usersSQLite = await UserSQLite.findAll();
    console.log(`   Encontrados ${usersSQLite.length} usuarios en SQLite`);

    let usersMigrated = 0;
    let usersSkipped = 0;

    for (const user of usersSQLite) {
      try {
        // Verificar si el usuario ya existe
        const existingUser = await UserPostgres.findOne({
          where: { username: user.username }
        });

        if (existingUser) {
          console.log(`   ⚠️  Usuario "${user.username}" ya existe, omitiendo...`);
          usersSkipped++;
          continue;
        }

        // Crear usuario en PostgreSQL
        await UserPostgres.create({
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          phone: user.phone,
          hierarchy: user.hierarchy,
          username: user.username,
          password: user.password, // Mantener el hash de contraseña
          role: user.role,
        });

        usersMigrated++;
        console.log(`   ✅ Usuario "${user.username}" migrado`);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(`   ⚠️  Usuario "${user.username}" ya existe (duplicado), omitiendo...`);
          usersSkipped++;
        } else {
          console.log(`   ❌ Error al migrar usuario "${user.username}": ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Migración de usuarios completada: ${usersMigrated} migrados, ${usersSkipped} omitidos\n`);

    // Migrar Novedades
    console.log('📝 Migrando novedades...');
    const novedadesSQLite = await NovedadSQLite.findAll();
    console.log(`   Encontradas ${novedadesSQLite.length} novedades en SQLite`);

    let novedadesMigrated = 0;
    let novedadesSkipped = 0;

    for (const novedad of novedadesSQLite) {
      try {
        // Verificar si la novedad ya existe
        const existingNovedad = await NovedadPostgres.findByPk(novedad.id);

        if (existingNovedad) {
          console.log(`   ⚠️  Novedad "${novedad.id}" ya existe, omitiendo...`);
          novedadesSkipped++;
          continue;
        }

        // Crear novedad en PostgreSQL
        await NovedadPostgres.create({
          id: novedad.id,
          fechaDelHecho: novedad.fechaDelHecho,
          horaDelHecho: novedad.horaDelHecho,
          calle: novedad.calle,
          altura: novedad.altura,
          entreCalles: novedad.entreCalles,
          barrio: novedad.barrio,
          coordenadas: novedad.coordenadas,
          encuadreLegal: novedad.encuadreLegal,
          victima: novedad.victima,
          edadVictima: novedad.edadVictima,
          generoVictima: novedad.generoVictima,
          observaciones: novedad.observaciones,
          sumario: novedad.sumario,
          expediente: novedad.expediente,
          dependencia: novedad.dependencia,
          detallesNovedad: novedad.detallesNovedad,
          lugar: novedad.lugar,
          bienAfectado: novedad.bienAfectado,
          nombreImputado: novedad.nombreImputado,
          esclarecidos: novedad.esclarecidos,
          fechaCreacion: novedad.fechaCreacion,
          horaCarga: novedad.horaCarga,
        });

        novedadesMigrated++;
        if (novedadesMigrated % 10 === 0) {
          console.log(`   ✅ ${novedadesMigrated} novedades migradas...`);
        }
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(`   ⚠️  Novedad "${novedad.id}" ya existe (duplicado), omitiendo...`);
          novedadesSkipped++;
        } else {
          console.log(`   ❌ Error al migrar novedad "${novedad.id}": ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Migración de novedades completada: ${novedadesMigrated} migradas, ${novedadesSkipped} omitidas\n`);

    // Resumen final
    console.log('='.repeat(50));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(50));
    console.log(`👥 Usuarios: ${usersMigrated} migrados, ${usersSkipped} omitidos`);
    console.log(`📝 Novedades: ${novedadesMigrated} migradas, ${novedadesSkipped} omitidas`);
    console.log('='.repeat(50));
    console.log('\n✅ ¡Migración completada exitosamente!');
    console.log('   Ahora puedes usar PostgreSQL como base de datos.\n');

  } catch (error) {
    console.error('\n❌ Error durante la migración:', error.message);
    console.error('\nDetalles del error:');
    console.error(error);
    process.exit(1);
  } finally {
    // Cerrar conexiones
    await sqliteDB.close();
    await postgresDB.close();
    console.log('🔌 Conexiones cerradas.');
  }
}

// Ejecutar migración
migrate();

