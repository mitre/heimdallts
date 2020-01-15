import { Injectable } from "@nestjs/common";

export type ExecutionID = string;
export interface Execution {
  id: ExecutionID;
  value: string;
}

@Injectable()
export class DbService {
  private readonly executions: Map<ExecutionID, Execution> = new Map();

  constructor() {
    for (let i = 1; i < 10; i++) {
      const id = i.toString();
      this.executions.set(id, {
        id,
        value: `Execution ${i}`
      });
    }
  }

  async upload(exec: Execution): Promise<void> {
    this.executions.set(exec.id, exec);
  }

  async list_ids(): Promise<ExecutionID[]> {
    return [...this.executions.keys()];
  }

  async get_by_id(exec_id: ExecutionID): Promise<Execution> {
    return this.executions.get(exec_id);
  }
}
