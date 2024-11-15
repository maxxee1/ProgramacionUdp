import { neon } from '@neondatabase/serverless';

const sql = neon(
  'postgresql://neondb_owner:scR5o3JDNuzv@ep-cool-paper-a5dz9krs.us-east-2.aws.neon.tech/neondb?sslmode=require'
);

export default sql;