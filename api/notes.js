const { supabaseAdmin } = require('../lib/supabase');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this';

function authenticate(req) {
  const header = req.headers.authorization || '';
  const token = header.split(' ')[1];
  if (!token) return null;
  try {
    const dec = jwt.verify(token, JWT_SECRET);
    return dec;
  } catch (e) {
    return null;
  }
}

async function handler(req, res) {
  const user = authenticate(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { category, content, type } = req.body;
    const { data, error } = await supabaseAdmin.from('notes').insert([{ user_id: user.id, category, content, type }]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  }

  res.status(405).json({ error: 'Method not allowed' });
}

module.exports = handler;
