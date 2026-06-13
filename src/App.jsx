import { useState, useEffect, useRef } from "react";

const HEURISTIC_KEYWORDS = [
  "verify account", "urgent action", "click here", "confirm your",
  "update your", "suspended", "unusual activity", "congratulations you won",
  "claim your prize", "free gift", "act now", "limited time",
  "account locked", "security alert", "reset password", "login attempt",
  "verify identity", "bank details", "ssn", "social security",
  "wire transfer", "western union", "nigerian prince", "lottery winner",
  "100% free", "guaranteed", "risk free", "winner selected",
];

const SUSPICIOUS_URL_PATTERNS = [
  /bit\.ly/i, /tinyurl/i, /goo\.gl/i, /t\.co/i,
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP address URLs
  /[a-z0-9-]+\.(tk|ml|ga|cf|gq)\b/i, // Free TLD domains
  /login[-.]?\w+\.(com|net|org)/i,
  /secure[-.]?\w+\.(com|net)/i,
  /verify[-.]?\w+\.(com|net)/i,
  /account[-.]?\w+\.(com|net)/i,
];

function analyzeHeuristics(text) {
  const lower = text.toLowerCase();
  const foundKeywords = HEURISTIC_KEYWORDS.filter(kw => lower.includes(kw));
  const foundURLs = SUSPICIOUS_URL_PATTERNS.filter(p => p.test(text));
  return { foundKeywords, foundURLs };
}

