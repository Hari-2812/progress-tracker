import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const port = process.env.PORT || 5000;
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) { console.error('MONGODB_URI and JWT_SECRET are required'); process.exit(1); }
connectDB().then(() => app.listen(port, () => console.log(`Focus90 API listening on port ${port}`))).catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
