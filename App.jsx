import { useState, useRef, useEffect } from "react";

const SALON_SYSTEM_PROMPT = `You are SalonMind, an intelligent AI receptionist and business assistant for Indian salons and beauty parlors. You speak naturally in Hinglish (mix of Hindi and English) when the customer seems to prefer it, and pure English when they prefer that.

SALON DETAILS (Demo Salon):
Name: Glamour Studio by Priya
Location: CG Road, Ahmedabad
Owner: Priya Shah
Working Hours: 10 AM - 8 PM (Monday to Saturday), 11 AM - 6 PM (Sunday)
Phone: +91 98765 43210

SERVICES & PRICES:
HAIR SERVICES:
- Haircut (Women): ₹300-600
- Haircut (Men): ₹150-300
- Hair Color (Global): ₹1200-2500
- Balayage/Highlights: ₹2500-5000
- Keratin Treatment: ₹3000-6000
- Hair Spa: ₹800-1500
- Blow Dry & Styling: ₹400-800

SKIN & FACE:
- Basic Facial: ₹500-800
- Cleanup: ₹300-500
- De-tan Pack: ₹400-700
- Threading (eyebrow): ₹50
- Threading (upper lip): ₹30
- Waxing (full arms): ₹300
- Waxing (full legs): ₹500
- Full Body Waxing: ₹1500-2000

NAIL SERVICES:
- Manicure: ₹400-600
- Pedicure: ₹500-700
- Nail Extensions: ₹1500-2500
- Gel Polish: ₹600-1000

BRIDAL PACKAGES:
- Basic Bridal Makeup: ₹8000
- Premium Bridal Package (makeup + hair + mehendi): ₹25000
- Pre-Bridal Package (3 sessions): ₹12000

CURRENT STYLISTS:
- Priya Shah (Owner) - Hair Color Expert, Bridal Specialist
- Meena - Threading & Waxing Expert  
- Ravi - Men's Hair & Beard Styling
- Anjali - Nail Art & Extensions

AVAILABLE SLOTS TODAY (May 14, 2026):
- 11:00 AM - Available (Meena)
- 12:30 PM - Available (Anjali)
- 2:00 PM - Available (Priya)
- 4:00 PM - Available (Ravi)
- 5:30 PM - Available (Meena)
- 6:00 PM - Available (Anjali)

YOUR CAPABILITIES:
1. BOOKING: Take appointment bookings, confirm slots, capture name & phone
2. PRICING: Answer any service price queries instantly
3. RECOMMENDATIONS: Suggest services based on customer needs/occasion/budget
4. REMINDERS: Tell customers you'll send them WhatsApp reminders (simulate)
5. COMPLAINTS: Handle feedback gracefully, escalate to owner if needed
6. UPSELLING: Smartly suggest add-ons (e.g., if someone books facial, suggest cleanup combo deal)
7. LOYALTY: Mention that members get 10% off on every 5th visit

PERSONALITY:
- Warm, friendly, professional
- Like a helpful friend who knows beauty
- Never pushy with sales
- Always confirm bookings with a summary
- Use light Hinglish when appropriate: "Bilkul!", "Acha!", "Perfect choice!"

BUSINESS OWNER MODE (when asked for analytics/reports):
If the user types "owner mode" or asks for business data, switch to giving:
- Today's bookings summary
- Revenue estimates
- Popular services
- No-show alerts
- Staff utilization

Always end booking confirmations with:
"I'll send you a WhatsApp reminder 2 hours before your appointment! 📱"`;

const QUICK_ACTIONS = [
  { label: "💇‍♀️ Book Appointment", msg: "I want to book an appointment" },
  { label: "💰 Check Prices", msg: "What are your service prices?" },
  { label: "👰 Bridal Package", msg: "Tell me about bridal packages" },
  { label: "⏰ Today's Slots", msg: "What slots are available today?" },
  { label: "💅 Nail Services", msg: "What nail services do you offer?" },
  { label: "📊 Owner Dashboard", msg: "owner mode - show me today's business summary" },
];

const DEMO_BADGES = ["AI Receptionist", "24/7 Booking", "Hinglish Support", "Owner Analytics"];