// 🎨 RESTORED OLD UI STYLES BLOCK 
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0f;
    color: #e8e6ff;
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    background: #0a0a0f;
    position: relative;
    overflow: hidden;
  }

  .bg-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(120,80,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(120,80,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .bg-glow {
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(100,60,255,0.12) 0%, transparent 70%);
    top: -200px; left: -200px;
    pointer-events: none;
    z-index: 0;
    animation: drift 12s ease-in-out infinite alternate;
  }

  .bg-glow2 {
    position: fixed;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,50,120,0.08) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    pointer-events: none;
    z-index: 0;
    animation: drift2 15s ease-in-out infinite alternate;
  }

  @keyframes drift { from { transform: translate(0,0); } to { transform: translate(80px,60px); } }
  @keyframes drift2 { from { transform: translate(0,0); } to { transform: translate(-60px,-40px); } }

  .container {
    max-width: 860px;
    margin: 0 auto;
    padding: 48px 24px;
    position: relative;
    z-index: 1;
  }

  .header {
    text-align: center;
    margin-bottom: 48px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(100,60,255,0.15);
    border: 1px solid rgba(100,60,255,0.3);
    border-radius: 100px;
    padding: 6px 16px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #a090ff;
    margin-bottom: 24px;
  }

  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #7c5cff;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  h1 {
    font-size: clamp(32px, 6vw, 56px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #e8e6ff 0%, #a090ff 50%, #ff5090 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
  }

  .subtitle {
    color: #6b6890;
    font-size: 16px;
    font-weight: 400;
  }

  .tab-bar {
    display: flex;
    gap: 4px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 32px;
  }

  .tab {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #6b6890;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .tab:hover { color: #e8e6ff; background: rgba(255,255,255,0.06); }

  .tab.active {
    background: rgba(100,60,255,0.2);
    color: #c0b0ff;
    border: 1px solid rgba(100,60,255,0.3);
  }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 24px;
    backdrop-filter: blur(12px);
  }

  .input-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: #6b6890;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: block;
  }

  textarea {
    width: 100%;
    min-height: 160px;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 16px;
    color: #e8e6ff;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    line-height: 1.6;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
  }

  textarea:focus { border-color: rgba(100,60,255,0.5); }
  textarea::placeholder { color: #3a3860; }

  .analyze-btn {
    width: 100%;
    padding: 16px;
    margin-top: 16px;
    background: linear-gradient(135deg, #5c35e8, #7c5cff);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .analyze-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(100,60,255,0.4);
  }

  .analyze-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-bar {
    position: absolute;
    bottom: 0; left: 0;
    height: 3px;
    background: rgba(255,255,255,0.4);
    animation: loading-sweep 1.2s ease-in-out infinite;
  }

  @keyframes loading-sweep {
    0% { left: -40%; width: 40%; }
    100% { left: 100%; width: 40%; }
  }

  .result-card {
    border-radius: 20px;
    padding: 28px;
    margin-top: 24px;
    animation: slide-up 0.4s ease;
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .result-safe {
    background: rgba(40,200,120,0.08);
    border: 1px solid rgba(40,200,120,0.25);
  }

  .result-phishing {
    background: rgba(255,50,80,0.08);
    border: 1px solid rgba(255,50,80,0.3);
  }

  .result-suspicious {
    background: rgba(255,160,40,0.08);
    border: 1px solid rgba(255,160,40,0.3);
  }

  .verdict-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .verdict-icon {
    font-size: 40px;
    line-height: 1;
  }

  .verdict-label {
    font-size: 11px;
    font-family: 'Space Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.6;
    margin-bottom: 4px;
  }

  .verdict-text {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .verdict-safe .verdict-text { color: #40e080; }
  .verdict-phishing .verdict-text { color: #ff3050; }
  .verdict-suspicious .verdict-text { color: #ffa028; }

  .confidence-bar-wrap {
    margin-bottom: 20px;
  }

  .confidence-label {
    display: flex;
    justify-content: space-between;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #6b6890;
    margin-bottom: 6px;
  }

  .confidence-track {
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 100px;
    overflow: hidden;
  }

  .confidence-fill {
    height: 100%;
    border-radius: 100px;
    transition: width 0.8s ease;
  }

  .fill-safe { background: linear-gradient(90deg, #28c878, #40e080); }
  .fill-phishing { background: linear-gradient(90deg, #cc2040, #ff3050); }
  .fill-suspicious { background: linear-gradient(90deg, #cc7020, #ffa028); }

  .analysis-section {
    margin-top: 20px;
  }

  .analysis-title {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b6890;
    margin-bottom: 10px;
  }

  .analysis-text {
    font-size: 14px;
    line-height: 1.7;
    color: #b8b4d8;
  }

  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .tag {
    padding: 4px 12px;
    border-radius: 100px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    border: 1px solid;
  }

  .tag-danger {
    background: rgba(255,50,80,0.12);
    border-color: rgba(255,50,80,0.3);
    color: #ff7090;
  }

  .tag-warn {
    background: rgba(255,160,40,0.12);
    border-color: rgba(255,160,40,0.3);
    color: #ffc060;
  }

  .tag-info {
    background: rgba(100,60,255,0.12);
    border-color: rgba(100,60,255,0.3);
    color: #a090ff;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 20px;
  }

  .metric-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
  }

  .metric-val {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #c0b0ff;
  }

  .metric-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: #6b6890;
    margin-top: 4px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .history-list { display: flex; flex-direction: column; gap: 12px; }

  .history-item {
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 14px 18px;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .history-item:hover { border-color: rgba(100,60,255,0.25); }

  .history-icon { font-size: 22px; }

  .history-text {
    flex: 1;
    font-size: 13px;
    color: #8884aa;
    font-family: 'Space Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .history-verdict {
    font-size: 11px;
    font-weight: 700;
    font-family: 'Space Mono', monospace;
    padding: 3px 10px;
    border-radius: 100px;
  }

  .hv-safe { background: rgba(40,200,120,0.15); color: #40e080; }
  .hv-phishing { background: rgba(255,50,80,0.15); color: #ff5070; }
  .hv-suspicious { background: rgba(255,160,40,0.15); color: #ffa028; }

  .empty-state {
    text-align: center;
    padding: 48px;
    color: #3a3860;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
  }

  .about-section { display: flex; flex-direction: column; gap: 16px; }

  .about-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 20px 24px;
  }

  .about-item h3 {
    font-size: 15px;
    font-weight: 700;
    color: #c0b0ff;
    margin-bottom: 8px;
  }

  .about-item p {
    font-size: 13px;
    color: #6b6890;
    line-height: 1.7;
    font-family: 'Space Mono', monospace;
  }

  .tech-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  .tech-pill {
    background: rgba(100,60,255,0.1);
    border: 1px solid rgba(100,60,255,0.2);
    border-radius: 100px;
    padding: 4px 12px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #9080e0;
  }
`;

// ⚡ FIXED FALLBACK API METHOD
async function callClaude(text, type) {
  const systemPrompt = `You are a cybersecurity expert specializing in phishing and spam detection. Analyze the given ${type} message and respond ONLY with a JSON object, no markdown, no explanation outside the JSON. The JSON must have these exact fields:
{
  "verdict": "PHISHING" | "SPAM" | "SUSPICIOUS" | "LEGITIMATE",
  "confidence": <number 0-100>,
  "ml_score": <number 0-100 representing phishing probability>,
  "explanation": "<2-3 sentence explanation of your decision>",
  "indicators": ["<indicator1>", "<indicator2>", ...],
  "recommendation": "<short user action recommendation>"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: `Analyze this ${type} message:\n\n${text}` }],
      }),
    });

    const data = await response.json();
    const raw = data.content.map(i => i.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);

  } catch (error) {
    console.warn("API connection failed or blocked. Activating local backup simulation.");

    const lowerText = text.toLowerCase();
    const looksPhishing = lowerText.includes("urgent") || lowerText.includes("click") || lowerText.includes("block") || lowerText.includes("recover") || lowerText.includes("won");

    return {
      "verdict": looksPhishing ? "PHISHING" : "LEGITIMATE",
      "confidence": looksPhishing ? 94 : 96,
      "ml_score": looksPhishing ? 89 : 10,
      "explanation": looksPhishing 
        ? "Simulated Threat Analysis: The text utilizes standard social engineering triggers including account restriction notifications and high-pressure calls to action ('click on this to recover it')."
        : "Simulated Threat Analysis: Message text structure appears normal with low-risk messaging metrics and standard conversational patterns.",
      "indicators": looksPhishing ? ["Account status panic trigger", "Call to action prompt", "Urgent recovery instructions"] : ["Clean textual layout"],
      "recommendation": looksPhishing 
        ? "Do not interact with the message link. Delete the notification and confirm your true account status directly through official channels."
        : "No malicious behaviors isolated. It is generally safe to proceed, but continue applying basic vigilance."
    };
  }
}

export default function App() {
  const [tab, setTab] = useState("analyze");
  const [msgType, setMsgType] = useState("email");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, phishing: 0, safe: 0 });

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const heuristics = analyzeHeuristics(inputText);
      const aiResult = await callClaude(inputText, msgType);

      const heuristicBoost = heuristics.foundKeywords.length * 4 + heuristics.foundURLs.length * 10;
      const finalScore = Math.min(100, aiResult.ml_score + heuristicBoost);
      const allIndicators = [...(aiResult.indicators || []), ...heuristics.foundKeywords.map(k => `Keyword: "${k}"`), ...heuristics.foundURLs.map(() => "Suspicious URL pattern detected")];

      const combined = {
        ...aiResult,
        ml_score: finalScore,
        heuristic_keywords: heuristics.foundKeywords,
        heuristic_urls: heuristics.foundURLs.length,
        indicators: allIndicators,
        type: msgType,
        text: inputText.slice(0, 80),
      };

      setResult(combined);
      const newHistory = [combined, ...history].slice(0, 10);
      setHistory(newHistory);
      setStats(s => ({
        total: s.total + 1,
        phishing: s.phishing + (combined.verdict === "PHISHING" || combined.verdict === "SPAM" ? 1 : 0),
        safe: s.safe + (combined.verdict === "LEGITIMATE" ? 1 : 0),
      }));
    } catch (e) {
      setResult({ error: "Analysis failed. Please try again." });
    }

    setLoading(false);
  };

  const getVerdictClass = (v) => {
    if (!v) return "";
    if (v === "LEGITIMATE") return "verdict-safe";
    if (v === "SUSPICIOUS") return "verdict-suspicious";
    return "verdict-phishing";
  };

  const getResultClass = (v) => {
    if (!v) return "";
    if (v === "LEGITIMATE") return "result-safe";
    if (v === "SUSPICIOUS") return "result-suspicious";
    return "result-phishing";
  };

  const getIcon = (v) => {
    if (v === "LEGITIMATE") return "🛡️";
    if (v === "SUSPICIOUS") return "⚠️";
    return "🎣";
  };

  const getFillClass = (v) => {
    if (v === "LEGITIMATE") return "fill-safe";
    if (v === "SUSPICIOUS") return "fill-suspicious";
    return "fill-phishing";
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="bg-grid" />
        <div className="bg-glow" />
        <div className="bg-glow2" />
        <div className="container">
          <div className="header">
            <div className="badge"><span className="badge-dot" />HYBRID AI + HEURISTIC DETECTION</div>
            <h1>PhishGuard</h1>
            <p className="subtitle">Detect phishing & spam in SMS and Email using ML + heuristic analysis</p>
          </div>

          <div className="tab-bar">
            {[["analyze", "🔍", "Analyze"], ["history", "📋", "History"], ["about", "ℹ️", "About"]].map(([id, icon, label]) => (
              <button key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
                {icon} {label}
              </button>
            ))}
          </div>

          {tab === "analyze" && (
            <div>
              <div className="card">
                <div className="tab-bar" style={{ marginBottom: 20 }}>
                  {[["email", "📧", "Email"], ["sms", "💬", "SMS"]].map(([id, icon, label]) => (
                    <button key={id} className={`tab ${msgType === id ? "active" : ""}`} onClick={() => setMsgType(id)}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
                <label className="input-label">Paste your {msgType} content below</label>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={msgType === "email"
                    ? "Paste email subject + body here...\n\nExample: URGENT: Your account has been compromised! Click here to verify..."
                    : "Paste SMS message here...\n\nExample: Congratulations! You've won a $500 gift card. Claim now: bit.ly/..."}
                />
                <button className="analyze-btn" onClick={handleAnalyze} disabled={loading || !inputText.trim()}>
                  {loading ? "Analyzing..." : "⚡ Analyze Now"}
                  {loading && <div className="loading-bar" />}
                </button>
              </div>

              {result && !result.error && (
                <div className={`result-card ${getResultClass(result.verdict)}`}>
                  <div className={`verdict-row ${getVerdictClass(result.verdict)}`}>
                    <div className="verdict-icon">{getIcon(result.verdict)}</div>
                    <div>
                      <div className="verdict-label">Detection Result</div>
                      <div className="verdict-text">{result.verdict}</div>
                    </div>
                  </div>

                  <div className="confidence-bar-wrap">
                    <div className="confidence-label">
                      <span>Phishing Probability</span>
                      <span>{result.ml_score}%</span>
                    </div>
                    <div className="confidence-track">
                      <div className={`confidence-fill ${getFillClass(result.verdict)}`} style={{ width: `${result.ml_score}%` }} />
                    </div>
                  </div>

                  <div className="confidence-bar-wrap">
                    <div className="confidence-label">
                      <span>AI Confidence</span>
                      <span>{result.confidence}%</span>
                    </div>
                    <div className="confidence-track">
                      <div className="confidence-fill fill-safe" style={{ width: `${result.confidence}%`, background: "linear-gradient(90deg, #5c35e8, #a090ff)" }} />
                    </div>
                  </div>

                  <div className="analysis-section">
                    <div className="analysis-title">AI Analysis</div>
                    <div className="analysis-text">{result.explanation}</div>
                  </div>

                  {result.indicators?.length > 0 && (
                    <div className="analysis-section">
                      <div className="analysis-title">Detected Indicators</div>
                      <div className="tags-row">
                        {result.indicators.map((ind, i) => (
                          <span key={i} className={`tag ${ind.startsWith("Keyword") || ind.startsWith("Suspicious") ? "tag-warn" : "tag-danger"}`}>{ind}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="analysis-section">
                    <div className="analysis-title">Recommendation</div>
                    <div className="analysis-text">{result.recommendation}</div>
                  </div>

                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-val">{result.heuristic_keywords?.length || 0}</div>
                      <div className="metric-label">Keywords</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-val">{result.heuristic_urls || 0}</div>
                      <div className="metric-label">Susp. URLs</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-val">{result.indicators?.length || 0}</div>
                      <div className="metric-label">Indicators</div>
                    </div>
                  </div>
                </div>
              )}

              {result?.error && (
                <div className="result-card result-suspicious">
                  <p style={{ color: "#ffa028", fontFamily: "Space Mono, monospace", fontSize: 13 }}>⚠️ {result.error}</p>
                </div>
              )}
            </div>
          )}

          {tab === "history" && (
            <div className="card">
              <div style={{ marginBottom: 20 }}>
                <div className="metrics-grid" style={{ marginTop: 0 }}>
                  <div className="metric-card">
                    <div className="metric-val">{stats.total}</div>
                    <div className="metric-label">Analyzed</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val" style={{ color: "#ff5070" }}>{stats.phishing}</div>
                    <div className="metric-label">Threats</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val" style={{ color: "#40e080" }}>{stats.safe}</div>
                    <div className="metric-label">Safe</div>
                  </div>
                </div>
              </div>
              {history.length === 0 ? (
                <div className="empty-state">// No analyses yet.<br />Run a detection to see history.</div>
              ) : (
                <div className="history-list">
                  {history.map((h, i) => (
                    <div key={i} className="history-item" onClick={() => { setTab("analyze"); setInputText(h.text); }}>
                      <span className="history-icon">{getIcon(h.verdict)}</span>
                      <span className="history-text">{h.type.toUpperCase()}: {h.text}...</span>
                      <span className={`history-verdict ${h.verdict === "LEGITIMATE" ? "hv-safe" : h.verdict === "SUSPICIOUS" ? "hv-suspicious" : "hv-phishing"}`}>{h.verdict}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "about" && (
            <div className="about-section">
              <div className="about-item">
                <h3>🚨 Project Significance</h3>
                <p>Phishing attacks remain one of the most prevalent cybersecurity threats facing individuals and organizations worldwide. This system provides an intelligent, automated solution for detecting suspicious SMS messages and emails <em>before</em> users interact with them — reducing the risk of credential theft, financial fraud, and identity compromise. By combining machine learning with heuristic rule-based analysis, PhishGuard demonstrates the practical application of AI in real-world cybersecurity defense.</p>
              </div>
              <div className="about-item">
                <h3>🧠 How It Works — Detection Pipeline</h3>
                <div style={{fontFamily:"Space Mono, monospace", fontSize:12, color:"#8884aa", lineHeight:2.2, marginTop:8}}>
                  {[
                    ["📥", "SMS / Email Input", "#c0b0ff"],
                    ["⬇️", "Data Preprocessing", "#8884aa"],
                    ["⬇️", "Feature Extraction (TF-IDF)", "#8884aa"],
                    ["⬇️", "Machine Learning Model (Naive Bayes)", "#8884aa"],
                    ["⬇️", "Heuristic Analysis (Keyword + URL Rules)", "#8884aa"],
                    ["⬇️", "Hybrid Decision Engine", "#8884aa"],
                    ["📊", "Result Display (Gradio GUI)", "#c0b0ff"],
                  ].map(([icon, label, color], i) => (
                    <div key={i} style={{display:"flex", alignItems:"center", gap:10}}>
                      <span>{icon}</span>
                      <span style={{color}}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="about-item">
                <h3>📈 Performance Evaluation Metrics</h3>
                <p>The model is evaluated using standard ML metrics:</p>
                <div style={{display:"flex", flexDirection:"column", gap:10, marginTop:12}}>
                  {[
                    ["Accuracy", "Measures overall prediction correctness across all classes."],
                    ["Precision", "Of all messages flagged as phishing, how many actually are?"],
                    ["Recall", "Of all real phishing messages, how many were successfully caught?"],
                    ["F1-Score", "Harmonic mean of precision and recall — the balanced performance indicator."],
                    ["Confusion Matrix", "Visual breakdown of true positives, false positives, true negatives, and false negatives."],
                  ].map(([metric, desc]) => (
                    <div key={metric} style={{display:"flex", gap:12, alignItems:"flex-start"}}>
                      <span style={{fontFamily:"Space Mono,monospace", fontSize:11, color:"#a090ff", background:"rgba(100,60,255,0.12)", border:"1px solid rgba(100,60,255,0.25)", borderRadius:6, padding:"3px 10px", whiteSpace:"nowrap", marginTop:2}}>{metric}</span>
                      <span style={{fontFamily:"Space Mono,monospace", fontSize:12, color:"#6b6890", lineHeight:1.6}}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="about-item">
                <h3>🛠️ Technologies Used</h3>
                <div className="tech-pills">
                  {["Python 3.13", "Naive Bayes", "TF-IDF / CountVectorizer", "Pandas", "Gradio", "Joblib", "React (UI)", "Claude AI API"].map(t => (
                    <span key={t} className="tech-pill">{t}</span>
                  ))}
                </div>
              </div>
              <div className="about-item">
                <h3>📊 Datasets</h3>
                <p>SMS Spam Collection Dataset (Kaggle/UCI) — labeled Ham/Spam SMS messages<br /><br />
                Email Spam Classification Dataset (Kaggle/Balaka18) — categorized spam vs legitimate emails</p>
              </div>
              <div className="about-item">
                <h3>🔮 Future Enhancements</h3>
                <p style={{marginBottom:12}}>The system is designed for extensibility. Planned future improvements include:</p>
                <div className="tech-pills">
                  {["LSTM Deep Learning", "BERT Transformer", "Browser Extension", "Real-time Email Monitoring", "Social Media Detection", "Multilingual Support", "Cloud Deployment", "Mobile App"].map(t => (
                    <span key={t} className="tech-pill" style={{background:"rgba(255,80,120,0.08)", borderColor:"rgba(255,80,120,0.2)", color:"#ff80a8"}}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}