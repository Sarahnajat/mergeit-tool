"use client";

import { useState } from "react";
import { ArrowRightLeft as ConvertIcon, FileText, Download, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptionList } from "@/components/OptionList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToolToast } from "@/components/AlertMessage";
import { convertSubtitle, extensionOf, formatExtension, formatLabel, type SubtitleFormat } from "@/lib/Convert";

interface ConvertProps {
  files?: File[];
}

interface ConvertedResult {
  originalName: string;
  success: boolean;
  blob?: Blob;
  filename?: string;
  error?: string;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadBlobsStaggered(items: { blob: Blob; filename: string }[], delayMs = 300) {
  items.forEach((item, index) => {
    window.setTimeout(() => downloadBlob(item.blob, item.filename), index * delayMs);
  });
}

function fileExtensionLabel(name: string): string {
  const extension = extensionOf(name);
  if (extension) return formatLabel(extension);
  if (!name.includes(".")) return "FILE";
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

export default function ConvertFilesPanel({ files = [] }: ConvertProps) {
  const { showToast } = useToolToast();
  const [targetFormat, setTargetFormat] = useState<SubtitleFormat>("ass");
  const [preserveStyling, setPreserveStyling] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [results, setResults] = useState<ConvertedResult[]>([]);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const hasFiles = files.length > 0;
  const sameFormatFiles = files.filter((file) => extensionOf(file.name) === targetFormat);
  const unsupportedFiles = files.filter((file) => extensionOf(file.name) === null);
  const canConvert = hasFiles && sameFormatFiles.length === 0 && unsupportedFiles.length === 0;
  const hasResults = results.length > 0;
  const formatTag = formatLabel(targetFormat);

  const validationMessage = conversionError
    ?? (!hasFiles
      ? "Please select a file to convert"
      : unsupportedFiles.length > 0
        ? "Only .srt and .ass files are supported."
        : sameFormatFiles.length > 0
          ? sameFormatFiles.length === 1
            ? `${sameFormatFiles[0].name} is already ${formatExtension(targetFormat)}. Choose the other format.`
            : `${sameFormatFiles.map((file) => file.name).join(", ")} are already ${formatExtension(targetFormat)}. Choose the other format.`
          : null);

  const handleConvertClick = async () => {
    if (!canConvert) return;

    setIsConverting(true);
    setConversionError(null);
    setResults([]);

    try {
      const outcomes = await Promise.all(
        files.map(async (file) => {
          const result = await convertSubtitle(file, targetFormat, preserveStyling);
          return {
            originalName: file.name,
            success: result.success,
            blob: result.success ? result.blob : undefined,
            filename: result.success ? result.filename : undefined,
            error: result.success ? undefined : result.error,
          };
        }),
      );

      setResults(outcomes);

      const successCount = outcomes.filter((outcome) => outcome.success).length;
      const failedCount = outcomes.length - successCount;

      if (successCount > 0) {
        showToast({
          type: "success",
          title: "Conversion complete",
          message: successCount === 1
            ? `Successfully converted to ${outcomes.find((outcome) => outcome.success)?.filename ?? formatLabel(targetFormat)}.`
            : `Successfully converted ${successCount} file${successCount === 1 ? "" : "s"} to ${formatLabel(targetFormat)}.`,
        });
      }

      if (failedCount > 0) {
        const firstError = outcomes.find((outcome) => !outcome.success)?.error ?? "Conversion failed.";
        showToast({
          type: "error",
          title: failedCount === outcomes.length ? "Conversion failed" : "Some files failed",
          message: failedCount === outcomes.length
            ? firstError
            : `${failedCount} file${failedCount === 1 ? "" : "s"} could not be converted.`,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Conversion failed.";
      setConversionError(message);
      showToast({ type: "error", title: "Conversion failed", message });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    const downloadable = results.flatMap((result) =>
      result.success && result.blob && result.filename
        ? [{ blob: result.blob, filename: result.filename }]
        : [],
    );
    downloadBlobsStaggered(downloadable);
  };

  return (
    <div className="space-y-4 w-full">
      <div className={cn("w-full", hasResults && "grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch")}>
        <Card className="rounded-3xl shadow-sm border border-border flex flex-col justify-between">
          <CardHeader className="p-6 sm:p-8 pb-4 sm:pb-4">
            <CardTitle className="text-sm font-bold tracking-wider">
              Convert Configuration
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 pt-0 sm:pt-0 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3.5 p-3.5 bg-background border border-border rounded-2xl transition-colors hover:border-primary/30"
                >
                  <div className="relative flex items-center justify-center size-11 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                    <FileText className="size-5 text-primary" />
                    <span className="absolute -bottom-1 text-[8px] font-mono font-bold text-primary bg-background px-1 rounded-sm border border-primary/30 shadow-xs">
                      {fileExtensionLabel(file.name)}
                    </span>
                  </div>
                  <div className="min-w-0 text-left flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ))}
              {files.length === 0 && (
                <div className="px-4 py-3 bg-background/50 border border-border border-dashed rounded-xl text-sm text-muted-foreground text-center">
                  Awaiting files...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <OptionList
                label="Target Format"
                name="target-format"
                value={targetFormat}
                onChange={setTargetFormat}
                options={[
                  { value: "ass", label: "Advanced SubStation (.ass)" },
                  { value: "srt", label: "SubRip (.srt)" },
                ]}
              />

              <OptionList
                label="Preserve Styling"
                name="preserve-styling"
                value={preserveStyling ? "yes" : "no"}
                onChange={(value) => setPreserveStyling(value === "yes")}
                options={[
                  { value: "yes", label: "Yes (Default)" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>

            <div className="pt-4 flex flex-col items-center gap-3">
              <Button
                type="button"
                onClick={handleConvertClick}
                disabled={!canConvert || isConverting}
                className="w-full sm:w-auto px-8 h-12 text-xs font-semibold rounded-xl shadow-md shadow-primary/20 active:scale-95"
              >
                {isConverting ? <Loader2 className="size-4 animate-spin" /> : <ConvertIcon className="size-4" />}
                {isConverting ? "Converting..." : `Convert to ${formatTag}`}
              </Button>

              {validationMessage && (
                <p className="flex items-center gap-1.5 text-xs text-destructive font-medium tracking-wide">
                  <AlertCircle className="size-3.5" />
                  {validationMessage}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {hasResults && (
          <Card className="rounded-3xl shadow-sm bg-primary/5 border-primary/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

            <CardHeader className="p-6 sm:p-8 pb-4 sm:pb-2 relative z-10">
              <CardTitle className="text-lg font-black text-primary tracking-tight">
                Convert Results
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 pt-0 sm:pt-0 space-y-6 relative z-10 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {results.map((result, index) => {
                  const fileSize = result.blob ? (result.blob.size / 1024).toFixed(2) : "0.00";
                  const resultFormat = result.filename
                    ? formatLabel(extensionOf(result.filename) ?? targetFormat)
                    : formatTag;

                  return (
                    <div
                      key={`${result.originalName}-${index}`}
                      className="flex items-center justify-between p-3.5 bg-background/80 border border-border/60 rounded-2xl"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative flex items-center justify-center size-11 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                          <FileText className="size-5 text-primary" />
                          <span className="absolute -bottom-1 text-[8px] font-mono font-bold text-primary bg-background px-1 rounded-sm border border-primary/30 shadow-xs">
                            {resultFormat}
                          </span>
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {result.success ? result.filename : result.originalName}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            {result.success ? (
                              <>
                                <span className="font-mono">{fileSize} KB</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-semibold text-primary">
                                  <CheckCircle2 className="size-3 text-primary" />
                                  Converted
                                </span>
                              </>
                            ) : (
                              <span className="flex items-center gap-1 font-semibold text-destructive">
                                <AlertCircle className="size-3" />
                                {result.error || "Failed"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-center">
                <Button
                  type="button"
                  onClick={handleDownload}
                  disabled={!results.some((result) => result.success)}
                  className="w-full sm:w-auto px-8 h-12 text-xs font-semibold rounded-xl shadow-md shadow-primary/20 active:scale-95"
                >
                  <Download className="size-4" />
                  Download {results.length > 1 ? "Converted Files" : "Converted File"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}