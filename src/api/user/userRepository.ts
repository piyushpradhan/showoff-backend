import { Pool } from 'pg';

import { User } from '@/api/user/userModel';
import { env } from '@/common/utils/envConfig';

export class UserRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: env.DB_URL,
    });
  }

  async findAllAsync(): Promise<User[]> {
    const query = 'SELECT * from users;';
    const result = await this.pool.query(query);
    return result.rows.length > 0 ? result.rows[0] : [];
  }

  async findByIdAsync(id: string): Promise<User | null> {
    const query = 'SELECT * from users WHERE uid = $1';
    const values = [id];
    const result = await this.pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}
