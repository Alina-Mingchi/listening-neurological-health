import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageShell, Notice } from "@/components/PageShell";
import { SignalPanel } from "@/components/SignalPanel";
import { BiInline } from "@/components/Bilingual";
import { ArrowRight, RotateCcw } from "@/components/icons";
import { parseCsv } from "@/lib/csv";

export const Route = createFileRoute("/process/")({
  head: () => ({
    meta: [
      { title: "Process Speech · Traiter la parole — Noise Reduction Demo" },
      {
        name: "description",
        content:
          "Compare clean, noisy and enhanced speech recorded in bus, cafeteria, street and pedestrian environments, with measured SNR improvement.",
      },
      { property: "og:title", content: "Process Speech · Traiter la parole — Noise Reduction" },
      {
        property: "og:description",
        content: "Waveforms, spectrograms and measured noise reduction for four acoustic environments.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProcessPage,
});

const ENVS = ["BUS", "CAF", "STR", "PED"] as const;

function ProcessPage() {
  const [env, setEnv] = useState<string | null>(null);

  const { data: rows } = useQuery({
    queryKey: ["noise-reduction-csv"],
    queryFn: async () => parseCsv(await (await fetch("/data/noise_reduction.csv")).text()),
  });

  const row = rows?.find((r) => r["environment"] === env);

  return (
    <PageShell
      eyebrow={<BiInline en="Demonstration 01" fr="Démonstration 01" />}
      title="Process speech"
      titleFr="Traiter la parole"
      intro="Choose an environment."
      introFr="Choisissez un environnement. "
      steps={[
        { label: "Enhance", labelFr: "Rehausser", active: true },
        { label: "Your voice", labelFr: "Votre voix", active: false },
      ]}
    >
      <div className="flex flex-wrap gap-3">
        {ENVS.map((e) => (
          <Button
            key={e}
            variant={env === e ? "default" : "outline"}
            onClick={() => setEnv(e)}
            className="font-mono tracking-widest"
          >
            {e}
          </Button>
        ))}
      </div>

      {!env ? (
        <div className="mt-8 text-sm text-muted-foreground">
          <p>BUS — bus interior · CAF — cafeteria · STR — street · PED — pedestrian area</p>
          <p lang="fr" className="italic text-muted-foreground/80">
            BUS — intérieur de bus · CAF — cafétéria · STR — rue · PED — zone piétonne
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <p className="rule-heading">
            {row?.["label"] ?? env} · <span lang="fr" className="italic">{row?.["label_fr"] ?? env}</span> ·{" "}
            {row?.["file"] ?? "sample.wav"}
          </p>

          <div className="grid gap-6">
            <SignalPanel
              seed={env}
              src={row?.["clean_file"]}
              variant="clean"
              label="Clean"
              labelFr="Propre"
              caption="Reference studio recording"
              captionFr="Enregistrement studio de référence"
            />
            <SignalPanel
              seed={env}
              src={row?.["noisy_file"]}
              variant="noisy"
              label="Noisy"
              labelFr="Bruité"
              caption={`Recording mixed with ${row?.["label"] ?? env} noise${row?.["input_snr_db"] ? ` · input SNR ${row["input_snr_db"]} dB` : ""}`}
              captionFr={`Enregistrement mélangé au bruit « ${row?.["label_fr"] ?? env} »${row?.["input_snr_db"] ? ` · SNR d'entrée ${row["input_snr_db"]} dB` : ""}`}
            />
            <SignalPanel
              seed={env}
              src={row?.["enhanced_file"]}
              variant="enhanced"
              label="Enhanced"
              labelFr="Rehaussé"
              caption="After the noise-reduction"
              captionFr="Après le module de réduction du bruit"
            />

          </div>

          <Notice>
            Noise reduction:{" "}
            <span className="font-mono text-lg text-primary">+{row?.["snr_gain_db"] ?? "—"} dB</span>{" "}
            SNR improvement for this recording.
            <br />
            <span lang="fr" className="italic">
              Réduction du bruit : amélioration du SNR de{" "}
              <span className="font-mono not-italic text-primary">+{row?.["snr_gain_db"] ?? "—"} dB</span> pour cet
              enregistrement.
            </span>
          </Notice>

          <div className="flex flex-wrap gap-3 border-t border-border pt-6">
            <Button variant="outline" onClick={() => setEnv(null)}>
              <RotateCcw className="size-4" />
              <BiInline en="Try another" fr="Essayer un autre" />
            </Button>
            <Button asChild>
              <Link to="/process/record">
                <BiInline en="Next" fr="Suivant" />
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
