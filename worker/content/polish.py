# Editorial pass: keep scientific constraints as case facts, remove repeated
# out-of-story disclaimers from the player experience. IDs remain stable.
import re
replacements={
'Educational fiction: exact assays and treatment require specialist review.':'',
'These fictional forensic findings require specialist review before educational or real-world use.':'',
'Fiksi edukatif: rincian pemeriksaan serta terapi memerlukan tinjauan spesialis.':'',
'Temuan forensik fiksi ini memerlukan tinjauan spesialis sebelum penggunaan edukatif atau dunia nyata.':'',
'Medical review flag: seizure semiology, EEG interpretation and care details require clinical validation before educational use.':'',
'Penanda tinjauan medis: gejala kejang, tafsir EEG, dan rincian perawatan perlu validasi klinis sebelum penggunaan edukatif.':'',
'Fire and emergency procedures in this fictional case require specialist review; the game is an untimed retrospective investigation, not operational emergency advice.':'',
'Prosedur kebakaran serta darurat dalam kasus fiksi ini memerlukan tinjauan spesialis; permainan adalah investigasi retrospektif tanpa batas waktu, bukan saran operasional darurat.':'',
'These rules are narrative inventions, not claims that real biological duplication reproduces fingerprints or personal identity.':'',
'Aturan ini ciptaan naratif, bukan klaim bahwa duplikasi biologis nyata mereproduksi sidik jari atau identitas pribadi.':'',
'These are invented rules, not real science.':'',
'Ini aturan ciptaan, bukan sains nyata.':'',
'Under this story’s explicitly fictional Palisade rules,':'Under Palisade’s sealed protocol,',
'Menurut aturan Palisade yang secara eksplisit fiksi,':'Menurut protokol Palisade yang tersegel,',
'A biological match must be interpreted under the explicitly fictional project rules.':'A biological match must be interpreted alongside the original Palisade protocol.',
'Kecocokan biologis perlu ditafsirkan menurut aturan proyek yang secara eksplisit fiksi.':'Kecocokan biologis perlu ditafsirkan bersama protokol asli Palisade.',
'The sealed story protocol defines':'The sealed protocol defines',
'Protokol cerita tersegel menetapkan':'Protokol tersegel menetapkan',
'Palisade fictional rules':'Palisade protocol',
'palisade fictional rules':'Palisade protocol',
'aturan fiksi palisade':'protokol Palisade',
'Aturan fiksi Palisade':'Protokol Palisade',
'The fictional framework allows':'The Palisade protocol allows',
'Kerangka fiksi memungkinkan':'Protokol Palisade memungkinkan',
'The fictional baseline copy explains':'The baseline copy explains',
'Salinan dasar fiksi menjelaskan':'Salinan dasar menjelaskan',
'Which model fits the explicitly fictional rules and records?':'Which model fits the original protocol and records?',
'Model mana sesuai aturan fiksi eksplisit serta catatan?':'Model mana sesuai protokol asli serta catatan?',
'Which comparison respects the fictional identity rules?':'Which comparison respects the documented identity constraints?',
'Pembandingan mana menghormati aturan identitas fiksi?':'Pembandingan mana menghormati batas identitas terdokumentasi?',
'The duplication rules are fictional and explicitly bounded.':'Use the original Palisade protocol to test both accounts.',
'Aturan duplikasi bersifat fiksi serta terbatas eksplisit.':'Gunakan protokol asli Palisade untuk menguji kedua keterangan.',
'A twenty-year-old fictional experiment':'A twenty-year-old experiment',
'Eksperimen fiksi dua puluh tahun lalu':'Eksperimen dua puluh tahun lalu',
'A proven real-world cloning method with no invented rules':'Unrestricted duplication without any project limits',
'Metode kloning dunia nyata terbukti tanpa aturan ciptaan':'Duplikasi tanpa batas proyek apa pun',
'The fictional OR-9 apparatus':'The OR-9 apparatus',
'Alat fiksi OR-9':'Alat OR-9',
'This safe fictional sandbox sends no files. Select a presentation, then inspect how the same outcome is framed. Your response is not a psychological diagnosis.':'Select a presentation and inspect how the same decision is framed. Then compare the label with the destination.',
'Simulasi fiksi aman ini tidak mengirim berkas. Pilih penyajian, lalu periksa bagaimana hasil sama dibingkai. Respons kamu bukan diagnosis psikologis.':'Pilih penyajian dan periksa bagaimana keputusan sama dibingkai. Lalu bandingkan label dengan tujuannya.',
'No export is performed here.':'',
'Tidak ada ekspor dilakukan di sini.':'',
' The playable radio uses synthetic audio examples, not real radio transmission.':'',
' Radio permainan memakai contoh audio sintetis, bukan transmisi radio nyata.':'',
' Audio playback is a synthetic illustration and sends no radio signal.':'',
' Pemutaran audio adalah ilustrasi sintetis dan tidak mengirim sinyal radio.':'',
'The four views join independent clocks, a building schematic and responder records; there is no countdown or operational instruction.':'The four views join independent clocks, a building schematic and responder records.',
'Empat tampilan menggabungkan jam independen, skema gedung, serta catatan petugas; tanpa hitung mundur atau instruksi operasional.':'Empat tampilan menggabungkan jam independen, skema gedung, serta catatan petugas.'
}
def polish(v):
 if isinstance(v,list):return [polish(x) for x in v]
 if isinstance(v,dict):return {k:polish(x) for k,x in v.items()}
 if isinstance(v,str):
  for a,b in replacements.items():v=v.replace(a,b)
  v=v.replace('the story’s copied','the project’s copied').replace('yang disalin pada usia 22 dalam cerita','yang disalin pada usia 22')
  return re.sub(r' +',' ',v).strip()
 return v
cases=polish(cases)
