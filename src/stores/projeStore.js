import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProjeStore = defineStore('proje', () => {
  const projeler = ref([])
  const aktifProje = ref(null)

  const projeSayisi = computed(() => projeler.value.length)

  const sonProjeler = computed(() => {
    return projeler.value
      .sort((a, b) => new Date(b.olusturmaTarihi) - new Date(a.olusturmaTarihi))
      .slice(0, 10)
  })

  const projeKaydet = (projeVerileri) => {
    const yeniProje = {
      id: Date.now() + Math.random(),
      ad: projeVerileri.ad || `Proje ${projeler.value.length + 1}`,
      aciklama: projeVerileri.aciklama || '',
      olusturmaTarihi: new Date().toISOString(),
      guncellemeTarihi: new Date().toISOString(),

      dorseBilgileri: {
        tip: projeVerileri.dorseTip,
        boyutlar: { ...projeVerileri.dorseBoyutlari },
        hacim: (
          projeVerileri.dorseBoyutlari.uzunluk *
          projeVerileri.dorseBoyutlari.genislik *
          projeVerileri.dorseBoyutlari.yukseklik
        ).toFixed(2),
      },

      paletler: projeVerileri.paletler ? [...projeVerileri.paletler] : [],

      optimizasyonSonucu: projeVerileri.optimizasyonSonucu
        ? {
            ...projeVerileri.optimizasyonSonucu,
            yerlesenPaletler: [...projeVerileri.optimizasyonSonucu.yerlesenPaletler],
            disaridaKalanPaletler: [...projeVerileri.optimizasyonSonucu.disaridaKalanPaletler],
          }
        : null,

      istatistikler: projeVerileri.istatistikler || {
        toplamPalet: 0,
        yerlesenPalet: 0,
        disaridaKalanPalet: 0,
        dolulukOrani: 0,
        toplamAgirlik: 0,
      },

      durum: 'aktif',
    }

    projeler.value.push(yeniProje)
    aktifProje.value = yeniProje

    console.log('✅ Proje kaydedildi:', yeniProje)
    return yeniProje
  }

  const projeGuncelle = (projeId, guncelVeriler) => {
    const projeIndex = projeler.value.findIndex((p) => p.id === projeId)

    if (projeIndex !== -1) {
      projeler.value[projeIndex] = {
        ...projeler.value[projeIndex],
        ...guncelVeriler,
        guncellemeTarihi: new Date().toISOString(),
      }

      if (aktifProje.value && aktifProje.value.id === projeId) {
        aktifProje.value = projeler.value[projeIndex]
      }

      console.log('✅ Proje güncellendi:', projeler.value[projeIndex])
      return projeler.value[projeIndex]
    }

    return null
  }

  const projeSil = (projeId) => {
    const projeIndex = projeler.value.findIndex((p) => p.id === projeId)

    if (projeIndex !== -1) {
      const silinenProje = projeler.value.splice(projeIndex, 1)[0]

      if (aktifProje.value && aktifProje.value.id === projeId) {
        aktifProje.value = null
      }

      console.log('🗑️ Proje silindi:', silinenProje)
      return silinenProje
    }

    return null
  }

  const projeYukle = (projeId) => {
    const proje = projeler.value.find((p) => p.id === projeId)

    if (proje) {
      aktifProje.value = proje
      console.log('📂 Proje yüklendi:', proje)
      return proje
    }

    return null
  }

  const aktifProjeyiTemizle = () => {
    aktifProje.value = null
  }

  const tumProjeleriTemizle = () => {
    projeler.value = []
    aktifProje.value = null
    console.log('🧹 Tüm projeler temizlendi')
  }

  const projeAra = (aramaMetni) => {
    if (!aramaMetni) return projeler.value

    const aranan = aramaMetni.toLowerCase()
    return projeler.value.filter(
      (proje) =>
        proje.ad.toLowerCase().includes(aranan) ||
        proje.aciklama.toLowerCase().includes(aranan) ||
        proje.dorseBilgileri.tip.toLowerCase().includes(aranan),
    )
  }

  const projeFiltreleyeDurum = (durum) => {
    if (!durum) return projeler.value
    return projeler.value.filter((proje) => proje.durum === durum)
  }

  return {
    projeler,
    aktifProje,

    projeSayisi,
    sonProjeler,

    projeKaydet,
    projeGuncelle,
    projeSil,
    projeYukle,
    aktifProjeyiTemizle,
    tumProjeleriTemizle,
    projeAra,
    projeFiltreleyeDurum,
  }
})
