import NegotiationSection from "@/components/crm/NegotiationSection";

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Informasi Detail Properti ... */}

      {/* TAHAP 5: Riwayat Negosiasi Properti Ini */}
      <NegotiationSection propertyId={params.id} />
    </div>
  );
}