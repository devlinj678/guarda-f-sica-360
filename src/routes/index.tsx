import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GoDocs Guarda Física 360 — Gestão de arquivo físico" },
      {
        name: "description",
        content:
          "Controle de caixas, vagas, ordens de serviço, SLA e auditoria para operações de guarda física de documentos.",
      },
      { property: "og:title", content: "GoDocs Guarda Física 360" },
      {
        property: "og:description",
        content: "Rastreabilidade total do documento à caixa 20kg, com log imutável de eventos.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="hatch-band mb-8 h-1.5 w-32 rounded-full" />
        <p className="label-industrial text-primary">Warehouse Management System</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.05] md:text-6xl">
          GoDocs
          <br />
          Guarda Física <span className="text-primary">360</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Controle ponta a ponta do arquivo físico: documento, caixa box 5kg e caixa 20kg — com
          endereçamento por vaga, ordens de serviço, SLA e log imutável de eventos.
        </p>

        <div className="mt-8 flex gap-3">
          <Button asChild size="lg">
            <Link to="/auth">Entrar no sistema</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/dashboard">Ir para o painel</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-6 border-t pt-8 md:grid-cols-3">
          {[
            { icon: Boxes, t: "Hierarquia física", d: "Documento → Box 5kg → Caixa 20kg, um cliente por caixa." },
            { icon: MapPin, t: "Endereçamento", d: "Vagas no padrão R01-M01-C01-A01-V01 com reserva e cativas." },
            { icon: ShieldCheck, t: "Auditoria", d: "Todo evento registrado e imutável, sempre ligado a uma OS." },
          ].map((f) => (
            <div key={f.t}>
              <f.icon className="mb-3 h-5 w-5 text-primary" />
              <h2 className="font-display text-base font-bold">{f.t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
