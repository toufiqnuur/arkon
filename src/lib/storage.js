export const IMAGE_BUCKET = "images";

const LEGACY_HOST = "darswxlsordzgcemxqkt.supabase.co";

/**
 * Rewrites image URLs saved by the old Supabase project to the current one.
 * This keeps existing rows working until their URLs are migrated in the DB.
 */
export function resolveImageUrl(url) {
  if (!url) return url;

  const currentHost = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!currentHost) return url;

  return url.replace(`https://${LEGACY_HOST}`, currentHost);
}

function getExtension(file) {
  const fromName = file.name?.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();

  const fromType = file.type?.split("/").pop();
  return fromType || "bin";
}

export async function uploadImage(supabase, file) {
  const path = `${crypto.randomUUID()}.${getExtension(file)}`;

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
