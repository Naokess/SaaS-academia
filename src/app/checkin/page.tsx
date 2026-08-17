import { Dumbbell, QrCode } from "lucide-react";
import Link from "next/link";
import { CheckinForm } from "./checkin-form";

export const metadata = {
  title: "Check-in | FitFlow",
};

export default function CheckinPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-foreground p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Dumbbell className="h-7 w-7" />
          </div>
          <span className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            FitFlow Aluno
          </span>
          <h1 className="text-2xl font-bold text-background">
            Faça login para validar seu check-in agora
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use seu e-mail cadastrado ou escaneie o QR na recepção.
          </p>
        </div>

        <div className="mb-4 rounded-2xl border border-primary/30 bg-card/5 p-5 text-center backdrop-blur">
          <QrCode className="mx-auto mb-2 h-10 w-10 text-primary" />
          <p className="text-sm text-muted-foreground">
            Aponte a câmera para o QR code da academia
          </p>
        </div>

        <CheckinForm />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Problemas?{" "}
          <Link href="/checkin/ajuda" className="font-medium underline underline-offset-2">
            Fale com a recepção
          </Link>
        </p>
      </div>
    </div>
  );
}