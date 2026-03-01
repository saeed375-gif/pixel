import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("darb.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    subscription TEXT DEFAULT 'free',
    points INTEGER DEFAULT 0,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ar TEXT,
    name_en TEXT,
    description_ar TEXT,
    description_en TEXT,
    story_ar TEXT,
    story_en TEXT,
    image_url TEXT,
    lat REAL,
    lng REAL,
    is_premium INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ar TEXT,
    name_en TEXT,
    description_ar TEXT,
    description_en TEXT,
    price REAL,
    image_url TEXT,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER,
    site_id INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, site_id)
  );

  CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ar TEXT,
    name_en TEXT,
    icon TEXT,
    requirement TEXT
  );

  CREATE TABLE IF NOT EXISTS user_badges (
    user_id INTEGER,
    badge_id INTEGER,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id)
  );
`);

// Seed initial data if empty
const siteCount = db.prepare("SELECT COUNT(*) as count FROM sites").get() as { count: number };
if (siteCount.count === 0) {
  const insertSite = db.prepare(`
    INSERT INTO sites (name_ar, name_en, description_ar, description_en, story_ar, story_en, image_url, lat, lng, is_premium)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertSite.run(
    "تل تعنك", "Tel Taanach",
    "مدينة كنعانية قديمة تقع شمال غرب جنين.", "An ancient Canaanite city located northwest of Jenin.",
    "كانت تعنك مدينة قوية جداً في الماضي، حيث عاش فيها الملوك والفرسان!", "Taanach was a very powerful city in the past, where kings and knights lived!",
    "https://picsum.photos/seed/taanach/800/600",
    32.518, 35.222, 0
  );

  insertSite.run(
    "كنيسة برقين", "Burqin Church",
    "واحدة من أقدم الكنائس في العالم.", "One of the oldest churches in the world.",
    "يُقال أن السيد المسيح شفى عشرة من البرص في هذا المكان الجميل.", "It is said that Jesus healed ten lepers in this beautiful place.",
    "https://picsum.photos/seed/burqin/800/600",
    32.461, 35.267, 0
  );

  insertSite.run(
    "نفق بلعمة", "Belameh Tunnel",
    "نفق مائي أثري مذهل يمتد تحت الأرض.", "An amazing ancient water tunnel running underground.",
    "استخدمه الناس قديماً للوصول إلى الماء بأمان خلال الحروب!", "People used it in ancient times to reach water safely during wars!",
    "https://picsum.photos/seed/belameh/800/600",
    32.449, 35.292, 1
  );
}

const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (name_ar, name_en, description_ar, description_en, price, image_url, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertProduct.run(
    "حقيبة المستكشف الصغير", "Little Explorer Kit",
    "تحتوي على مكبر، خريطة، وقبعة للاستكشاف.", "Contains a magnifier, map, and a hat for exploration.",
    45.0, "https://picsum.photos/seed/kit/400/400", "educational"
  );

  insertProduct.run(
    "خريطة جنين الأثرية", "Jenin Heritage Map",
    "خريطة كبيرة ملونة للمناطق الأثرية.", "A large colorful map of archaeological sites.",
    15.0, "https://picsum.photos/seed/map/400/400", "educational"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/sites", (req, res) => {
    const sites = db.prepare("SELECT * FROM sites").all();
    res.json(sites);
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get("/api/user/:id", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    if (user) {
      const progress = db.prepare(`
        SELECT s.* FROM progress p
        JOIN sites s ON p.site_id = s.id
        WHERE p.user_id = ?
      `).all(req.params.id);
      const badges = db.prepare(`
        SELECT b.* FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = ?
      `).all(req.params.id);
      res.json({ ...user, progress, badges });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Simple Auth (Mock for demo)
  app.post("/api/login", (req, res) => {
    const { username } = req.body;
    let user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;
    if (!user) {
      const info = db.prepare("INSERT INTO users (username, email, avatar) VALUES (?, ?, ?)").run(username, `${username}@example.com`, `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`);
      user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
    }
    res.json(user);
  });

  app.post("/api/progress", (req, res) => {
    const { user_id, site_id } = req.body;
    try {
      db.prepare("INSERT INTO progress (user_id, site_id) VALUES (?, ?)").run(user_id, site_id);
      db.prepare("UPDATE users SET points = points + 50 WHERE id = ?").run(user_id);
      res.json({ success: true, points_added: 50 });
    } catch (e) {
      res.status(400).json({ error: "Already completed or error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
