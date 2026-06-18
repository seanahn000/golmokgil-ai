import { useState, useRef } from 'react'

// ─── 상수 ────────────────────────────────────────────────────────────────────

const BUSINESS_TYPES = [
  { id: '치킨',  label: '🍗 치킨' },
  { id: '카페',  label: '☕ 카페' },
  { id: '미용실', label: '💇 미용실' },
  { id: '분식',  label: '🍜 분식' },
  { id: '세탁',  label: '👕 세탁' },
  { id: '기타',  label: '➕ 기타' },
]

const MOODS = [
  { id: '밝은',  label: '☀️ 밝은' },
  { id: '세련된', label: '✨ 세련된' },
  { id: '따뜻한', label: '🍯 따뜻한' },
  { id: '고급',  label: '👑 고급' },
]

// ─── 스타일 상수 ──────────────────────────────────────────────────────────────

const S = {
  // 선택된 옵션
  selBg:     '#FFEDD5',
  selBorder: '1.8px solid #FB923C',
  selColor:  '#C2410C',
  selShadow: '0 3px 8px rgba(251,146,60,.18)',
  // 기본 옵션
  defBg:     '#FAF7F0',
  defBorder: '1.4px solid #ECE3D2',
  defColor:  '#7A6E5A',
}

const inputCss = {
  width: '100%',
  background: '#FAF7F0',
  border: '1.4px solid #ECE3D2',
  borderRadius: '10px',
  padding: '11px 14px',
  fontSize: '12.5px',
  color: '#1E293B',
  marginBottom: '13px',
  display: 'block',
}

// ─── 작은 공용 컴포넌트들 ──────────────────────────────────────────────────────

function StepNo({ num }) {
  return (
    <div style={{
      width: '20px', height: '20px', borderRadius: '50%',
      background: '#F97316', color: '#fff',
      fontSize: '11.5px', fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {num}
    </div>
  )
}

function StepHead({ num, label, optional }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '11px' }}>
      <StepNo num={num} />
      <span style={{ fontSize: '14.5px', fontWeight: 700 }}>{label}</span>
      {optional && <span style={{ fontSize: '11px', color: '#B8AE9C', fontWeight: 500 }}>{optional}</span>}
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: '11.5px', color: '#9C9282', marginBottom: '6px' }}>
      {children}
    </div>
  )
}

function OptionBtn({ selected, disabled, label, onClick }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        flex: 1, textAlign: 'center', padding: '13px', borderRadius: '12px',
        background: selected ? S.selBg : S.defBg,
        border: selected ? S.selBorder : S.defBorder,
        fontSize: '13.5px',
        color: selected ? S.selColor : disabled ? '#B0A892' : '#8A7E68',
        fontWeight: selected ? 700 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: selected ? S.selShadow : 'none',
        opacity: disabled ? 0.55 : 1,
        transition: 'all .15s',
      }}
    >
      {label}
    </div>
  )
}

function CellBtn({ selected, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        textAlign: 'center', padding: '13px 0', borderRadius: '12px',
        background: selected ? S.selBg : S.defBg,
        border: selected ? S.selBorder : S.defBorder,
        fontSize: '12.5px',
        color: selected ? S.selColor : S.defColor,
        fontWeight: selected ? 700 : 400,
        cursor: 'pointer',
        boxShadow: selected ? S.selShadow : 'none',
        transition: 'all .15s',
      }}
    >
      {label}
    </div>
  )
}

function ChipBtn({ selected, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '8px 18px', borderRadius: '17px',
        background: selected ? S.selBg : S.defBg,
        border: selected ? S.selBorder : S.defBorder,
        fontSize: '12.5px',
        color: selected ? S.selColor : S.defColor,
        fontWeight: selected ? 700 : 400,
        cursor: 'pointer',
        transition: 'all .15s',
      }}
    >
      {label}
    </div>
  )
}

// ─── 헤더 일러스트 건물들 ──────────────────────────────────────────────────────

const BUILDINGS = [
  { h: 78,  bg: '#F4D9A8', awning: true  },
  { h: 108, bg: '#5B8C77', awning: false },
  { h: 92,  bg: '#E8B07A', awning: true  },
  { h: 100, bg: '#C97B5B', awning: false },
]

