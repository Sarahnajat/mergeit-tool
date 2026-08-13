"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Download, Loader2, SplitSquareHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToolToast } from "@/components/AlertMessage";
import { splitSubtitle, type SplitMethod, type SplitPart } from "@/lib/SplitFile";

interface SplitFilesProps {
  files?: File[];
}

const splitMethodLabels: Record<SplitMethod, string> = {
  duration: "By time duration",
  lines: "By number of lines",
  files: "By number of files",
};

export default function SplitFilesPanel({ files = [] }: SplitFilesProps) {
  const { showToast } = useToolToast();
  const [method, setMethod] = useState<SplitMethod>("duration");
  const [value, setValue] = useState("10");
  const [parts, setParts] = useState<SplitPart[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const file = files[0];
  const inputValue = Number(value);
  const canSplit = Boolean(file) && Number.isFinite(inputValue) && inputValue > 0 && !isSplitting;
  const baseFileName = file?.name?.replace(/\.(srt|ass)$/i, "") ?? "subtitle_file";

  const handleSplitClick = async () => {
    if (!file || !canSplit) return;

    setIsSplitting(true);
    setError(null);
    setParts([]);

    const result = await splitSubtitle(file, { method, value: inputValue });

    if (!result.success || !result.parts) {
      const message = result.error ?? "Splitting failed.";
      setError(message);
      showToast({ type: "error", title: "Split failed", message });
    } else {
      setParts(result.parts);
      showToast({
        type: "success",
        title: "Split complete",
        message: `Successfully created ${result.parts.length} file${result.parts.length === 1 ? "" : "s"} from ${file.name}.`,
      });
    }

    setIsSplitting(false);
  };

  const downloadPart = (part: SplitPart) => {
    const url = URL.createObjectURL(part.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = part.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => parts.forEach(downloadPart);

  return (
    <div className="space-y-6 w-full">
      <Card className="rounded-3xl shadow-sm border border-border">
        <CardHeader className="p-6 sm:p-8 pb-4">
          <CardTitle className="text-sm font-bold tracking-wider text-foreground">
            Split Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-mono font-bold tracking-[0.25em] text-muted-foreground block">
                Split Method
              </label>
              <Select value={method} onValueChange={(next) => setMethod(next as SplitMethod)}>
                <SelectTrigger className="h-12 w-full rounded-xl border border-border bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(splitMethodLabels) as SplitMethod[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {splitMethodLabels[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-mono font-bold tracking-[0.25em] text-muted-foreground block">
                {method === "duration" ? "Duration per File (minutes)" : method === "lines" ? "Lines per File" : "Number of Files"}
              </label>
              <Input
                type="number"
                min={1}
                step={method === "duration" ? 0.1 : 1}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={method === "duration" ? "10" : method === "lines" ? "100" : "2"}
                className="h-12 w-full rounded-xl border-border bg-background px-4 text-sm text-foreground"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-muted-foreground">
            {file ? (
              <>Selected: <strong className="text-foreground">{file.name}</strong></>
            ) : (
              "Select one SRT or ASS file to split."
            )}
          </div>

          <div className="pt-2 flex flex-col items-center gap-3">
            <Button
              type="button"
              onClick={handleSplitClick}
              disabled={!canSplit}
              className="flex items-center justify-center gap-2 px-8 h-12 text-xs font-semibold rounded-xl"
            >
              {isSplitting ? <Loader2 className="size-4 animate-spin" /> : <SplitSquareHorizontal className="size-4" />}
              {isSplitting ? "Splitting..." : "Split Files"}
            </Button>

            {!file && <p className="text-xs text-destructive">Please select a subtitle file.</p>}
            {file && (!Number.isFinite(inputValue) || inputValue <= 0) && (
              <p className="text-xs text-destructive">Enter a number greater than zero.</p>
            )}
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                <AlertCircle className="size-3.5" />
                {error}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {parts.length > 0 && (
        <Card className="rounded-3xl shadow-sm bg-primary/5 border-primary/20">
          <CardHeader className="p-6 sm:p-8 pb-4">
            <CardTitle className="text-lg font-black text-primary tracking-tight">
              Split Results ({parts.length} generated)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
            <div className="space-y-2">
              {parts.map((part) => (
                <div key={part.filename} className="flex items-center justify-between gap-3 p-3 bg-background/80 border border-border/60 rounded-xl">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{part.filename || `${baseFileName}_part_${part.index}`}</p>
                    <p className="text-xs text-muted-foreground">{(part.blob.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                </div>
              ))}
            </div>
            <Button type="button" onClick={downloadAll} className="w-full sm:w-auto">
              <Download className="size-4" />
              Download All Files
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
