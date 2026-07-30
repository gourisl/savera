import { readFileSync } from 'fs';

const PROJECT_REF = 'cphgtyaahgsdsddctdej';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

if (!ACCESS_TOKEN) {
  console.error("Missing SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

const sql = `
-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO NOTHING;

-- Public access to read objects
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Admin can insert
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND public.is_admin());

-- Admin can update
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND public.is_admin());

-- Admin can delete
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND public.is_admin());
`;

async function runQuery(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

// Split SQL into individual statements and run them
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Found ${statements.length} SQL statements to execute...\n`);

let success = 0;
let errors = [];

async function main() {
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (!stmt) continue;
    
    const preview = stmt.substring(0, 80).replace(/\n/g, ' ');
    process.stdout.write(`[${i+1}/${statements.length}] ${preview}... `);
    
    try {
      await runQuery(stmt + ';');
      console.log('✓');
      success++;
    } catch (err) {
      if (err.message.includes('does not exist') || err.message.includes('already exists')) {
        console.log('⚠ (skipped - already applied)');
        success++;
      } else {
        console.log(`✗ ERROR: ${err.message.substring(0, 120)}`);
        errors.push({ stmt: preview, error: err.message });
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ Success: ${success} statements`);
  if (errors.length > 0) {
    console.log(`❌ Errors: ${errors.length}`);
    errors.forEach(e => console.log(`  - ${e.stmt}\n    ${e.error.substring(0, 150)}`));
  }
}

main().catch(console.error);
