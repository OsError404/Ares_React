import mongoose from 'mongoose';
import { faker } from '@faker-js/faker/locale/es';
import Location from '../server/models/Location.js';
import Room from '../server/models/Room.js';
import Company from '../server/models/Company.js';
import HearingRequest from '../server/models/HearingRequest.js';
import User from '../server/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hearing-management';

// Configuración de cantidades
const NUM_LOCATIONS = 5;
const NUM_ROOMS_PER_LOCATION = 3;
const NUM_COMPANIES = 10;
const NUM_INSURANCE_COMPANIES = 5;
const NUM_HEARING_REQUESTS = 20;

async function clearCollections() {
  await Location.deleteMany({});
  await Room.deleteMany({});
  await Company.deleteMany({});
  await HearingRequest.deleteMany({});
  console.log('Colecciones limpiadas');
}

async function createLocations() {
  const locations = [];
  for (let i = 0; i < NUM_LOCATIONS; i++) {
    const location = await Location.create({
      name: `Sede ${faker.location.city()}`,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      department: faker.location.state(),
      active: true,
    });
    locations.push(location);
  }
  console.log(`${locations.length} sedes creadas`);
  return locations;
}

async function createRooms(locations) {
  const rooms = [];
  for (const location of locations) {
    for (let i = 0; i < NUM_ROOMS_PER_LOCATION; i++) {
      const room = await Room.create({
        name: `Sala ${i + 1}`,
        capacity: faker.number.int({ min: 5, max: 20 }),
        location: location._id,
        status: faker.helpers.arrayElement(['disponible', 'ocupada', 'mantenimiento']),
        features: faker.helpers.arrayElements(
          ['videoconferencia', 'proyector', 'wifi', 'grabacion'],
          faker.number.int({ min: 1, max: 4 })
        ),
        active: true,
      });
      rooms.push(room);
    }
  }
  console.log(`${rooms.length} salas creadas`);
  return rooms;
}

async function createCompanies() {
  const companies = [];
  
  // Crear aseguradoras
  for (let i = 0; i < NUM_INSURANCE_COMPANIES; i++) {
    const company = await Company.create({
      name: faker.company.name(),
      nit: faker.number.int({ min: 800000000, max: 900000000 }).toString() + '-' + faker.number.int({ min: 0, max: 9 }),
      address: faker.location.streetAddress(),
      phone: faker.phone.number('+57 ### ### ####'),
      email: faker.internet.email(),
      type: 'aseguradora',
      active: true,
    });
    companies.push(company);
  }

  // Crear empresas regulares
  for (let i = 0; i < NUM_COMPANIES; i++) {
    const company = await Company.create({
      name: faker.company.name(),
      nit: faker.number.int({ min: 800000000, max: 900000000 }).toString() + '-' + faker.number.int({ min: 0, max: 9 }),
      address: faker.location.streetAddress(),
      phone: faker.phone.number('+57 ### ### ####'),
      email: faker.internet.email(),
      type: 'empresa',
      active: true,
    });
    companies.push(company);
  }
  
  console.log(`${companies.length} empresas creadas`);
  return companies;
}

async function createHearingRequests(rooms) {
  const hearingRequests = [];
  const users = await User.find({});
  
  if (users.length === 0) {
    console.log('No hay usuarios en la base de datos. Cree algunos usuarios primero.');
    return [];
  }

  for (let i = 0; i < NUM_HEARING_REQUESTS; i++) {
    const startDate = faker.date.future();
    const participants = [];
    
    // Agregar participantes
    for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
      participants.push({
        name: faker.person.fullName(),
        documentId: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
        entityType: faker.helpers.arrayElement(['natural', 'juridico']),
        email: faker.internet.email(),
        role: faker.helpers.arrayElement(['convocado', 'convocador', 'conciliador']),
      });
    }

    const hearingRequest = await HearingRequest.create({
      caseNumber: `CASO-${faker.number.int({ min: 1000, max: 9999 })}-${new Date().getFullYear()}`,
      type: faker.helpers.arrayElement(['Transito', 'Otros']),
      hearingDateTime: startDate,
      claimAmount: faker.number.int({ min: 1000000, max: 100000000 }),
      claimDetails: {
        damages: faker.number.int({ min: 500000, max: 50000000 }),
        deductible: faker.number.int({ min: 100000, max: 1000000 }),
        subrogation: faker.number.int({ min: 100000, max: 5000000 }),
      },
      vehicleCount: faker.number.int({ min: 1, max: 4 }),
      address: faker.location.streetAddress(),
      department: faker.location.state(),
      city: faker.location.city(),
      description: faker.lorem.paragraphs(2),
      additionalDetails: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(['pendiente', 'aprobada', 'rechazada', 'cancelada']),
      requestedBy: users[faker.number.int({ min: 0, max: users.length - 1 })]._id,
      assignedRoom: rooms[faker.number.int({ min: 0, max: rooms.length - 1 })]._id,
      participants,
    });
    
    hearingRequests.push(hearingRequest);
  }
  
  console.log(`${hearingRequests.length} solicitudes de audiencia creadas`);
  return hearingRequests;
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB');

    await clearCollections();
    
    const locations = await createLocations();
    const rooms = await createRooms(locations);
    const companies = await createCompanies();
    const hearingRequests = await createHearingRequests(rooms);

    console.log('Datos de ejemplo creados exitosamente');
  } catch (error) {
    console.error('Error al crear datos de ejemplo:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

seed();