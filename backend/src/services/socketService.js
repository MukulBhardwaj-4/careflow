import { Server } from 'socket.io';

let io = null;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_patient_room', (patientId) => {
      socket.join(`patient_${patientId}`);
      console.log(`Socket ${socket.id} joined patient room ${patientId}`);
    });

    socket.on('join_nurse_room', (nurseId) => {
      socket.join(`nurse_${nurseId}`);
      console.log(`Socket ${socket.id} joined nurse room ${nurseId}`);
    });

    socket.on('join_doctor_room', (doctorId) => {
      socket.join(`doctor_${doctorId}`);
      console.log(`Socket ${socket.id} joined doctor room ${doctorId}`);
    });

    socket.on('join_admin_room', () => {
      socket.join('admin_room');
      console.log(`Socket ${socket.id} joined admin room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

const emitToPatient = (patientId, event, data) => {
  try {
    const socket = getIO();
    socket.to(`patient_${patientId}`).emit(event, data);
  } catch (error) {
    console.error('Socket Emit Error:', error);
  }
};

const emitToNurse = (nurseId, event, data) => {
  try {
    const socket = getIO();
    socket.to(`nurse_${nurseId}`).emit(event, data);
  } catch (error) {
    console.error('Socket Emit Error:', error);
  }
};

const emitToDoctor = (doctorId, event, data) => {
  try {
    const socket = getIO();
    socket.to(`doctor_${doctorId}`).emit(event, data);
  } catch (error) {
    console.error('Socket Emit Error:', error);
  }
};

const emitToAdmin = (event, data) => {
  try {
    const socket = getIO();
    socket.to('admin_room').emit(event, data);
  } catch (error) {
    console.error('Socket Emit Error:', error);
  }
};

const emitToAll = (event, data) => {
  try {
    const socket = getIO();
    socket.emit(event, data);
  } catch (error) {
    console.error('Socket Emit Error:', error);
  }
};

export {
  initializeSocket,
  getIO,
  emitToPatient,
  emitToNurse,
  emitToDoctor,
  emitToAdmin,
  emitToAll,
};