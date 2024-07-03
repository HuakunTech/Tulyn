// write SUPABASE_ANON_KEY env to .env
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const envContent = `SUPABASE_ANON_KEY=${process.env.SUPABASE_ANON_KEY}
SUPABASE_GRAPHQL_ENDPOINT=${process.env.SUPABASE_GRAPHQL_ENDPOINT}
SUPABASE_URL=${process.env.SUPABASE_URL}
`;
writeFileSync(resolve(__dirname, '../apps/desktop/.env'), envContent);
writeFileSync(resolve(__dirname, '../packages/gql/.env'), envContent);
