import path from "path";
import { fileURLToPath } from "url";

// Pure JS Mock to bypass better-sqlite3 C++ compilation issues
class MockDatabase {
  private memoryDb: Map<number, any> = new Map();
  private nextId = 1;

  constructor(dbPath: string) {
    console.log("Database initialized using pure JS fallback at:", dbPath);
  }

  // Simulates table creation
  exec(sql: string) {
    return this;
  }

  // Simulates prepared statements for inserts and selects
  prepare(sql: string) {
    const isInsert = sql.toLowerCase().includes("insert into");
    const isSelect = sql.toLowerCase().includes("select");

    return {
      run: (...args: any[]) => {
        if (isInsert) {
          // Simplistic mapping for standard ticket insertions: [name, email, ticket, sentiment, intent, priority, resolution]
          const id = this.nextId++;
          const ticketRecord = {
            id,
            name: args[0],
            email: args[1],
            ticket: args[2],
            sentiment: args[3],
            intent: args[4],
            priority: args[5],
            resolution: args[6],
            created_at: new Date().toISOString()
          };
          this.memoryDb.set(id, ticketRecord);
          return { changes: 1, lastInsertRowid: id };
        }
        return { changes: 0, lastInsertRowid: 0 };
      },
      all: (...args: any[]) => {
        return Array.from(this.memoryDb.values());
      },
      get: (...args: any[]) => {
        if (args[0]) {
          return this.memoryDb.get(Number(args[0]));
        }
        return Array.from(this.memoryDb.values())[0] || null;
      }
    };
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new MockDatabase(path.join(__dirname, "../../../database.sqlite")) as any;

export default db;