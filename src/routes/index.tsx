import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  parseWhatsAppExport,
  groupByDate,
  formatGroupDate,
  avatarColor,
  initials,
  type ChatMessage,
} from "@/lib/whatsapp-parser";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marque — WhatsApp Chat Organizer" },
      {
        name: "description",
        content:
          "Import a WhatsApp chat export, organize messages with labels, save what matters, and turn messages into to-dos.",
      },
      { property: "og:title", content: "Marque — WhatsApp Chat Organizer" },
      {
        property: "og:description",
        content:
          "Import a WhatsApp chat export, organize messages with labels, save what matters, and turn messages into to-dos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

interface Label {
  id: string;
  name: string;
  color: string; // token key
}

interface Todo {
  id: string;
  text: string;
  done: boolean;
  messageId?: string | undefined;
  createdAt: number;
}

const LABEL_STYLES: Record<string, { dot: string; chip: string }> = {
  brand: {
    dot: "bg-brand",
    chip: "bg-brand/12 text-brand-strong",
  },
  green: {
    dot: "bg-label-green",
    chip: "bg-label-green/15 text-label-green-ink",
  },
  rust: {
    dot: "bg-label-rust",
    chip: "bg-label-rust/15 text-label-rust-ink",
  },
  slate: {
    dot: "bg-label-slate",
    chip: "bg-label-slate/20 text-label-slate-ink",
  },
};

const DEFAULT_LABELS: Label[] = [
  { id: "important", name: "Important", color: "brand" },
  { id: "client", name: "Client", color: "green" },
  { id: "followup", name: "Follow-up", color: "rust" },
];

const LS_KEY = "marque-state-v1";

interface PersistedState {
  labels: Label[];
  messageLabels: Record<string, string[]>;
  savedIds: string[];
  todos: Todo[];
}

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    // ignore
  }
  return {
    labels: DEFAULT_LABELS,
    messageLabels: {},
    savedIds: [],
    todos: [],
  };
}

