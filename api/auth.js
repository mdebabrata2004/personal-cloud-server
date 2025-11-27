const { supabaseAdmin } = require('../lib/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this';

async function handler(req, res) {
  if (req.method === 'POST') {
    const path = req.url || req.originalUrl || '';
    if (path.endsWith('/register')) {
      const { name, phone, password } = req.body;
      if (!phone || !password) return res.status(400).json({ error: 'phone & password required' });
      const hashed = await bcrypt.hash(password, 10);
      const { data, error } = await supabaseAdmin.from('users').insert([{ name, phone, password: hashed }]).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.json({ message: 'Registered', userId: data.id });
    }
    if (path.endsWith('/login')) {
      const { phone, password } = req.body;
      if (!phone || !password) return res.status(400).json({ error: 'phone & password required' });
      const { data: user, error } = await supabaseAdmin.from('users').select('*').eq('phone', phone).single();
      if (error || !user) return res.status(400).json({ error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user.id, name: user.name, phone: user.phone }});
    }
  }
  res.status(405).json({ error: 'Method not allowed' });
}

module.exports = handler;
