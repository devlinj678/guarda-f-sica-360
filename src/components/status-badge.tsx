import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const positivos = ["guardada_confirmada", "concluida", "ativo", "livre", "recebida", "aprovada"];
const alertas = [
  "em_conferencia",
  "aguardando_inbound",
  "aguardando_enderecamento",
  "posicao_reservada",
  "reservada",
  "pausada",
  "aguardando_aprovacao",
  "em_execucao",
  "aberta",
];
const criticos = [
  "em_divergencia",
  "divergente",
  "extraviada",
  "bloqueada",
  "bloqueio_legal",
  "cancelada",
  "vencida",
  "emergencia",
  "com_divergencia",
];

export function StatusBadge({ status, className }: { status: string | null; className?: string }) {
  const valor = status ?? "—";
  const tom = positivos.includes(valor)
    ? "border-success/40 bg-success/15 text-success"
    : criticos.includes(valor)
      ? "border-destructive/40 bg-destructive/15 text-destructive"
      : alertas.includes(valor)
        ? "border-primary/40 bg-primary/15 text-primary"
        : "border-border bg-muted text-muted-foreground";

  return (
    <Badge variant="outline" className={cn("label-industrial font-medium", tom, className)}>
      {valor.replaceAll("_", " ")}
    </Badge>
  );
}
