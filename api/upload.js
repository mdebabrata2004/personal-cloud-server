const { supabaseAdmin } = require('../lib/supabase');
const jwt = require('jsonwebtoken');
const formidable = require('formidable').default;
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this';

function authenticate(req) {
  const header = req.headers.authorization || '';
  const token = header.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  const user = authenticate(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(400).json({ error: 'Invalid form-data' });
    }

    const file = files.file?.[0]; // <-- v3 array support
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const filePath = file.filepath;
      const fileBuffer = fs.readFileSync(filePath);

      const filename = `${Date.now()}-${file.originalFilename}`;
      
      const { error: uploadError } = await supabaseAdmin
        .storage
        .from('uploads')
        .upload(filename, fileBuffer, {
          contentType: file.mimetype
        });

      if (uploadError)
        return res.status(500).json({ error: uploadError.message });

      const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${encodeURIComponent(filename)}`;

      const { data, error } = await supabaseAdmin
        .from('files')
        .insert({
          user_id: user.id,
          file_url: publicUrl,
          file_type: file.mimetype
        })
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });

      return res.json(data);
      
    } catch (e) {
      console.error("Upload catch error:", e);
      return res.status(500).json({ error: e.message });
    }
  });
};
