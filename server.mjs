import './src/config/dbConfig.js'; // 👈 Primero la conexión a DB
import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.js';

import { connectDB } from './src/config/dbConfig.js';

connectDB();

// Carga modelos DESPUÉS de la conexión
import './src/models/User.js'; 
import './src/models/Role.js';
import './src/models/Permission.js';
import './src/models/Category.js';
import './src/models/Item.js';

const app = express();
const PORT = process.env.PORT || 3000;


const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', //Quien puede acceder al sistema (acá permitimos todo)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 horas en segundos
};

app.use(cors(corsOptions));
app.use(express.json());


// Rutas
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

//Endpoint de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando' });
});


// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.log('Error no manejado:', err);
    process.exit(1);
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`🌍 Accede en: http://localhost:${PORT}`);
});



export default app;