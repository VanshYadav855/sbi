import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PIPELINE = ['Observe', 'Understand', 'Predict', 'Act', 'Protect'];

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('sbi_auth', 'true');
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#0B0F1A' }}
    >
      <div className="text-center mb-10 max-w-lg">
        <h1 className="font-display font-bold text-5xl text-saffron tracking-tight">SahayakAI</h1>
        <p className="text-sm text-muted mt-2 font-body">SBI Internal Tool · GFF 2026</p>
        <p className="text-muted mt-6 text-sm leading-relaxed">
          AI-powered banking companion for SBI branch officers
        </p>
        <div className="flex flex-wrap items-center justify-center gap-1 mt-5 text-xs text-muted">
          {PIPELINE.map((step, i) => (
            <span key={step} className="flex items-center gap-1">
              <span className="px-2.5 py-1 rounded-full border border-border bg-surface/50">{step}</span>
              {i < PIPELINE.length - 1 && <span className="text-teal/50">→</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[400px] rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <h2 className="font-display font-semibold text-lg text-text-primary mb-5">
          Branch Officer Login
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider font-mono">
              Officer ID
            </label>
            <input
              readOnly
              value="SBI-NGP-2847"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-elevated/50 text-sm text-text-primary cursor-default"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider font-mono">
              Branch
            </label>
            <input
              readOnly
              value="Nagpur Main Branch"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-elevated/50 text-sm text-text-primary cursor-default"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider font-mono">
              Officer Name
            </label>
            <input
              readOnly
              value="Amit Oberoi"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-elevated/50 text-sm text-text-primary cursor-default"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-saffron to-orange-500 text-white font-medium text-sm shadow-lg shadow-saffron/25 hover:shadow-saffron/40 hover:scale-[1.01] transition-all"
        >
          Access Dashboard
          <ArrowRight size={18} />
        </button>

        <p className="text-[11px] text-muted text-center mt-4">
          Demo credentials pre-filled · SBI Internal Access Only
        </p>
      </div>
    </div>
  );
}
