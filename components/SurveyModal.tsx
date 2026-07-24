"use client";

import { useState } from "react";
import { X, Calendar, Clock, Users, User, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  onSubmitSuccess?: () => void; // Tambahkan baris ini
}

export default function SurveyModal({ isOpen, onClose, propertyId, propertyTitle, onSubmitSuccess }: SurveyModalProps) {
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [surveyDate, setSurveyDate] = useState("");
  const [surveyTime, setSurveyTime] = useState("");
  const [numPeople, setNumPeople] = useState("1");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("property_surveys").insert([
        {
          property_id: propertyId,
          property_title: propertyTitle,
          full_name: fullName,
          whatsapp,
          email: email || null,
          survey_date: surveyDate,
          survey_time: surveyTime,
          num_people: parseInt(numPeople) || 1,
          notes: notes || null,
          status: "Menunggu",
        },
      ]);

      if (error) throw error;

      setSuccessMessage(true);

      // Panggil callback jika ada
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
        // Reset Form
        setFullName("");
        setWhatsapp("");
        setEmail("");
        setSurveyDate("");
        setSurveyTime("");
        setNumPeople("1");
        setNotes("");
      }, 2500);
    } catch (error: any) {
      alert("Gagal mengirim jadwal survei: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (sisa kode form modal tetap sama)
}