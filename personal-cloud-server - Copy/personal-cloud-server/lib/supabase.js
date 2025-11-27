const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL in env');
if (!SUPABASE_ANON_KEY) console.warn('Warning: SUPABASE_ANON_KEY not set');
if (!SUPABASE_SERVICE_ROLE_KEY) console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY not set');

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false }});

module.exports = { supabase, supabaseAdmin };
