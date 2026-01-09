import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { TrendingUp, UserCheck } from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get referral code from URL: /register?ref=ABCDEF
  const refFromUrl = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: refFromUrl, // Initialize with URL code if present
  });

  const [referrerName, setReferrerName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch referrer name when component mounts or referralCode changes
  useEffect(() => {
    const fetchReferrer = async () => {
      if (formData.referralCode && formData.referralCode.length >= 6) {
        try {
          const response = await api.get(`/auth/referrer/${formData.referralCode}`);
          if (response.data.success) {
            setReferrerName(response.data.name);
          }
        } catch (err) {
          setReferrerName('Invalid referral code');
        }
      } else {
        setReferrerName('');
      }
    };

    fetchReferrer();
  }, [formData.referralCode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success) {
        login(response.data.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-dark rounded-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Register</h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-secondary border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-secondary border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 rounded-md bg-secondary border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Referral Section */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Referral Code (Optional)
            </label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="Enter referral code"
              className="w-full px-4 py-2 rounded-md bg-secondary border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary uppercase"
            />
            
            {/* Display Referrer Name UI */}
            {referrerName && (
              <div className={`mt-2 flex items-center gap-2 text-sm p-2 rounded ${
                referrerName === 'Invalid referral code' ? 'text-destructive bg-destructive/10' : 'text-primary bg-primary/10'
              }`}>
                <UserCheck className="w-4 h-4" />
                <span>{referrerName === 'Invalid referral code' ? referrerName : `You are being referred by: ${referrerName}`}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}