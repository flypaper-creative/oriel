import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { seedDemo } from "./seed";
import { runIterations } from "./iterate";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Demo seed endpoint
app.post("/api/seed", async (req, res)=>{
  try {
    await seedDemo();
    res.json({ok:true});
  } catch(e){
    res.status(500).json({error:String(e)});
  }
});

// iterate endpoint - demo-mode only (no external LLM)
app.post("/api/iterate", async (req,res)=>{
  try {
    const { input, rounds = 3 } = req.body;
    const result = await runIterations(input, rounds);
    res.json(result);
  } catch(e){
    res.status(500).json({error:String(e)});
  }
});

const port = process.env.PORT || 4000;
app.listen(port, ()=>console.log("Oriel server listening on", port));
