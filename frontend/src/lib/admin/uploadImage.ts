import { supabase } from '@/lib/supabaseClient';

export async function uploadImageFile(file: File, opts?: { category?: string; folder?: string }) {
  const bucket = 'product-images'; // ensure this bucket exists and is public
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const cleanName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const folder = opts?.folder ?? opts?.category ?? 'misc';
  const path = `${folder}/${ts}-${rand}-${cleanName}`;

  const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });
  if (upErr) throw new Error(upErr.message || 'Nu s-a putut încărca imaginea');

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('Nu s-a putut obține URL-ul public');
  return { publicUrl: data.publicUrl, path };
}
