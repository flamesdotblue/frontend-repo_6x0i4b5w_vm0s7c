import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function SettingsPanel({ open, onClose, value, onChange }) {
  const [form, setForm] = useState(value);

  useEffect(() => {
    setForm(value);
  }, [value, open]);

  const handleSave = () => {
    onChange(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur p-6 m-0 sm:m-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Settings</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-white/10 text-white/80">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-white/70">User ID</label>
            <input
              type="text"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="e.g. pavitra"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70">Temperature</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: Number(e.target.value) })}
                className="mt-2 w-full"
              />
              <div className="mt-1 text-xs text-white/60">{form.temperature.toFixed(1)}</div>
            </div>
            <div>
              <label className="block text-sm text-white/70">Model</label>
              <select
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="gpt-4o">gpt-4o</option>
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="llama-3.1-70b">llama-3.1-70b</option>
                <option value="mistral-large">mistral-large</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70">Personality</label>
            <select
              value={form.persona}
              onChange={(e) => setForm({ ...form, persona: e.target.value })}
              className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="balanced">Balanced</option>
              <option value="creative">Creative</option>
              <option value="precise">Precise</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-white/10 hover:bg-white/15 text-white">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm rounded-md bg-white text-black hover:bg-white/90">Save</button>
        </div>
      </div>
    </div>
  );
}
