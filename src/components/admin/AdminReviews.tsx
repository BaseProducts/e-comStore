import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BASE_URL, authHeaders } from "@/lib/utils";
import { Trash2, Check, X } from "lucide-react";

export const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/reviews?admin=true`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/${id}/status`, {
        method: "PUT",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Review ${status}`);
        fetchReviews();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (res.ok) {
        toast.success("Review deleted");
        fetchReviews();
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E8E5E0] overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#FAF9F7] text-[#8A8A8A] font-medium border-b border-[#E8E5E0]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3 max-w-xs">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E5E0]">
            {reviews.map(review => (
              <tr key={review.id}>
                <td className="px-4 py-3 font-medium text-[#1A1A1A]">{review.name}</td>
                <td className="px-4 py-3 text-[#6B6B6B]">{review.location}</td>
                <td className="px-4 py-3 max-w-xs truncate text-[#6B6B6B]" title={review.message}>{review.message}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-[10px] uppercase tracking-wide font-medium rounded-full ${
                    review.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                    review.status === 'rejected' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  {review.status !== 'approved' && (
                    <button onClick={() => updateStatus(review.id, 'approved')} className="p-1.5 bg-emerald-50 text-emerald-600 rounded" title="Approve">
                      <Check size={14} />
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button onClick={() => updateStatus(review.id, 'rejected')} className="p-1.5 bg-amber-50 text-amber-600 rounded" title="Reject">
                      <X size={14} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(review.id)} className="p-1.5 bg-red-50 text-red-600 rounded" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#8A8A8A]">No reviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