// ─── 메인 앱 ──────────────────────────────────────────────────────────────────

export default function App() {
  const [businessType, setBusinessType] = useState('')
  const [promoTopic,   setPromoTopic]   = useState('')
  const [promoPeriod,  setPromoPeriod]  = useState('')
  const [promoSlogan,  setPromoSlogan]  = useState('')
  const [photos,       setPhotos]       = useState([])   // [{name, preview, data, mimeType}]
  const [mood,         setMood]         = useState('')
  const [isLoading,    setIsLoading]    = useState(false)
  const [generatedImg, setGeneratedImg] = useState(null) // base64 string
  const [error,        setError]        = useState('')

  const fileInputRef = useRef(null)

  // ── 사진 처리 ────────────────────────────────────────────────────────────────

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    files.slice(0, 3 - photos.length).forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const dataUrl = ev.target.result
        setPhotos(prev =>
          prev.length < 3
            ? [...prev, {
                name:     file.name,
                preview:  dataUrl,
                data:     dataUrl.split(',')[1],
                mimeType: file.type,
              }]
            : prev
        )
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removePhoto = (i) => setPhotos(prev => prev.filter((_, idx) => idx !== i))

  // ── AI 생성 요청 ─────────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    if (!businessType)      { setError('업종을 선택해주세요. (②번 항목)');  return }
    if (!promoTopic.trim()) { setError('홍보 주제를 입력해주세요. (③번 항목)'); return }
    if (!mood)              { setError('분위기를 선택해주세요. (⑤번 항목)');  return }

    setError('')
    setIsLoading(true)
    setGeneratedImg(null)

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType,
          promoTopic:  promoTopic.trim(),
          promoPeriod: promoPeriod.trim(),
          promoSlogan: promoSlogan.trim(),
          mood,
          photos: photos.map(p => ({ data: p.data, mimeType: p.mimeType })),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '알 수 없는 오류가 발생했습니다.')
      setGeneratedImg(json.image)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImg) return
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${generatedImg}`
    link.download = `골목길AI_${businessType}_${Date.now()}.png`
    link.click()
  }

  // ── 렌더 ─────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      fontFamily: "'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',system-ui,sans-serif",
      color: '#1E293B', background: '#EFE6D8',
      minHeight: '100vh', display: 'flex', justifyContent: 'center',
      padding: '24px 14px',
    }}>
      <div style={{ width: '100%', maxWidth: '1420px' }}>

        {/* ══ HERO HEADER ══════════════════════════════════════════════════════ */}
        <div style={{
          position: 'relative', borderRadius: '20px', overflow: 'hidden',
          height: '148px', marginBottom: '22px',
          background: 'linear-gradient(180deg,#FFE9C7 0%,#FFD9A0 38%,#BFE3D8 70%,#E8DFC8 100%)',
          boxShadow: '0 10px 30px rgba(120,90,40,.18)',
        }}>
          {/* 건물 일러스트 */}
          <div style={{
            position: 'absolute', right: 0, bottom: 0,
            width: '62%', height: '118px',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
          }}>
            {BUILDINGS.map((b, i) => (
              <div key={i} style={{
                width: '90px', height: `${b.h}px`,
                borderRadius: '10px 10px 0 0', background: b.bg,
                marginLeft: '-8px', position: 'relative',
                boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.25)',
              }}>
                {b.awning && (
                  <div style={{
                    position: 'absolute', top: '18px', left: '6px', right: '6px', height: '10px',
                    background: 'repeating-linear-gradient(90deg,#fff 0 8px,#E84C4C 8px 16px)',
                    borderRadius: '2px',
                  }} />
                )}
              </div>
            ))}
            <div style={{ position: 'absolute', bottom: 0, right: '140px', width: '9px', height: '24px', background: '#3b3b3b', borderRadius: '4px 4px 0 0', opacity: .55 }} />
            <div style={{ position: 'absolute', bottom: 0, right: '90px',  width: '9px', height: '24px', background: '#3b3b3b', borderRadius: '4px 4px 0 0', opacity: .55 }} />
          </div>

          {/* 헤더 텍스트 */}
          <div style={{
            position: 'relative', zIndex: 2,
            display: 'flex', alignItems: 'center', height: '100%',
            padding: '0 26px', gap: '18px',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '30px', flexShrink: 0,
              boxShadow: '0 6px 14px rgba(249,115,22,.4)',
            }}>🐱</div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#7C4A1E' }}>
                우리 가게 홍보, 이제 AI로 쉽게! ✨
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                <span style={{ fontSize: '34px', fontWeight: 900, color: '#1E293B', letterSpacing: '-1px' }}>
                  골목길 AI
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  background: '#1d4ed8', color: '#fff',
                  padding: '7px 16px', borderRadius: '24px',
                  fontSize: '16px', fontWeight: 800,
                  boxShadow: '0 4px 10px rgba(29,78,216,.35)',
                }}>
                  🏛️ 은평구청
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#6B5B45', marginTop: '5px' }}>
                은평구청이 지역 소상공인을 응원합니다.
              </div>
            </div>
          </div>
        </div>

        {/* ══ BODY ═════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>

          {/* ── 왼쪽: 입력 패널 ──────────────────────────────────────────────── */}
          <div style={{
            background: '#fff', borderRadius: '18px', padding: '24px',
            boxShadow: '0 4px 16px rgba(120,90,40,.06)', border: '1px solid #F0E6D6',
            flex: '0 0 clamp(320px, 39%, 560px)',
          }}>
            <div style={{ fontSize: '21px', fontWeight: 800, letterSpacing: '-.5px' }}>
              홍보물 만들기
            </div>
            <div style={{ fontSize: '12.5px', color: '#94A3B8', margin: '4px 0 20px' }}>
              몇 가지만 입력하면 약 10~20초 만에 완성돼요
            </div>

            {/* ① 콘텐츠 종류 */}
            <StepHead num="1" label="무엇을 만들까요?" />
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <OptionBtn selected label="🖼 이미지" />
              <OptionBtn disabled label="🎬 동영상 10초" />
            </div>

            {/* ② 업종 */}
            <StepHead num="2" label="우리 가게 업종" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '9px', marginBottom: '24px' }}>
              {BUSINESS_TYPES.map(b => (
                <CellBtn
                  key={b.id}
                  selected={businessType === b.id}
                  label={b.label}
                  onClick={() => setBusinessType(b.id)}
                />
              ))}
            </div>

            {/* ③ 홍보 내용 */}
            <StepHead num="3" label="홍보 내용" />
            <FieldLabel>홍보 주제</FieldLabel>
            <input
              style={inputCss}
              placeholder="예) 7월 한 달 배달비 무료 이벤트"
              value={promoTopic}
              onChange={e => setPromoTopic(e.target.value)}
              maxLength={100}
            />
            <FieldLabel>기간</FieldLabel>
            <input
              style={inputCss}
              placeholder="예) 2026.07.01 ~ 07.31"
              value={promoPeriod}
              onChange={e => setPromoPeriod(e.target.value)}
              maxLength={60}
            />
            <FieldLabel>
              강조 문구&nbsp;
              <span style={{ color: '#B8AE9C', fontWeight: 500 }}>(선택)</span>
            </FieldLabel>
            <input
              style={{ ...inputCss, marginBottom: 0 }}
              placeholder="예) 후라이드 2마리 18,000원"
              value={promoSlogan}
              onChange={e => setPromoSlogan(e.target.value)}
              maxLength={80}
            />

            {/* ④ 사진 업로드 */}
            <div style={{ marginTop: '24px' }}>
              <StepHead num="4" label="우리 가게 사진 넣기" optional="(선택, 최대 3장)" />
              <div style={{
                background: '#FFF9EF', border: '1.6px dashed #F3D9AE',
                borderRadius: '14px', padding: '16px', marginBottom: '24px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                  {/* 업로드된 사진 */}
                  {photos.map((photo, i) => (
                    <div key={i} style={{
                      borderRadius: '11px', height: '90px',
                      border: '1.8px solid #FB923C', background: '#fff',
                      overflow: 'hidden', position: 'relative',
                      display: 'flex', flexDirection: 'column',
                    }}>
                      <img
                        src={photo.preview} alt={photo.name}
                        style={{ width: '100%', height: '58px', objectFit: 'cover' }}
                      />
                      <div style={{
                        fontSize: '9.5px', color: '#7A6E5A', fontWeight: 600,
                        padding: '4px 6px', background: '#fff',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {photo.name}
                      </div>
                      <button
                        onClick={() => removePhoto(i)}
                        style={{
                          position: 'absolute', top: '4px', right: '4px',
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: 'rgba(30,41,59,.65)', color: '#fff',
                          fontSize: '11px', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >✕</button>
                    </div>
                  ))}

                  {/* 사진 추가 버튼 (빈 슬롯이 있을 때) */}
                  {photos.length < 3 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        borderRadius: '11px', height: '90px',
                        background: '#fff', border: '1.6px dashed #D9CDB0',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: '#FFEDD5', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '16px', color: '#F97316', fontWeight: 700,
                      }}>＋</div>
                      <div style={{ fontSize: '10.5px', color: '#A89A7C', fontWeight: 600 }}>사진 추가</div>
                    </div>
                  )}

                  {/* 나머지 빈 슬롯 (시각적 자리 표시용) */}
                  {Array.from({ length: Math.max(0, 2 - photos.length) }).map((_, i) => (
                    <div key={`empty-${i}`} style={{
                      borderRadius: '11px', height: '90px',
                      background: '#FAF7F0', border: '1.6px dashed #D9CDB0',
                    }} />
                  ))}
                </div>

                <div style={{
                  fontSize: '11px', color: '#A38A5B', marginTop: '11px',
                  display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.5,
                }}>
                  <span>💡</span>
                  <span>
                    올려주신 사진이 홍보물에 실제로 사용돼요.
                    사진이 없으면 AI가 업종에 맞는 이미지를 자동으로 만들어 드려요.
                  </span>
                </div>
              </div>
            </div>

            {/* 숨겨진 파일 인풋 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />

            {/* ⑤ 분위기 */}
            <StepHead num="5" label="분위기" />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {MOODS.map(m => (
                <ChipBtn
                  key={m.id}
                  selected={mood === m.id}
                  label={m.label}
                  onClick={() => setMood(m.id)}
                />
              ))}
            </div>

            <div style={{ fontSize: '11.5px', color: '#16A34A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>✓</span>
              <span>등록된 가게 로고·메뉴가 자동 반영됩니다</span>
            </div>

            {/* 오류 메시지 */}
            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: '10px', padding: '10px 14px',
                fontSize: '12.5px', color: '#DC2626', marginBottom: '12px',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* 생성 버튼 */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              style={{
                width: '100%', textAlign: 'center', padding: '16px', borderRadius: '14px',
                background: isLoading
                  ? '#FDA472'
                  : 'linear-gradient(135deg,#FB923C,#F97316)',
                color: '#fff', fontSize: '16.5px', fontWeight: 800, border: 'none',
                boxShadow: isLoading ? 'none' : '0 8px 18px rgba(249,115,22,.4)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all .2s',
              }}
            >
              {isLoading
                ? <span><span className="loading-icon">✨</span> AI가 생성 중입니다…</span>
                : '✨ AI로 생성하기'
              }
            </button>
          </div>

          {/* ── 오른쪽: 미리보기 패널 ────────────────────────────────────────── */}
          <div style={{
            background: '#fff', borderRadius: '18px', padding: '24px',
            boxShadow: '0 4px 16px rgba(120,90,40,.06)', border: '1px solid #F0E6D6',
            flex: 1, minWidth: '300px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <span style={{ fontSize: '17px', fontWeight: 800 }}>미리보기</span>
              <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>이미지 · 1080 × 1080</span>
            </div>

            {/* 포스터 영역 */}
            <div style={{
              borderRadius: '16px', overflow: 'hidden', position: 'relative',
              minHeight: '430px',
              background: 'linear-gradient(160deg,#FFF3DD 0%,#FFE2B0 55%,#FFD89A 100%)',
              boxShadow: '0 6px 22px rgba(120,90,40,.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isLoading ? (
                /* 로딩 상태 */
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="loading-icon" style={{ fontSize: '52px', display: 'block', marginBottom: '20px' }}>✨</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#92703C' }}>
                    AI가 홍보 포스터를 만들고 있어요
                  </div>
                  <div className="loading-dots" style={{ fontSize: '13px', color: '#A38A5B', marginTop: '8px' }}>
                    약 10~20초 정도 걸려요…
                  </div>
                </div>

              ) : generatedImg ? (
                /* 생성된 이미지 */
                <>
                  <img
                    src={`data:image/png;base64,${generatedImg}`}
                    alt="AI 생성 홍보 포스터"
                    style={{ width: '100%', display: 'block', borderRadius: '16px' }}
                  />
                  {photos.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '14px', left: '14px',
                      background: '#1E293B', color: '#fff',
                      fontSize: '10.5px', fontWeight: 700,
                      padding: '5px 11px', borderRadius: '9px',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      📷 내 사진 반영됨
                    </div>
                  )}
                </>

              ) : (
                /* 초기 안내 */
                <div style={{ textAlign: 'center', padding: '60px 40px', color: '#A38A5B' }}>
                  <div style={{ fontSize: '72px', marginBottom: '20px', opacity: 0.35 }}>🖼</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#8A7E68', lineHeight: 1.6 }}>
                    왼쪽에서 조건을 입력하고<br />
                    <span style={{ color: '#F97316' }}>"AI로 생성하기"</span>를 눌러보세요
                  </div>
                  <div style={{ fontSize: '12px', color: '#B0A892', marginTop: '10px' }}>
                    업종·홍보 내용·분위기만 선택하면<br />약 10~20초 만에 포스터가 완성돼요
                  </div>
                </div>
              )}
            </div>

            {/* 상태 표시 */}
            {generatedImg && (
              <div style={{
                marginTop: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0',
                borderRadius: '10px', padding: '11px 16px',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontWeight: 600, color: '#15803D' }}>생성 완료!</span>
                <span style={{ color: '#6B7280' }}>아래 버튼으로 다운로드하세요.</span>
              </div>
            )}

            {/* 버튼 */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={handleDownload}
                disabled={!generatedImg}
                style={{
                  flex: 1, textAlign: 'center', padding: '14px', borderRadius: '12px',
                  background: generatedImg ? '#1E293B' : '#CBD5E1',
                  color: '#fff', fontSize: '13.5px', fontWeight: 700, border: 'none',
                  cursor: generatedImg ? 'pointer' : 'not-allowed',
                  transition: 'background .2s',
                }}
              >
                ⬇ 다운로드
              </button>
              <button
                onClick={() => { setGeneratedImg(null); setError('') }}
                style={{
                  flex: 1, textAlign: 'center', padding: '14px', borderRadius: '12px',
                  background: '#FAF7F0', border: '1.4px solid #ECE3D2',
                  color: '#5B5343', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                ↻ 다시 생성
              </button>
            </div>

            {/* 구분선 */}
            <div style={{ height: '1px', background: '#F0E6D6', margin: '22px 0' }} />

            {/* 최근 콘텐츠 (정적 예시) */}
            <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '14px' }}>최근 만든 콘텐츠</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '13px' }}>
              {['7월 배달무료', '주말 할인', '오픈 안내'].map(lbl => (
                <div key={lbl} style={{
                  height: '88px', borderRadius: '11px', border: '1px solid #ECE3D2',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                  paddingBottom: '8px', fontSize: '11px', color: '#8A7E68', fontWeight: 600,
                  background: 'linear-gradient(135deg,#FFE9C7,#FFD2A0)', overflow: 'hidden',
                }}>
                  <span style={{ background: 'rgba(255,255,255,.85)', padding: '2px 8px', borderRadius: '7px' }}>
                    {lbl}
                  </span>
                </div>
              ))}
              <div style={{
                height: '88px', borderRadius: '11px',
                border: '1.6px dashed #D9CDB0', background: '#FAF7F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', color: '#B0A892',
              }}>＋</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
