export interface ChatMessage {
  id: string;
  date: string; // e.g. "7/24/26"
  time: string; // e.g. "12:27 PM"
  timestamp: number;
  sender: string | null; // null = system message
  text: string;
  isMedia: boolean;
}

const LINE_RE =
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2})\s?(AM|PM|am|pm)?\s+-\s+(.*)$/;

function toTimestamp(
  date: string,
  time: string,
  meridiem?: string,
): number {
  const [m, d, y] = date.split("/").map(Number);
  const year = y < 100 ? 2000 + y : y;
  let [hh, mm] = time.split(":").map(Number);
  if (meridiem) {
    const up = meridiem.toUpperCase();
    if (up === "PM" && hh !== 12) hh += 12;
    if (up === "AM" && hh === 12) hh = 0;
  }
  return new Date(year, m - 1, d, hh, mm).getTime();
}

export function parseWhatsAppExport(raw: string): ChatMessage[] {
  const lines = raw.split(/\r?\n/);
  const messages: ChatMessage[] = [];
  let counter = 0;

  for (const line of lines) {
    const match = line.match(LINE_RE);
    if (match) {
      const [, date, time, meridiem, rest] = match;
      const sep = rest.indexOf(": ");
      let sender: string | null = null;
      let text = rest;
      if (sep > 0 && sep < 60) {
        sender = rest.slice(0, sep).trim();
        text = rest.slice(sep + 2);
      }
      text = text.replace(/\s?<This message was edited>\s?/g, "").trim();
      const isMedia = text === "<Media omitted>";
      messages.push({
        id: `m${counter++}`,
        date,
        time: meridiem ? `${time} ${meridiem.toUpperCase()}` : time,
        timestamp: toTimestamp(date, time, meridiem),
        sender,
        text,
        isMedia,
      });
    } else if (messages.length > 0 && line.trim()) {
      // continuation of the previous message
      messages[messages.length - 1].text += "\n" + line;
    }
  }
  return messages;
}

export function groupByDate(messages: ChatMessage[]): Map<string, ChatMessage[]> {
  const groups = new Map<string, ChatMessage[]>();
  for (const msg of messages) {
    const key = msg.date;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(msg);
  }
  return groups;
}

export function formatGroupDate(date: string, timestamp: number): string {
  const d = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const pretty = d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  if (sameDay(d, today)) return `Today · ${weekday} ${pretty}`;
  if (sameDay(d, yesterday)) return `Yesterday · ${weekday} ${pretty}`;
  return `${weekday} ${pretty}`;
}

const AVATAR_COLORS = ["#f0d3a3", "#cfe0e6", "#d9d4bd", "#cdd8e3", "#e6cfcf", "#d3e0cf"];

export function avatarColor(sender: string): string {
  let hash = 0;
  for (let i = 0; i < sender.length; i++) hash = (hash * 31 + sender.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function initials(sender: string): string {
  const words = sender.replace(/[^\p{L}\p{N} ]/gu, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
