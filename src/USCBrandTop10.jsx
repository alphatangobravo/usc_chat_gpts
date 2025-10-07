import React from "react";
import { Trophy, Users, MessageSquare, BarChartBig, ExternalLink } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";
import SOURCE_DATA from "./data/top10.json";

// Brand tokens
const brand = {
  garnet: "#73000a",
  black: "#000000",
  white: "#ffffff",
  neutral90: "#363636",
  neutral10: "#ECECEC",
  sandstorm: "#FFF2E3",
};

const MIN_UNIQUE_USERS = 3;

function computeTop10(rows) {
  const sorted = [...rows].sort((a, b) => (b.messages_workspace ?? 0) - (a.messages_workspace ?? 0));
  const filtered = sorted.filter(r => (r.unique_messagers_workspace ?? 0) >= MIN_UNIQUE_USERS);
  return filtered.slice(0, 10);
}

function k(n) { return n?.toLocaleString?.() ?? "–"; }

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border shadow-sm p-4 bg-white" style={{ borderColor: brand.neutral10 }}>
      <div className="flex items-center gap-2 text-xs" style={{ color: brand.neutral90 }}>
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="mt-1 text-2xl font-semibold" style={{ color: brand.black }}>{value}</div>
      {sub && <div className="mt-1 text-xs" style={{ color: brand.neutral90 }}>{sub}</div>}
    </div>
  );
}

function TopChart({ data }) {
  const chartData = data.map(d => ({ name: d.gpt_name, messages: d.messages_workspace }));
  return (
    <div className="rounded-2xl border shadow-sm p-4 bg-white" style={{ borderColor: brand.neutral10 }}>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: brand.black }}>
        <BarChartBig className="h-4 w-4" /> Messages by GPT (Top 10)
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip formatter={(v) => k(v)} />
            <Bar dataKey="messages" name="Messages" fill={brand.garnet} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Leaderboard({ data }) {
  return (
    <div className="rounded-2xl border shadow-sm p-4 bg-white" style={{ borderColor: brand.neutral10 }}>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: brand.black }}>
        <Trophy className="h-4 w-4" /> Top 10 Leaderboard
      </div>
      <div className="divide-y" style={{ borderColor: brand.neutral10 }}>
        {data.map((row, idx) => (
          <div key={row.gpt_name} className="flex items-center justify-between py-2 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-6 text-sm tabular-nums" style={{ color: brand.neutral90 }}>{idx + 1}</div>
              {row.gpt_url ? (
                <a href={row.gpt_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline flex items-center gap-1" style={{ color: brand.black }}>
                  {row.gpt_name}
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              ) : (
                <div className="text-sm font-medium" style={{ color: brand.black }}>{row.gpt_name}</div>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1" title="Messages">
                <MessageSquare className="h-4 w-4" />
                <span className="tabular-nums">{k(row.messages_workspace)}</span>
              </div>
              <div className="flex items-center gap-1" title="Unique users">
                <Users className="h-4 w-4" />
                <span className="tabular-nums">{k(row.unique_messagers_workspace)}</span>
              </div>
              <span className="rounded-full px-2 py-1 text-xs" style={{ background: brand.sandstorm, color: brand.black }}>
                {Number(row.messages_per_user ?? (row.messages_workspace / Math.max(1, row.unique_messagers_workspace))).toFixed(1)} msg/user
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function USCBrandTop10() {
  const data = computeTop10(SOURCE_DATA);
  const totals = data.reduce((acc, d) => {
    acc.messages += d.messages_workspace || 0;
    acc.users += d.unique_messagers_workspace || 0;
    return acc;
  }, { messages: 0, users: 0 });

  const avgMpu = totals.users ? (totals.messages / totals.users).toFixed(1) : "–";

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8" style={{ background: brand.white }}>
      <div className="mb-6 flex flex-col gap-2">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl tracking-tight"
          style={{ color: brand.garnet, fontFamily: "Impact, 'Arial Black', system-ui, sans-serif", letterSpacing: "0.5px" }}>
          UNIVERSITY OF SOUTH CAROLINA — TOP UTILIZED GPTS
        </motion.h1>
        <div className="text-sm" style={{ color: brand.neutral90 }}>
          Showing top ten by messages (descending), excluding GPTs with ≤ 2 unique users.
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Stat icon={MessageSquare} label="Total messages (Top 10)" value={k(totals.messages)} />
        <Stat icon={Users} label="Total unique users (Top 10)" value={k(totals.users)} />
        <Stat icon={Trophy} label="Avg messages per user" value={avgMpu} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <TopChart data={data} />
        <Leaderboard data={data} />
      </div>

      <div className="mt-6 text-xs" style={{ color: brand.neutral90 }}>
        Notes: Colors and typography follow USC brand guidance (Garnet/Black/White + neutrals; Impact/Arial/Georgia as licensed font substitutes).
      </div>
    </div>
  );
}
