import { readFileSync } from 'fs';

const PROJECT_REF = 'cphgtyaahgsdsddctdej';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

const sql = readFileSync('./supabase/admin_rls_fix.sql', 'utf8');

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
    // DROP POLICY IF NOT EXISTS errors are safe to ignore
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
} else {
  console.log(`🎉 All policies applied! Admin dashboard fully unlocked.`);
  console.log(`👉 Login at: https://saverabygouri.vercel.app/admin/login`);
}
