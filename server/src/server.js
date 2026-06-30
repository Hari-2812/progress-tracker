import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

function printRoutes(appInstance) {
  if (!appInstance._router) {
    console.log('Routes stack is not initialized on startup.');
    return;
  }
  const routes = [];
  appInstance._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push(`${Object.keys(middleware.route.methods).join(',').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          const pathStr = middleware.regexp.toString()
            .replace('/^\\', '')
            .replace('\\/?(?=\\/|$)/i', '')
            .replace(/\\\//g, '/');
          routes.push(`${Object.keys(route.methods).join(',').toUpperCase()} ${pathStr}${route.path}`);
        }
      });
    }
  });
  console.log('Registered Routes:\n' + routes.join('\n'));
}

const port = process.env.PORT || 5000;
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) { console.error('MONGODB_URI and JWT_SECRET are required'); process.exit(1); }
connectDB().then(() => app.listen(port, () => {
  console.log(`Focus90 API listening on port ${port}`);
  printRoutes(app);
})).catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
