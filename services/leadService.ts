import { createClient } from "@/lib/supabase/client";
import { Lead, LeadStage } from "@/types/lead";
import { LeadFormValues } from "@/schemas/leadSchema";

/**
 * Mengambil seluruh data leads dari Supabase
 */
export async function fetchLeads(): Promise<Lead[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat leads: ${error.message}`);
  }

  return data || [];
}

/**
 * Memperbarui tahapan status lead (untuk keperluan Drag and Drop Kanban)
 */
export async function updateLeadStage(id: string, newStatus: LeadStage): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    throw new Error(`Gagal memperbarui status lead: ${error.message}`);
  }
}

/**
 * Menambahkan lead baru ke database
 */
export async function createLead(values: LeadFormValues): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("leads").insert([
    {
      ...values,
      activities: [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          description: "Lead berhasil dibuat ke dalam sistem.",
        },
      ],
    },
  ]);

  if (error) {
    throw new Error(`Gagal menambah lead: ${error.message}`);
  }
}