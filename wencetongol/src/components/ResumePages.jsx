import React, { useEffect, useRef, useState } from "react";
// The legacy build, not the default one: the default assumes a browser recent
// enough for the modern syntax it ships, and a phone a few versions behind
// fails the import outright rather than degrading. Legacy costs ~50KB more.
//
// The minified worker: Vite copies it through as an asset rather than bundling
// it, so the unminified build would ship all 2.2MB of itself.
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

/**
 * Renders every page of a PDF to canvas with pdf.js.
 *
 * An <iframe> is the cheap way to show a PDF, but phone browsers render only
 * its first page and will not scroll to the rest, so the second page of the
 * résumé was unreachable from the inline view. Drawing the pages ourselves puts
 * them in an ordinary scrollable column that behaves the same everywhere.
 *
 * pdf.js is a few hundred KB, so it is imported on open rather than at module
 * scope: Hero pulls the dialog into the first chunk, and the library has no
 * business being in it.
 */

// Retina-sharp without the memory a 3x phone would otherwise ask for.
const MAX_DPR = 2;

// Below this, a width change is scrollbar jitter rather than a real resize.
const REDRAW_THRESHOLD = 24;

const ResumePages = ({ file, fileName }) => {
  const columnRef = useRef(null);
  const canvasRefs = useRef([]);
  const docRef = useRef(null);
  const loadingTaskRef = useRef(null);
  const [pages, setPages] = useState(0);
  const [status, setStatus] = useState("loading");
  // Surfaced in the fallback: without it a reader on a browser this does not
  // suit can only report that it "didn't work".
  const [reason, setReason] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Retried once: this is a few hundred KB fetched the moment the dialog
        // opens, and a phone that drops it on the first try usually has it on
        // the second. pdf.js handles the worker itself — where module workers
        // are unavailable it falls back to running on the main thread.
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs").catch(
          () => import("pdfjs-dist/legacy/build/pdf.mjs"),
        );
        if (cancelled) return;

        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

        // v6 dropped the bare-string shorthand; it wants a source object.
        const loadingTask = pdfjs.getDocument({ url: file });
        loadingTaskRef.current = loadingTask;

        const doc = await loadingTask.promise;
        if (cancelled) return;

        docRef.current = doc;
        setPages(doc.numPages);
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setReason(String(error?.message || error).slice(0, 120));
        setStatus("error");
      }
    })();

    // Teardown hangs off the loading task, not the document proxy — StrictMode
    // runs this between its paired mounts, and throwing here takes the whole
    // component down with it.
    return () => {
      cancelled = true;
      const loadingTask = loadingTaskRef.current;
      loadingTaskRef.current = null;
      docRef.current = null;
      if (loadingTask) loadingTask.destroy();
    };
  }, [file]);

  // Draws at the column's current width, and redraws when that width changes --
  // rotating a phone, or the md breakpoint widening the dialog.
  useEffect(() => {
    if (status !== "ready" || !pages) return undefined;

    let cancelled = false;
    let tasks = [];
    let drawnAt = 0;

    const draw = async (width) => {
      const doc = docRef.current;
      if (!doc || !width) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      // Pages go out together rather than one after another: they write to
      // separate canvases, so serialising them only means a page that is slow
      // to render holds up every page after it.
      await Promise.all(
        Array.from({ length: pages }, async (unused, index) => {
          const canvas = canvasRefs.current[index];
          if (!canvas || cancelled) return;

          const page = await doc.getPage(index + 1);
          if (cancelled) return;

          const unscaled = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({
            scale: (width / unscaled.width) * dpr,
          });

          canvas.width = Math.round(viewport.width);
          canvas.height = Math.round(viewport.height);

          const task = page.render({
            canvasContext: canvas.getContext("2d"),
            viewport,
          });
          tasks.push(task);

          try {
            await task.promise;
          } catch {
            // A redraw cancelled this one; the newer pass owns the canvas now.
          }
        }),
      );
    };

    const stopTasks = () => {
      tasks.forEach((task) => {
        try {
          task.cancel();
        } catch {
          // Already settled.
        }
      });
      tasks = [];
    };

    // The column rather than the scroll box: its width is already inset by the
    // padding and clamped by max-w, which is exactly what a page is drawn at.
    const column = columnRef.current;
    if (!column) return undefined;

    // Drawn outright rather than waiting on the observer's first callback: a
    // backgrounded tab can withhold those indefinitely, and the pages would sit
    // blank until something resized them.
    drawnAt = column.clientWidth;
    draw(drawnAt);

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      if (Math.abs(width - drawnAt) < REDRAW_THRESHOLD) return;
      drawnAt = width;
      stopTasks();
      draw(width);
    });
    observer.observe(column);

    return () => {
      cancelled = true;
      observer.disconnect();
      stopTasks();
    };
  }, [status, pages]);

  return (
    <div className="h-full overflow-y-auto overscroll-contain bg-canvas-2 p-3 md:p-5">
      {status === "error" ? (
        // Falls back to the browser's own PDF handling rather than to a dead
        // end: on a phone that shows the first page and no further, which is
        // still better than showing nothing at all.
        <div className="flex h-full flex-col gap-3">
          <iframe
            src={`${file}#view=FitH`}
            title="Résumé — Wence Benierem Tongol"
            className="min-h-0 w-full flex-1 rounded-lg border border-line bg-white"
          />
          <p className="text-center text-xs text-muted">
            This browser can&apos;t page through the résumé here
            {reason ? ` (${reason})` : ""}.{" "}
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Open both pages
            </a>{" "}
            or{" "}
            <a href={file} download={fileName} className="text-accent underline">
              download
            </a>
            .
          </p>
        </div>
      ) : (
        <div ref={columnRef} className="mx-auto flex max-w-3xl flex-col gap-3">
          {status === "loading" && (
            <p className="py-12 text-center font-mono text-xs tracking-[0.2em] text-faint">
              loading résumé…
            </p>
          )}

          {Array.from({ length: pages }, (unused, index) => (
            <canvas
              key={index}
              ref={(element) => {
                canvasRefs.current[index] = element;
              }}
              role="img"
              aria-label={`Résumé page ${index + 1} of ${pages}`}
              className="block h-auto w-full rounded-lg border border-line bg-white"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumePages;
