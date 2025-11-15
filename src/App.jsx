import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Spline from '@splinetool/react-spline'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_20px] shadow-orange-400/40" />
            <span className="text-white font-semibold tracking-wide">Unmutte</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link to="/chat" className="flex items-center gap-2 px-4 py-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors">Chat</Link>
            <Link to="/community" className="flex items-center gap-2 px-4 py-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors">Community</Link>
            <Link to="/wellness" className="flex items-center gap-2 px-4 py-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors">Wellness Hub</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <section className="grid md:grid-cols-2 gap-8 py-10 md:py-16 items-center">
          <div className="relative order-2 md:order-1">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-white">
              A safe space to vent, be angry, and be accepted — jaise apna langotiya yaar.
            </h1>
            <p className="mt-4 text-zinc-300 text-lg">
              Confidential, multilingual emotional wellness. No judgement. Only warmth, clarity and care.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/chat" className="px-6 py-3 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors">Start talking</Link>
              <Link to="/community" className="px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">Peek community</Link>
            </div>
            <p className="mt-6 text-sm text-zinc-400">
              100% anonymous by default. End-to-end encrypted storage for chat.
            </p>
          </div>
          <div className="relative h-[380px] md:h-[520px] order-1 md:order-2 rounded-xl overflow-hidden border border-white/10 bg-black/40">
            <Spline scene="https://prod.spline.design/AeAqaKLmGsS-FPBN/scene.splinecode" />
          </div>
        </section>

        <section className="py-10 md:py-16 border-t border-white/10">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl bg-white/5 p-5 border border-white/10">
              <h3 className="text-white font-semibold">Chat (AI)</h3>
              <p className="text-zinc-300 mt-2 text-sm">Warm, non-clinical, bilingual chat that absorbs your anger and holds space gently.</p>
            </div>
            <div className="rounded-xl bg-white/5 p-5 border border-white/10">
              <h3 className="text-white font-semibold">Community (Anonymous)</h3>
              <p className="text-zinc-300 mt-2 text-sm">Post and reply as Ally-### with generic avatars. Quick moderation and reporting.</p>
            </div>
            <div className="rounded-xl bg-white/5 p-5 border border-white/10">
              <h3 className="text-white font-semibold">Wellness Hub</h3>
              <p className="text-zinc-300 mt-2 text-sm">Mind relaxation games, simple breath work, and mood tracking over time.</p>
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-zinc-500 text-sm">
          Made with care. If you’re in danger or planning to harm yourself or others, please contact local emergency services immediately.
        </footer>
      </main>
    </div>
  )
}

