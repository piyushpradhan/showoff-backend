import { Pool } from 'pg';

import { env } from '@/common/utils/envConfig';

import { Meeting } from './meetingModel';

export class MeetingRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: env.DB_URL,
    });
  }

  async findUserMeetings(): Promise<Meeting[]> {
    const query = 'SELECT * from meetings;';
    const result = await this.pool.query(query);
    return result.rows.length > 0 ? result.rows : [];
  }
}
