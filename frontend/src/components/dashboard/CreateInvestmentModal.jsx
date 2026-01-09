import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from "../../lib/api";
import { Plus } from 'lucide-react';

export default function CreateInvestmentModal({ onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    plan: 'Starter',
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/investments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['investments']);
      queryClient.invalidateQueries(['dashboard']);
      setIsOpen(false);
      setFormData({ amount: '', plan: 'Starter' });
      setError('');
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create investment');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    mutation.mutate({
      amount: parseFloat(formData.amount),
      plan: formData.plan,
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Investment
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-dark rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">Create New Investment</h2>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-md bg-secondary border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Plan
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-4 py-2 rounded-md bg-secondary border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Starter">Starter (1% daily, 30 days)</option>
                  <option value="Pro">Pro (1.5% daily, 60 days)</option>
                  <option value="Premium">Premium (2% daily, 90 days)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setError('');
                    setFormData({ amount: '', plan: 'Starter' });
                  }}
                  className="flex-1 py-2 rounded-md bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {mutation.isPending ? 'Creating...' : 'Create Investment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

