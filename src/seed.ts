import fs from "fs";
import Database from "better-sqlite3";
export async function seedDemo(){
  const db = new Database("oriel_demo.db");
  db.exec(`CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT, description TEXT);
           CREATE TABLE IF NOT EXISTS runs (id INTEGER PRIMARY KEY, run_id TEXT, round INTEGER, input TEXT, output TEXT);`);
  const data = JSON.parse(fs.readFileSync("src_demo_seed/demo-projects.json","utf8"));
  const insert = db.prepare("INSERT OR REPLACE INTO projects (id,name,description) VALUES (?,?,?)");
  for (const p of data) insert.run(p.id, p.name, p.description);
}
