import type { Metadata } from "next";
import { TeacherDashboard } from "@/components/TeacherDashboard";

export const metadata: Metadata = {
  title: "Panel docente · MateRico",
  description:
    "Maqueta del panel docente de MateRico: avance del curso, dominio por habilidad y señales de anomalía.",
};

export default function TeacherPage() {
  return <TeacherDashboard />;
}