function Index() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSender, setActiveSender] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [labelPickerFor, setLabelPickerFor] = useState<string | null>(null);
  const [newLabelName, setNewLabelName] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [persisted, setPersisted] = useState<PersistedState>(() =>
    typeof window === "undefined"
      ? { labels: DEFAULT_LABELS, messageLabels: {}, savedIds: [], todos: [] }
      : loadPersisted(),
  );

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(persisted));
  }, [persisted]);

  useEffect(() => {
    fetch("/chat-export.txt")
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((text) => setMessages(parseWhatsAppExport(text)))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  const senders = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of messages) {
      if (m.sender) counts.set(m.sender, (counts.get(m.sender) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s);
  }, [messages]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (activeSender && m.sender !== activeSender) return false;
      if (showSavedOnly && !persisted.savedIds.includes(m.id)) return false;
      if (activeLabel && !(persisted.messageLabels[m.id] ?? []).includes(activeLabel))
        return false;
      if (q && !m.text.toLowerCase().includes(q) && !(m.sender ?? "").toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [messages, search, activeSender, activeLabel, showSavedOnly, persisted]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const labelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ids of Object.values(persisted.messageLabels)) {
      for (const id of ids) counts[id] = (counts[id] ?? 0) + 1;
    }
    return counts;
  }, [persisted.messageLabels]);

  const savedMessages = useMemo(
    () => messages.filter((m) => persisted.savedIds.includes(m.id)),
    [messages, persisted.savedIds],
  );

  function toggleLabel(messageId: string, labelId: string) {
    setPersisted((p) => {
      const current = p.messageLabels[messageId] ?? [];
      const next = current.includes(labelId)
        ? current.filter((l) => l !== labelId)
        : [...current, labelId];
      return { ...p, messageLabels: { ...p.messageLabels, [messageId]: next } };
    });
  }

  function toggleSave(messageId: string) {
    setPersisted((p) => ({
      ...p,
      savedIds: p.savedIds.includes(messageId)
        ? p.savedIds.filter((id) => id !== messageId)
        : [...p.savedIds, messageId],
    }));
  }

  function addTodo(text: string, messageId?: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPersisted((p) => ({
      ...p,
      todos: [
        { id: `t${Date.now()}`, text: trimmed, done: false, messageId, createdAt: Date.now() },
        ...p.todos,
      ],
    }));
  }

  function toggleTodo(id: string) {
    setPersisted((p) => ({
      ...p,
      todos: p.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }

  function removeTodo(id: string) {
    setPersisted((p) => ({ ...p, todos: p.todos.filter((t) => t.id !== id) }));
  }

  function addLabel() {
    const name = newLabelName.trim();
    if (!name) return;
    const colors = ["brand", "green", "rust", "slate"];
    setPersisted((p) => ({
      ...p,
      labels: [
        ...p.labels,
        {
          id: `l${Date.now()}`,
          name,
          color: colors[p.labels.length % colors.length] ?? "brand",
        },
      ],
    }));
    setNewLabelName("");
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      setMessages(parseWhatsAppExport(text));
      setActiveSender(null);
      setSearch("");
    });
    e.target.value = "";
  }

  const openTodos = persisted.todos.filter((t) => !t.done);

  return (
    <div className="min-h-screen bg-paper bg-[radial-gradient(1100px_560px_at_8%_-10%,oklch(0.88_0.02_180)_0%,transparent_60%),radial-gradient(900px_480px_at_102%_0%,oklch(0.9_0.03_80)_0%,transparent_55%),radial-gradient(760px_420px_at_92%_105%,oklch(0.88_0.015_200)_0%,transparent_55%)] font-body text-ink antialiased">
      <header className="flex items-center justify-between bg-white/50 px-6 py-3.5 ring-1 ring-black/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-lg bg-brand text-[13px] font-semibold text-white ring-1 ring-black/5">
            M
          </div>
          <div>
            <div className="font-display text-[15px] font-medium leading-none tracking-tight">
              Marque<span className="text-brand">.</span>
            </div>
            <div className="mt-0.5 text-[11px] text-ink/45">Chat correspondence desk</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[12px] text-ink/50 sm:inline">
            {messages.length.toLocaleString()} messages
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="h-8 rounded-lg bg-brand px-3.5 text-[13px] font-medium text-white ring-1 ring-brand/60 transition-colors hover:bg-brand-strong"
          >
            Upload .txt
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1200px] gap-5 px-6 py-6">
        {/* Main chat panel */}
        <section className="min-w-0 flex-1 rounded-[14px] bg-white/55 ring-1 ring-black/5 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-ink/5 px-4 py-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages, senders, case numbers…"
              className="h-8 flex-1 rounded-lg bg-white/60 px-3 text-[13px] text-ink ring-1 ring-black/5 outline-none placeholder:text-ink/40 focus:ring-brand/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-b border-ink/5 px-4 py-2.5">
            <FilterChip
              active={activeSender === null && !showSavedOnly}
              onClick={() => {
                setActiveSender(null);
                setShowSavedOnly(false);
              }}
            >
              All
            </FilterChip>
            <FilterChip
              active={showSavedOnly}
              onClick={() => {
                setShowSavedOnly(!showSavedOnly);
                setActiveSender(null);
              }}
            >
              Saved
            </FilterChip>
            {senders.slice(0, 8).map((s) => (
              <FilterChip
                key={s}
                active={activeSender === s}
                onClick={() => {
                  setActiveSender(activeSender === s ? null : s);
                  setShowSavedOnly(false);
                }}
              >
                {s}
              </FilterChip>
            ))}
          </div>

          {activeLabel && (
            <div className="flex items-center gap-2 border-b border-ink/5 bg-brand/5 px-4 py-2">
              <span className="text-[12px] text-ink/60">
                Filtering by label:{" "}
                <strong>{persisted.labels.find((l) => l.id === activeLabel)?.name}</strong>
              </span>
              <button
                onClick={() => setActiveLabel(null)}
                className="text-[12px] font-medium text-brand hover:underline"
              >
                Clear
              </button>
            </div>
          )}

          <div className="max-h-[calc(100vh-260px)] overflow-y-auto">
            {loading && (
              <div className="px-4 py-10 text-center text-[13px] text-ink/40">
                Loading your chat…
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="px-4 py-10 text-center text-[13px] text-ink/40">
                No messages match. Try clearing filters or upload a WhatsApp .txt export.
              </div>
            )}
            {[...groups.entries()].map(([date, msgs]) => (
              <div key={date}>
                <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-ink/5 bg-white/70 px-4 py-2.5 backdrop-blur-md">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-ink/45">
                    {formatGroupDate(msgs[0]?.timestamp ?? 0)}
                  </span>
                  <span className="h-px flex-1 bg-ink/10" />
                  <span className="text-[10px] uppercase tracking-[0.14em] text-ink/45">
                    {msgs.length} messages
                  </span>
                </div>
                <div className="divide-y divide-ink/5 px-4 py-1">
                  {msgs.map((m) => (
                    <MessageRow
                      key={m.id}
                      message={m}
                      labels={persisted.labels}
                      assignedLabels={persisted.messageLabels[m.id] ?? []}
                      isSaved={persisted.savedIds.includes(m.id)}
                      pickerOpen={labelPickerFor === m.id}
                      onTogglePicker={() =>
                        setLabelPickerFor(labelPickerFor === m.id ? null : m.id)
                      }
                      onToggleLabel={(labelId) => toggleLabel(m.id, labelId)}
                      onToggleSave={() => toggleSave(m.id)}
                      onAddTodo={() => addTodo(m.text.split("\n")[0] ?? m.text, m.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-ink/5 px-4 py-2.5">
            <span className="text-[11px] text-ink/45">
              {filtered.length.toLocaleString()} shown · {persisted.savedIds.length} saved ·{" "}
              {openTodos.length} open to-dos
            </span>
            <span className="text-[11px] text-ink/45">
              Hover a message to label, save, or add a task
            </span>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="hidden w-[320px] shrink-0 space-y-4 lg:block">
          <div className="rounded-[14px] bg-white/55 p-4 ring-1 ring-black/5 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-[13px] font-medium tracking-tight">Labels</span>
              <span className="text-[11px] text-ink/40">{persisted.labels.length} labels</span>
            </div>
            <div className="space-y-2">
              {persisted.labels.map((label) => {
                const style = LABEL_STYLES[label.color] ?? LABEL_STYLES["brand"]!;
                return (
                  <button
                    key={label.id}
                    onClick={() =>
                      setActiveLabel(activeLabel === label.id ? null : label.id)
                    }
                    className={`flex w-full items-center gap-2.5 rounded-md px-1.5 py-1 text-left text-[13px] transition-colors ${
                      activeLabel === label.id ? "bg-brand/10" : "hover:bg-ink/5"
                    }`}
                  >
                    <span
                      className={`size-2.5 shrink-0 rounded-full ring-1 ring-black/10 ${style.dot}`}
                    />
                    {label.name}
                    <span className="ml-auto text-[11px] text-ink/40">
                      {labelCounts[label.id] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-1.5">
              <input
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLabel()}
                placeholder="New label…"
                className="h-7 min-w-0 flex-1 rounded-md bg-white/60 px-2 text-[12px] ring-1 ring-black/5 outline-none placeholder:text-ink/40 focus:ring-brand/40"
              />
              <button
                onClick={addLabel}
                className="h-7 rounded-md bg-ink px-2.5 text-[12px] font-medium text-white hover:bg-ink/85"
              >
                Add
              </button>
            </div>
          </div>

          <div className="rounded-[14px] bg-white/55 p-4 ring-1 ring-black/5 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-[13px] font-medium tracking-tight">Saved</span>
              <span className="text-[11px] text-ink/40">{savedMessages.length}</span>
            </div>
            <div className="space-y-2.5">
              {savedMessages.length === 0 && (
                <p className="text-[12px] text-ink/40">
                  Nothing saved yet. Hover a message and press Save.
                </p>
              )}
              {savedMessages.slice(0, 8).map((m) => (
                <div key={m.id} className="group flex items-start gap-2 text-[12px] text-ink/70">
                  <span className="mt-0.5 shrink-0 text-brand">●</span>
                  <span className="line-clamp-2 min-w-0 flex-1">
                    {m.text.split("\n")[0]}
                  </span>
                  <button
                    onClick={() => toggleSave(m.id)}
                    className="shrink-0 text-ink/30 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] bg-brand/10 p-4 ring-1 ring-black/5 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-[13px] font-medium tracking-tight text-brand-strong">
                To-do · from messages
              </span>
              <span className="text-[11px] text-brand-strong/60">{openTodos.length} open</span>
            </div>
            <div className="space-y-3">
              {persisted.todos.length === 0 && (
                <p className="text-[12px] text-ink/40">
                  No tasks yet. Hover a message and press “Add task”.
                </p>
              )}
              {persisted.todos.map((t) => (
                <div key={t.id} className="group flex gap-2.5">
                  <button
                    onClick={() => toggleTodo(t.id)}
                    className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-[5px] text-[10px] ${
                      t.done
                        ? "bg-brand text-white"
                        : "bg-white/60 ring-1 ring-brand/40 hover:ring-brand"
                    }`}
                  >
                    {t.done ? "✓" : ""}
                  </button>
                  <div
                    className={`min-w-0 flex-1 text-[12px] text-pretty ${
                      t.done ? "text-ink/40 line-through" : "text-ink/75"
                    }`}
                  >
                    {t.text}
                  </div>
                  <button
                    onClick={() => removeTodo(t.id)}
                    className="shrink-0 text-ink/30 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-7 rounded-full px-3 text-[12px] transition-colors ${
        active
          ? "bg-ink font-medium text-white"
          : "bg-white/60 text-ink/60 ring-1 ring-black/5 hover:bg-white/80"
      }`}
    >
      {children}
    </button>
  );
}

function MessageRow({
  message,
  labels,
  assignedLabels,
  isSaved,
  pickerOpen,
  onTogglePicker,
  onToggleLabel,
  onToggleSave,
  onAddTodo,
}: {
  message: ChatMessage;
  labels: Label[];
  assignedLabels: string[];
  isSaved: boolean;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  onToggleLabel: (labelId: string) => void;
  onToggleSave: () => void;
  onAddTodo: () => void;
}) {
  if (!message.sender) {
    return (
      <div className="py-2 text-center text-[11px] italic text-ink/35">{message.text}</div>
    );
  }
  return (
    <div className="group relative flex gap-3 py-3">
      <div
        className="grid size-9 shrink-0 place-items-center rounded-lg text-[12px] font-semibold text-ink/70 ring-1 ring-black/5"
        style={{ backgroundColor: avatarColor(message.sender) }}
      >
        {initials(message.sender)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[13px] font-medium">{message.sender}</span>
          <span className="shrink-0 text-[11px] text-ink/40">{message.time}</span>
        </div>
        {message.isMedia ? (
          <p className="max-w-[56ch] text-[13px] italic leading-5 text-ink/40">
            📎 Media message
          </p>
        ) : (
          <p className="max-w-[56ch] whitespace-pre-wrap text-[13px] leading-5 text-pretty text-ink/70">
            {message.text}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {assignedLabels.map((labelId) => {
            const label = labels.find((l) => l.id === labelId);
            if (!label) return null;
            const style = LABEL_STYLES[label.color] ?? LABEL_STYLES["brand"]!;
            return (
              <span
                key={labelId}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${style.chip}`}
              >
                {label.name}
              </span>
            );
          })}
          {isSaved && <span className="text-[11px] font-medium text-brand">● Saved</span>}
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute right-0 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onTogglePicker}
          className="h-6 rounded-md bg-white px-2 text-[11px] font-medium text-ink/60 ring-1 ring-black/10 hover:bg-white/90"
        >
          Label
        </button>
        <button
          onClick={onToggleSave}
          className="h-6 rounded-md bg-white px-2 text-[11px] font-medium text-ink/60 ring-1 ring-black/10 hover:bg-white/90"
        >
          {isSaved ? "Unsave" : "Save"}
        </button>
        <button
          onClick={onAddTodo}
          className="h-6 rounded-md bg-white px-2 text-[11px] font-medium text-ink/60 ring-1 ring-black/10 hover:bg-white/90"
        >
          Add task
        </button>
      </div>

      {/* Label picker */}
      {pickerOpen && (
        <div className="absolute right-0 top-9 z-20 w-44 rounded-lg bg-white p-1.5 shadow-lg ring-1 ring-black/10">
          {labels.map((label) => {
            const style = LABEL_STYLES[label.color] ?? LABEL_STYLES["brand"]!;
            const active = assignedLabels.includes(label.id);
            return (
              <button
                key={label.id}
                onClick={() => onToggleLabel(label.id)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] hover:bg-ink/5"
              >
                <span className={`size-2 rounded-full ${style.dot}`} />
                {label.name}
                {active && <span className="ml-auto text-brand">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
