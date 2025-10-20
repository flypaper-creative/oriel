import Database from "better-sqlite3";
const db = new Database("oriel_demo.db");
db.exec(`CREATE TABLE IF NOT EXISTS runs (id INTEGER PRIMARY KEY, run_id TEXT, round INTEGER, input TEXT, output TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`);

export async function runIterations(input:string, rounds:number){
  const history = [];
  let seed = input;
  for (let i=1;i<=rounds;i++){
    seed = seed + " [demo-refine-"+i+"]";
    const stmt = db.prepare("INSERT INTO runs (run_id, round, input, output) VALUES (?,?,?,?)");
    stmt.run("demo", i, input, seed);
    history.push({round:i, output:seed, score: Math.round(50 + Math.random()*50)});
  }
  return { input, rounds, history };
}