// Chat Page
export function Chat() {
  const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).slice(2,10))
  const [lang, setLang] = useState('en')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const prompts = {
    en: "Tell me whatever's on your mind. I'm here, no judgement.",
    hi: "Jo mann mein hai keh do. Main yahin hoon, bina kisi faisle ke.",
  }

  const send = async () => {
    if (!input.trim()) return
    const text = input
    setInput('')
    setMessages(m => [...m, { role: 'user', text }])
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, text, lang }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', text: data.reply, intensity: data.intensity }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: 'Network issue, yaar. Thoda baad try karte. ❤️' }])
    } finally { setLoading(false) }
  }

  const intensity = useMemo(() => {
    const last = messages.filter(m => m.intensity !== undefined).slice(-1)[0]
    return last?.intensity ?? 0
  }, [messages])

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-zinc-300 hover:text-white">← Home</Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full text-sm ${lang==='en'?'bg-white text-black':'bg-white/10 text-white'}`}>English</button>
          <button onClick={() => setLang('hi')} className={`px-3 py-1 rounded-full text-sm ${lang==='hi'?'bg-white text-black':'bg-white/10 text-white'}`}>हिन्दी</button>
        </div>
      </div>
      <div className="max-w-4xl w-full mx-auto px-4 flex-1">
        <div className="h-[65vh] overflow-y-auto rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          {messages.length===0 && (
            <div className="text-zinc-400 text-center mt-10">{prompts[lang]}</div>
          )}
          {messages.map((m,i) => (
            <div key={i} className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.role==='user'?'ml-auto bg-emerald-500 text-black':'bg-white/10 text-zinc-100'}`}>
              {m.text}
            </div>
          ))}
        </div>
        {intensity>=0.8 && (
          <div className="mt-4 p-3 rounded-xl border border-amber-300/30 bg-amber-200/10 text-amber-200">
            Dil tez dhadak raha ho toh chhota sa game ya saans exercise karke aate hain? 4 in – 4 hold – 4 out.
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') send()}} placeholder={prompts[lang]} className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder:text-zinc-400" />
          <button onClick={send} disabled={loading} className="px-5 rounded-xl bg-emerald-500 text-black font-semibold disabled:opacity-60">Send</button>
        </div>
      </div>
    </div>
  )
}

// Community Page (Anonymous)
export function Community() {
  const [content, setContent] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/community/feed`)
      const data = await res.json()
      setItems(data.items || [])
    } catch {}
  }
  useEffect(() => { load() }, [])

  const post = async () => {
    if (!content.trim()) return
    setLoading(true)
    try {
      await fetch(`${baseUrl}/api/community/post`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) })
      setContent('')
      await load()
      alert('Sent to moderation. Thanks for sharing, yaar.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-zinc-300 hover:text-white">← Home</Link>
        <div className="text-zinc-400 text-sm">Anonymous by default • e.g., Ally-901</div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-10">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Share something. No names, no judgement." rows={3} className="w-full bg-transparent outline-none resize-none placeholder:text-zinc-500" />
          <div className="flex justify-end mt-3">
            <button onClick={post} disabled={loading} className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-semibold disabled:opacity-60">Post</button>
          </div>
        </div>
        <h3 className="mt-6 mb-3 text-zinc-300">Recent (moderated)</h3>
        <div className="space-y-3">
          {items.length===0 && <div className="text-zinc-500">No posts yet.</div>}
          {items.map((p)=> (
            <div key={p._id} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm text-zinc-400">{p.alias || 'Ally-###'}</div>
              <div className="mt-1 whitespace-pre-wrap">{p.content}</div>
              <div className="mt-2 text-xs text-zinc-500">Reports: {p.reports || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Wellness Hub
export function Wellness() {
  const [mood, setMood] = useState(3)
  const [note, setNote] = useState('')
  const [sessionId] = useState(()=>'sess_'+Math.random().toString(36).slice(2,10))
  const [entries, setEntries] = useState([])
  const [count, setCount] = useState(4)
  const [phase, setPhase] = useState('Inhale')

  useEffect(()=>{
    const t = setInterval(()=>{
      setCount(c=>{
        if(c>1) return c-1
        setPhase(p=> p==='Inhale' ? 'Hold' : p==='Hold' ? 'Exhale' : 'Inhale')
        return 4
      })
    },1000)
    return ()=>clearInterval(t)
  },[])

  const saveMood = async () => {
    await fetch(`${baseUrl}/api/wellness/mood`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ session_id: sessionId, mood, note }) })
    setNote('')
    load()
  }
  const load = async () => {
    const res = await fetch(`${baseUrl}/api/wellness/mood/${sessionId}`)
    const data = await res.json()
    setEntries(data.items||[])
  }
  useEffect(()=>{ load() },[])

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-zinc-300 hover:text-white">← Home</Link>
        <div className="text-zinc-400 text-sm">Simple breath + track your mood</div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-10 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-center">
          <div className="text-zinc-400 text-sm">4-4-4 Box Breathing</div>
          <div className="mt-6 text-4xl font-semibold text-white">{phase}</div>
          <div className="mt-2 text-6xl font-bold text-emerald-400">{count}</div>
          <div className="mt-4 text-zinc-400">In — Hold — Out. Bas saath mein saans lete rahenge.</div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <div className="text-zinc-200 font-medium">Mood Tracker</div>
          <div className="mt-3 flex items-center gap-2">
            {[1,2,3,4,5].map(v=> (
              <button key={v} onClick={()=>setMood(v)} className={`w-10 h-10 rounded-full ${mood===v?'bg-emerald-500 text-black':'bg-white/10 text-white'}`}>{v}</button>
            ))}
          </div>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a small note (optional)" rows={3} className="mt-3 w-full bg-transparent outline-none resize-none placeholder:text-zinc-500" />
          <button onClick={saveMood} className="mt-3 px-5 py-2 rounded-xl bg-emerald-500 text-black font-semibold">Save</button>
          <div className="mt-5 text-sm text-zinc-400">Recent</div>
          <div className="mt-2 max-h-48 overflow-y-auto space-y-2">
            {entries.map((e)=> (
              <div key={e._id} className="text-sm flex items-start justify-between gap-3 bg-white/5 rounded-lg p-2">
                <span>Mood {e.mood}{e.note?': ':''}{e.note}</span>
                <span className="text-xs text-zinc-500">{new Date(e.created_at || Date.now()).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <div className="text-zinc-200 font-medium">Human Connection (Premium)</div>
          <p className="text-zinc-400 text-sm mt-2">Trained emotional support listeners available for subscribers. They are caring peers, not medical professionals unless explicitly certified.</p>
          <Disclaimer />
        </div>
      </div>
    </div>
  )
}

function Disclaimer(){
  const [text,setText]=useState('')
  useEffect(()=>{(async()=>{try{const r=await fetch(`${baseUrl}/api/premium/disclaimer`);const d=await r.json();setText(d.disclaimer)}catch{}})()},[])
  return <div className="mt-3 text-xs text-zinc-500">{text}</div>
}
