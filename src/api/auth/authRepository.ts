import { Pool } from 'pg';

import { User } from '@/api/user/userModel';
import { env } from '@/common/utils/envConfig';

export class AuthRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: env.DB_URL,
    });
  }

  async createOrUpdateUser(uid: string, name: string, email: string): Promise<User | null> {
    try {
      // Check if user with provided UID exists already
      const existingUser = await this.getUserByUID(uid);

      if (existingUser) {
        // Update user details if user already exists
        const updatedUser = await this.updateUser(uid, name, email);
        return updatedUser!;
      } else {
        // Create new user if it doesn't already exist
        const newUser = await this.createUser(uid, name, email);
        return newUser;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  private async getUserByUID(uid: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE uid = $1';
    const values = [uid];
    const result = await this.pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  private async updateUser(uid: string, name: string, email: string): Promise<User | null> {
    const query = 'UPDATE users SET name = $2, email = $3 WHERE uid = $1 RETURNING *';
    const values = [uid, name, email];
    const result = await this.pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  private async createUser(uid: string, name: string, email: string): Promise<User | null> {
    const query = 'INSERT INTO users (uid, name, email) VALUES ($1, $2, $3) RETURNING *';
    const values = [uid, name, email];
    const result = await this.pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}
