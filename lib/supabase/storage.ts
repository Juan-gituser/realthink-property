import { createClient } from "@/lib/supabase/client";

export async function uploadMultipleImages(files: FileList | File[], folder: string = "properties"): Promise<string[]> {
  const supabase = createClient();
  const uploadedUrls: string[] = [];

  for (const file of Array.from(files)) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("property-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(data.path);

    uploadedUrls.push(publicUrlData.publicUrl);
  }

  return uploadedUrls;
}