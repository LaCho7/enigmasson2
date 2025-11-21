import React, { useState, useRef } from 'react'
import Head from 'next/head'
import Keyboard from '../components/Keyboard'
import { Enigma, DEFAULT_ROTORS } from '../lib/enigma'

export default function Home() {
  const [positions, setPositions] = useState([0, 0, 0])
  const [initialPositions, setInitialPositions] = useState([0, 0, 0])
  const [plugs, setPlugs] = useState([['A', 'B'], ['C', 'D'], ['E', 'F']])
  const [text, setText] = useState('')
  const [out, setOut] = useState('')
  const [decrypted, setDecrypted] = useState('')
  const enigmaRef = useRef<Enigma | null>(null)

  const handleDecrypt = () => {
    const pairs = plugs.filter(p => p[0] && p[1] && p[0] !== p[1]) as [string, string][]
    const decryptor = new Enigma(DEFAULT_ROTORS, initialPositions, pairs)
    const result = decryptor.encodeText(out)
    setDecrypted(result)
  }

  const onKey = (k: string) => {
    if (!enigmaRef.current) {
      const pairs = plugs.filter(p => p[0] && p[1] && p[0] !== p[1]) as [string, string][]
      enigmaRef.current = new Enigma(DEFAULT_ROTORS, positions, pairs)
      setInitialPositions([...positions])
    }
    
    const encoded = enigmaRef.current.encodeChar(k)
    setText(prev => prev + k)
    setOut(prev => prev + encoded)
    setPositions([...enigmaRef.current.rotors.map(r => r.position)])
  }

  const updatePlug = (idx: number, pos: number, val: string) => {
    setPlugs(prev => prev.map((p, i) => i===idx ? (pos===0? [val.toUpperCase().slice(0,1), p[1]]: [p[0], val.toUpperCase().slice(0,1)]): p))
  }

  return (
    <div className="container">
      <Head>
        <title>EnigmaCopilot - Machine Enigma</title>
      </Head>

      <h1>MACHINE ENIGMA</h1>

      <div className="mainContent">
        <div className="leftColumn">
          <div className="card">
            <div className="card-title">Configuration des rotors</div>
            <div className="label">Position des rotors (0-25)</div>
            <div className="controls">
              {positions.map((p, i) => (
                <div key={i} style={{display:'flex', alignItems:'center', gap:8}}>
                  <span style={{fontSize:11, color:'var(--muted)', minWidth:20}}>R{i+1}</span>
                  <input type="number" min={0} max={25} value={p} onChange={e => {
                    const v = Math.max(0, Math.min(25, Number(e.target.value || 0)))
                    setPositions(prev => prev.map((x, idx) => idx===i? v: x))
                    enigmaRef.current = null
                  }} />
                  <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:50, height:50, borderRadius:8, background:'linear-gradient(135deg, #0099cc, #00d9ff)', color:'#0a0e27', fontWeight:'bold', fontSize:'1.2rem', minWidth:50}}>
                    {String.fromCharCode(65 + p)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Tableau de connexions (max 3 paires)</div>
            {plugs.map((p, i) => (
              <div key={i} className="plugpair">
                <span style={{fontSize:11, color:'var(--muted)', fontWeight:600}}>Paire {i+1}</span>
                <input maxLength={1} value={p[0]} onChange={e => updatePlug(i, 0, e.target.value)} placeholder="A" />
                <span style={{color:'var(--accent)'}}>↔</span>
                <input maxLength={1} value={p[1]} onChange={e => updatePlug(i, 1, e.target.value)} placeholder="B" />
              </div>
            ))}
          </div>

          <div className="row">
            <div className="card">
              <div className="card-title">Message d entree</div>
              <textarea className="textarea" readOnly value={text} placeholder="Cliquez sur le clavier virtuel pour saisir..." />
              <div style={{marginTop:12}}>
                <button className="button" onClick={() => {setText(''); setOut(''); setDecrypted(''); enigmaRef.current = null; setInitialPositions(positions)}} style={{background:'#ff4757'}}>EFFACER</button>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Message de sortie</div>
              <textarea className="textarea" readOnly value={out} placeholder="Le texte chiffre/dechiffre s affiche ici..." />
              <div style={{marginTop:12}}>
                <button className="button" onClick={handleDecrypt} style={{background:'linear-gradient(135deg,var(--accent),#00ffff)'}}>DECODER</button>
              </div>
              {decrypted && (
                <div style={{marginTop:12, padding:12, background:'rgba(0,217,255,0.05)', borderRadius:8, border:'1px solid rgba(0,217,255,0.2)'}}>
                  <div className="label" style={{marginBottom:8}}>Message decode :</div>
                  <div style={{fontSize:14, color:'var(--accent)', fontWeight:500, wordBreak:'break-all'}}>
                    {decrypted}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Clavier virtuel</div>
            <div style={{textAlign:'center', color:'var(--muted)', fontSize:12, marginBottom:12}}>Cliquez sur les touches pour saisir du texte</div>
            <Keyboard onKey={onKey} />
          </div>
        </div>

        <div className="rightColumn">
          <div className="infoBox">
            <h3>A propos d Enigma</h3>
            <p>Enigma est une machine de chiffrement historique utilisee lors de la Seconde Guerre mondiale.</p>
          </div>

          <div className="infoBox">
            <h3>Comment ca marche</h3>
            <p><strong>Rotors :</strong> Trois rotors rotatifs qui changent de position a chaque lettre tapee.</p>
            <p><strong>Reflecteur :</strong> Renvoie le signal dans les rotors pour un chiffrement reversible.</p>
            <p><strong>Tableau :</strong> Echange des paires de lettres avant et apres les rotors.</p>
          </div>

          <div className="infoBox">
            <h3>Utilisation</h3>
            <p>1. Reglez les positions des rotors (0-25)</p>
            <p>2. Configurez le tableau de connexions</p>
            <p>3. Cliquez sur le clavier virtuel pour chiffrer</p>
            <p>4. Cliquez sur DECODER pour voir le message original</p>
          </div>

          <div className="infoBox">
            <h3>Propriete</h3>
            <p>La machine Enigma a une propriete unique : <strong>chiffrer un message chiffre le dechiffre</strong>. C est pour cela que l algorithme est symetrique.</p>
          </div>

          <div className="infoBox">
            <h3>Conseil</h3>
            <p>Pour decoder un message, utilisez les memes parametres que le chiffrement. Les rotors doivent etre aux memes positions initiales !</p>
          </div>
        </div>
      </div>
    </div>
  )
}