export default function SalonMindDemo() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! 🌸 Welcome to **Glamour Studio by Priya**! I'm SalonMind, your AI beauty assistant.\n\nMain aapki kaise help kar sakti hoon? Whether you want to book an appointment, check prices, or explore our services — I'm here! ✨\n\n*(Try the quick actions below or type anything!)*"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SALON_SYSTEM_PROMPT,
          messages: apiMessages
        })
      });
      const data = await response.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, something went wrong!";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Network error. Please try again!" }]);
    }
    setLoading(false);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "linear-gradient(135deg, #0f0a1a 0%, #1a0f2e 50%, #0f1a2e 100%)",
      minHeight: "100vh",
      color: "#f0e8ff",
      padding: "0",
      margin: "0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #7c3aed55; border-radius: 2px; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px #e879f920; }
          50% { box-shadow: 0 0 40px #e879f950; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .msg-bubble { animation: fadeSlideUp 0.3s ease forwards; }

        .quick-btn {
          background: linear-gradient(135deg, #2d1b4e, #1e1040);
          border: 1px solid #7c3aed44;
          color: #d8b4fe;
          padding: 8px 14px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .quick-btn:hover {
          background: linear-gradient(135deg, #4c1d95, #2d1b4e);
          border-color: #a855f7;
          color: #f3e8ff;
          transform: translateY(-1px);
        }

        .send-btn {
          background: linear-gradient(135deg, #9333ea, #ec4899);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 22px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
          animation: pulse-glow 3s ease infinite;
        }
        .send-btn:hover { transform: scale(1.04); opacity: 0.95; }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .tab-btn {
          background: transparent;
          border: 1px solid #3b1d6e44;
          color: #9d7fc9;
          padding: 8px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: linear-gradient(135deg, #7c3aed, #9333ea);
          border-color: #a855f7;
          color: white;
        }

        .input-field {
          flex: 1;
          background: #1a0f2e;
          border: 1px solid #3b1d6e;
          color: #f0e8ff;
          padding: 12px 16px;
          border-radius: 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #7c3aed; }
        .input-field::placeholder { color: #6b4c9a; }

        .stat-card {
          background: linear-gradient(135deg, #1e1040, #0f0a1a);
          border: 1px solid #3b1d6e55;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
        }

        .feature-card {
          background: linear-gradient(135deg, #1a0f2e88, #0f0a1a88);
          border: 1px solid #7c3aed33;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #1a0f2e 0%, transparent 100%)",
        padding: "24px 24px 16px",
        borderBottom: "1px solid #3b1d6e33",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 28 }}>💇‍♀️</span>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  background: "linear-gradient(135deg, #e879f9, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>SalonMind</h1>
                <span style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 10,
                  letterSpacing: 1,
                }}>LIVE DEMO</span>
              </div>
              <p style={{ color: "#9d7fc9", fontSize: 13, margin: 0 }}>
                AI Receptionist for Indian Salons • Powered by Claude
              </p>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {DEMO_BADGES.map(b => (
                <span key={b} style={{
                  background: "#2d1b4e",
                  border: "1px solid #7c3aed44",
                  color: "#c084fc",
                  fontSize: 11,
                  padding: "3px 10px",
                  borderRadius: 10,
                }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {["chat", "features", "business"].map(t => (
              <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}>
                {t === "chat" ? "🤖 Live Demo" : t === "features" ? "✨ Features" : "📊 Business Case"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 16px" }}>

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div>
            {/* Salon info bar */}
            <div style={{
              background: "linear-gradient(135deg, #1e1040, #1a0f2e)",
              border: "1px solid #3b1d6e",
              borderRadius: 14,
              padding: "12px 16px",
              display: "flex",
              gap: 20,
              marginBottom: 16,
              flexWrap: "wrap",
              fontSize: 13,
            }}>
              <span>🏪 <strong style={{ color: "#e879f9" }}>Glamour Studio by Priya</strong></span>
              <span>📍 CG Road, Ahmedabad</span>
              <span>🕐 10AM–8PM Mon–Sat</span>
              <span style={{ color: "#10b981" }}>● Online</span>
            </div>

            {/* Messages */}
            <div style={{
              background: "#0a0618",
              border: "1px solid #2d1b4e",
              borderRadius: 20,
              padding: "16px",
              height: 420,
              overflowY: "auto",
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              {messages.map((m, i) => (
                <div key={i} className="msg-bubble" style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}>
                  {m.role === "assistant" && (
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "linear-gradient(135deg, #9333ea, #ec4899)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, marginRight: 8, flexShrink: 0, marginTop: 2,
                    }}>💇‍♀️</div>
                  )}
                  <div style={{
                    maxWidth: "75%",
                    background: m.role === "user"
                      ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                      : "linear-gradient(135deg, #1e1040, #2d1b4e)",
                    border: m.role === "user" ? "none" : "1px solid #3b1d6e",
                    borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "10px 14px",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: m.role === "user" ? "white" : "#e9d5ff",
                  }}
                    dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }}
                  />
                </div>
              ))}
              {loading && (
                <div className="msg-bubble" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "linear-gradient(135deg, #9333ea, #ec4899)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                  }}>💇‍♀️</div>
                  <div style={{
                    background: "linear-gradient(135deg, #1e1040, #2d1b4e)",
                    border: "1px solid #3b1d6e",
                    borderRadius: "18px 18px 18px 4px",
                    padding: "12px 16px",
                    display: "flex", gap: 4, alignItems: "center",
                  }}>
                    {[0, 1, 2].map(d => (
                      <div key={d} style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "#a855f7",
                        animation: `blink 1.2s ease ${d * 0.3}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 10 }}>
              {QUICK_ACTIONS.map(a => (
                <button key={a.label} className="quick-btn" onClick={() => sendMessage(a.msg)}>
                  {a.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 10 }}>
              <input
                className="input-field"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type a message... (Try: 'Book appointment for Saturday 3pm')"
                disabled={loading}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                {loading ? "..." : "Send ✦"}
              </button>
            </div>
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === "features" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e879f9", margin: "0 0 4px" }}>
              What SalonMind Does
            </h2>
            <p style={{ color: "#9d7fc9", margin: "0 0 16px", fontSize: 14 }}>
              Every feature your salon needs — no app download required. Works on WhatsApp.
            </p>

            {[
              { icon: "📅", title: "Smart Booking Agent", desc: "Customers book appointments 24/7 via WhatsApp or website. Auto-confirms slots, sends reminders, reduces no-shows by 60%." },
              { icon: "💰", title: "Instant Price Quotes", desc: "Answers any pricing question instantly. Customers don't need to call. Includes combo deals and seasonal offers automatically." },
              { icon: "🌸", title: "Hinglish Support", desc: "Speaks naturally in Hindi + English mix. Feels like talking to a local friend. Builds trust with Indian customers." },
              { icon: "👰", title: "Bridal Package Advisor", desc: "Handles complex bridal inquiries. Recommends packages based on date, budget, and requirements. Your biggest revenue driver." },
              { icon: "📊", title: "Owner Analytics Dashboard", desc: "Daily revenue summary, staff utilization, popular services, no-show tracking. Know your business in 30 seconds." },
              { icon: "⭐", title: "Review & Loyalty Engine", desc: "Asks happy customers for Google reviews. Tracks visit count. Reminds loyal customers about their 10% discount at visit #5." },
              { icon: "🔔", title: "WhatsApp Reminders", desc: "Automated reminders 24hrs and 2hrs before appointment. Reduces no-shows dramatically. Customers love the personal touch." },
              { icon: "💬", title: "Complaint Handler", desc: "Handles negative feedback gracefully. Escalates serious issues to owner with full context. Protects your reputation." },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <span style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: "#d8b4fe", marginBottom: 4 }}>{f.title}</div>
                  <div style={{ color: "#9d7fc9", fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BUSINESS TAB */}
        {activeTab === "business" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e879f9", margin: 0 }}>
              Business Case for You
            </h2>

            {/* Market stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
              {[
                { val: "7.5L+", label: "Salons in India", color: "#e879f9" },
                { val: "₹0", label: "Tech adoption", color: "#10b981" },
                { val: "53%", label: "AI Market CAGR", color: "#f59e0b" },
                { val: "2%", label: "AI deployed so far", color: "#a855f7" },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#9d7fc9", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Pricing model */}
            <div style={{
              background: "linear-gradient(135deg, #1e1040, #0f0a1a)",
              border: "1px solid #7c3aed44",
              borderRadius: 16,
              padding: 20,
            }}>
              <h3 style={{ color: "#e879f9", margin: "0 0 14px", fontFamily: "'Playfair Display', serif" }}>
                💰 Your Revenue Model
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { plan: "Starter", price: "₹1,499/mo", features: "AI chat + booking + reminders", target: "Small parlors", color: "#6d28d9" },
                  { plan: "Growth", price: "₹3,499/mo", features: "Starter + analytics + loyalty + 3 WhatsApp numbers", target: "Mid-size salons", color: "#7c3aed" },
                  { plan: "Premium", price: "₹7,999/mo", features: "Everything + bridal advisor + multi-branch + custom branding", target: "Salon chains", color: "#9333ea" },
                ].map(p => (
                  <div key={p.plan} style={{
                    background: `${p.color}22`,
                    border: `1px solid ${p.color}55`,
                    borderRadius: 12,
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                  }}>
                    <div>
                      <span style={{ color: "#e9d5ff", fontWeight: 600 }}>{p.plan}</span>
                      <span style={{ color: "#9d7fc9", fontSize: 12, marginLeft: 8 }}>{p.target}</span>
                      <div style={{ color: "#9d7fc9", fontSize: 12, marginTop: 3 }}>{p.features}</div>
                    </div>
                    <div style={{ color: "#10b981", fontWeight: 700, fontSize: 18 }}>{p.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue projection */}
            <div style={{
              background: "linear-gradient(135deg, #0a1628, #0f1a2e)",
              border: "1px solid #1e3a5f",
              borderRadius: 16,
              padding: 20,
            }}>
              <h3 style={{ color: "#38bdf8", margin: "0 0 14px", fontFamily: "'Playfair Display', serif" }}>
                📈 Revenue Projection (Ahmedabad)
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { month: "Month 3", clients: "10 salons", mrr: "₹25,000/mo", note: "Start with CG Road area" },
                  { month: "Month 6", clients: "35 salons", mrr: "₹90,000/mo", note: "Expand to Satellite, Navrangpura" },
                  { month: "Month 12", clients: "100 salons", mrr: "₹2.8L/mo", note: "City-wide + hire 1 sales person" },
                  { month: "Month 18", clients: "300 salons", mrr: "₹8.5L/mo", note: "Gujarat state expansion" },
                ].map(r => (
                  <div key={r.month} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #1e3a5f",
                    paddingBottom: 10,
                    flexWrap: "wrap",
                    gap: 4,
                  }}>
                    <div>
                      <span style={{ color: "#38bdf8", fontWeight: 600 }}>{r.month}</span>
                      <span style={{ color: "#64748b", fontSize: 12, marginLeft: 8 }}>{r.clients} • {r.note}</span>
                    </div>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>{r.mrr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Your next steps */}
            <div style={{
              background: "linear-gradient(135deg, #1a1a0f, #0f1a0a)",
              border: "1px solid #365314",
              borderRadius: 16,
              padding: 20,
            }}>
              <h3 style={{ color: "#84cc16", margin: "0 0 14px", fontFamily: "'Playfair Display', serif" }}>
                🚀 Your Next 7 Days
              </h3>
              {[
                { day: "Day 1–2", action: "Show THIS demo to 5 salon owners on CG Road. Ask: 'Would you pay ₹1,499/month for this?'" },
                { day: "Day 3–4", action: "Get 2–3 'Yes' answers. Offer FREE 30-day trial in exchange for feedback." },
                { day: "Day 5–6", action: "Customize the AI with their real services, prices, and stylists." },
                { day: "Day 7", action: "Go LIVE with your first paid customer. Collect testimonial. Repeat." },
              ].map(s => (
                <div key={s.day} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <span style={{
                    background: "#365314",
                    color: "#84cc16",
                    padding: "2px 10px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    height: "fit-content",
                    marginTop: 2,
                  }}>{s.day}</span>
                  <span style={{ color: "#d9f99d", fontSize: 13, lineHeight: 1.6 }}>{s.action}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: "linear-gradient(135deg, #2d1b4e, #1a0f2e)",
              border: "1px solid #a855f755",
              borderRadius: 16,
              padding: 20,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💡</div>
              <div style={{ color: "#d8b4fe", fontWeight: 600, marginBottom: 6 }}>
                This demo IS your sales pitch
              </div>
              <div style={{ color: "#9d7fc9", fontSize: 13, lineHeight: 1.7 }}>
                Walk into any salon. Open this on your phone. Let the owner type a question.<br />
                When they see AI answering in Hinglish about their own services — they'll be sold.<br />
                <strong style={{ color: "#e879f9" }}>You don't need a degree. You need 5 salon visits.</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
