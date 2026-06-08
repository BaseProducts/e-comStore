import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BASE_URL, authHeaders } from "@/lib/utils";
import { Trash2, Edit } from "lucide-react";

export const AdminFaqs = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [form, setForm] = useState({ question: "", answer: "", isVisible: true, order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/faqs?admin=true`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${BASE_URL}/api/faqs/${editingId}` : `${BASE_URL}/api/faqs`;
      
      const res = await fetch(url, {
        method,
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        toast.success(editingId ? "FAQ updated" : "FAQ created");
        setForm({ question: "", answer: "", isVisible: true, order: 0 });
        setEditingId(null);
        fetchFaqs();
      }
    } catch (error) {
      toast.error("Failed to save FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/faqs/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (res.ok) {
        toast.success("FAQ deleted");
        fetchFaqs();
      }
    } catch (error) {
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[#E8E5E0]">
        <h3 className="text-lg font-medium text-[#1A1A1A] mb-4">{editingId ? "Edit FAQ" : "Add FAQ"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <input required type="text" className="w-full border p-2 text-sm" value={form.question} onChange={e => setForm({...form, question: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Answer</label>
            <textarea required rows={4} className="w-full border p-2 text-sm" value={form.answer} onChange={e => setForm({...form, answer: e.target.value})}></textarea>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isVisible} onChange={e => setForm({...form, isVisible: e.target.checked})} />
              Visible
            </label>
            <label className="flex items-center gap-2 text-sm">
              Order:
              <input type="number" min="0" className="w-16 border p-1" value={form.order} onChange={e => setForm({...form, order: Math.max(0, Number(e.target.value))})} />
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-[#1A1A1A] text-white px-4 py-2 text-sm font-medium">{editingId ? "Update" : "Add"}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ question: "", answer: "", isVisible: true, order: 0 }); }} className="bg-gray-200 px-4 py-2 text-sm font-medium">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white border border-[#E8E5E0] overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#FAF9F7] text-[#8A8A8A] font-medium border-b border-[#E8E5E0]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Visible</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map(faq => (
              <tr key={faq.id} className="border-b border-[#E8E5E0]">
                <td className="px-4 py-3">{faq.order}</td>
                <td className="px-4 py-3">{faq.question}</td>
                <td className="px-4 py-3">{faq.isVisible ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button onClick={() => { setEditingId(faq.id); setForm(faq); }} className="p-1.5 bg-blue-50 text-blue-600 rounded"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(faq.id)} className="p-1.5 bg-red-50 text-red-600 rounded"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
