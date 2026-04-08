import pg from 'pg';
import bcrypt from 'bcrypt';
import { env } from './env.js';

const products = [
  ['Laptop Pro 15"', 'High-performance laptop with 16GB RAM', 1299.99, 25, '/images/laptop.png', 'electronics'],
  ['Wireless Mouse', 'Ergonomic wireless mouse with precision tracking', 29.99, 150, '/images/wireless-mouse.png', 'accessories'],
  ['Mechanical Keyboard', 'RGB backlit mechanical keyboard', 89.99, 75, '/images/mechanical-keyboard.png', 'accessories'],
  ['USB-C Hub', '7-in-1 USB-C hub with HDMI and card reader', 49.99, 100, '/images/usb-hub.png', 'accessories'],
  ['Webcam HD', '1080p HD webcam with auto-focus', 79.99, 60, '/images/webcam.png', 'electronics'],
  ['Monitor 27" 4K', 'Ultra HD 4K monitor with HDR support', 449.99, 40, '/images/monitor.png', 'electronics'],
  ['Desk Lamp LED', 'Adjustable LED desk lamp with touch control', 39.99, 120, '/images/desk-lamp.png', 'accessories'],
  ['Headphones Wireless', 'Noise-cancelling wireless headphones', 199.99, 85, '/images/headphones.png', 'electronics'],
  ['External SSD 1TB', 'Portable solid state drive with USB 3.2', 129.99, 95, '/images/external-ssd.png', 'storage'],
  ['Laptop Stand', 'Aluminum laptop stand with cooling', 54.99, 110, '/images/laptop-stand.png', 'accessories'],
  ['Tablet 10"', 'Android tablet with stylus support', 349.99, 65, '/images/tablet.png', 'electronics'],
  ['Wireless Charger', 'Fast wireless charging pad 15W', 34.99, 140, '/images/wireless-charger.png', 'accessories'],
  ['Smartwatch', 'Fitness tracking smartwatch with GPS', 249.99, 70, '/images/smartwatch.png', 'electronics'],
  ['Bluetooth Speaker', 'Waterproof portable speaker', 69.99, 90, '/images/bluetooth-speaker.png', 'electronics'],
  ['Smartphone', '5G smartphone with triple camera', 799.99, 50, '/images/smartphone.png', 'electronics'],
  ['Gaming Mouse Pad', 'Extended RGB gaming mouse pad', 24.99, 130, '/images/gaming-mousepad.png', 'accessories'],
  ['Cable Organizer', 'Desktop cable management system', 19.99, 200, '/images/cable-organizer.png', 'accessories'],
  ['Phone Case', 'Protective phone case with kickstand', 14.99, 180, '/images/phone-case.png', 'accessories'],
  ['Screen Protector', 'Tempered glass screen protector', 9.99, 250, '/images/screen-protector.png', 'accessories'],
  ['Power Bank 20000mAh', 'High-capacity portable charger', 44.99, 105, '/images/power-bank.png', 'accessories'],
  ['Gaming Controller', 'Wireless gaming controller with haptic feedback', 59.99, 80, '/images/gaming-controller.png', 'gaming'],
  ['Network Router', 'Dual-band WiFi 6 router', 129.99, 55, '/images/network-router.png', 'networking'],
  ['Tablet 10" HD', '10-inch tablet with stylus support and HD display', 299.99, 45, '/images/tablet-10-inch.png', 'electronics'],
  ['Laser Printer', 'Wireless laser printer with duplex printing', 249.99, 35, '/images/laser-printer.png', 'electronics'],
];

async function seed() {
  const client = new pg.Client({ connectionString: env.databaseUrl });
  await client.connect();

  const userCount = await client.query('SELECT COUNT(*) as count FROM users');
  if (parseInt(userCount.rows[0].count) > 0) {
    console.log('Database already seeded');
    await client.end();
    return;
  }

  const adminPw = await bcrypt.hash('admin123', 10);
  const customerPw = await bcrypt.hash('customer123', 10);

  await client.query('INSERT INTO users (email, password, name, role) VALUES ($1,$2,$3,$4)', ['admin@inventrix.com', adminPw, 'Admin User', 'admin']);
  await client.query('INSERT INTO users (email, password, name, role) VALUES ($1,$2,$3,$4)', ['customer@inventrix.com', customerPw, 'Customer User', 'customer']);

  for (const p of products) {
    await client.query('INSERT INTO products (name, description, price, stock, image_url, category) VALUES ($1,$2,$3,$4,$5,$6)', p);
  }

  console.log('Seed complete: 2 users, 24 products');
  await client.end();
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
