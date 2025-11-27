const { supabaseAdmin } = require('../lib/supabase');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this';

function authenticate(req) {
  const header = req.headers.authorization || '';
  const token = header.split(' ')[1];
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET); } catch (e) { return null; }
}

async function handler(req, res) {
  const user = authenticate(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { receiverId, text } = req.body;
    const { data, error } = await supabaseAdmin.from('chat_messages').insert([{ sender_id: user.id, receiver_id: receiverId, text }]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'GET') {
    const withUser = req.query.withUser;
    const { data, error } = await supabaseAdmin.from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${withUser}),and(sender_id.eq.${withUser},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  }

  res.status(405).json({ error: 'Method not allowed' });
}

module.exports = handler;
