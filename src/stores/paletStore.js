import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePaletStore = defineStore('palet', () => {
  const paletler = ref([])

  const paletSayisi = computed(() => paletler.value.length)

  const toplamHacim = computed(() => {
    return paletler.value.reduce((toplam, palet) => {
      const paletHacmi = (palet.en / 100) * (palet.boy / 100) * (palet.yukseklik / 100)
      return toplam + paletHacmi * palet.adet
    }, 0)
  })

  const optimizasyonIcinPaletler = computed(() => {
    const coklanmisPaletler = []

    paletler.value.forEach((palet, index) => {
      for (let i = 0; i < palet.adet; i++) {
        coklanmisPaletler.push({
          id: `${palet.ad}_${index}_${i + 1}`,
          en: palet.en / 100,
          boy: palet.boy / 100,
          yukseklik: palet.yukseklik / 100,
          istiflenebilir: palet.istiflenebilir,
          agirlik: palet.agirlik,
          orijinalAd: palet.ad,
        })
      }
    })

    return coklanmisPaletler
  })

  const paletEkle = (palet, dorseBoyutlari = null) => {
    let dorseMaksimum = {
      en: 247,
      boy: 1360,
      yukseklik: 300,
    }

    if (dorseBoyutlari) {
      dorseMaksimum = {
        en: Math.floor(dorseBoyutlari.genislik * 100),
        boy: Math.floor(dorseBoyutlari.uzunluk * 100),
        yukseklik: Math.floor(dorseBoyutlari.yukseklik * 100),
      }
    }

    if (
      palet.en > dorseMaksimum.en ||
      palet.boy > dorseMaksimum.boy ||
      palet.yukseklik > dorseMaksimum.yukseklik
    ) {
      console.error('❌ Palet dorse ölçülerini aşıyor:', {
        palet: `${palet.en}×${palet.boy}×${palet.yukseklik}cm`,
        dorseLimiti: `${dorseMaksimum.en}×${dorseMaksimum.boy}×${dorseMaksimum.yukseklik}cm`,
        asilmaDurumlari: {
          enAsildi: palet.en > dorseMaksimum.en,
          boyAsildi: palet.boy > dorseMaksimum.boy,
          yukseklikAsildi: palet.yukseklik > dorseMaksimum.yukseklik,
        },
      })
      throw new Error(
        `Palet ölçüleri dorse sınırlarını aşıyor (${palet.en}×${palet.boy}×${palet.yukseklik}cm > ${dorseMaksimum.en}×${dorseMaksimum.boy}×${dorseMaksimum.yukseklik}cm)`,
      )
    }

    const yeniPalet = {
      ...palet,
      id: Date.now() + Math.random(),
      eklemeTarihi: new Date().toISOString(),
    }

    paletler.value.push(yeniPalet)
    console.log("✅ Store'a palet eklendi:", yeniPalet)
    return yeniPalet
  }

  const paletSil = (index) => {
    if (index >= 0 && index < paletler.value.length) {
      const silinenPalet = paletler.value.splice(index, 1)[0]
      console.log("Store'dan palet silindi:", silinenPalet)
      return silinenPalet
    }
    return null
  }

  const paletGuncelle = (index, yeniPalet) => {
    if (index >= 0 && index < paletler.value.length) {
      paletler.value[index] = { ...paletler.value[index], ...yeniPalet }
      console.log("Store'da palet güncellendi:", paletler.value[index])
      return paletler.value[index]
    }
    return null
  }

  const tumPaletleriTemizle = () => {
    const eskiPaletSayisi = paletler.value.length
    paletler.value = []
    console.log(`Store\'dan ${eskiPaletSayisi} palet temizlendi`)
  }

  const ornekPaletleriEkle = () => {
    const ornekPaletler = [
      {
        ad: 'Büyük Elektronik Palet',
        en: 160,
        boy: 120,
        yukseklik: 180,
        adet: 2,
        agirlik: 450,
        istiflenebilir: true,
      },
      {
        ad: 'Ağır Makine Parçaları',
        en: 200,
        boy: 150,
        yukseklik: 200,
        adet: 1,
        agirlik: 650,
      },
      {
        ad: 'Orta Boy Tekstil',
        en: 120,
        boy: 100,
        yukseklik: 150,
        adet: 3,
        agirlik: 200,
        istiflenebilir: true,
      },
      {
        ad: 'Küçük Gıda Ürünleri',
        en: 90,
        boy: 80,
        yukseklik: 120,
        adet: 4,
        agirlik: 150,
        istiflenebilir: true,
      },
      {
        ad: 'Uzun İnşaat Malzemesi',
        en: 180,
        boy: 200,
        yukseklik: 160,
        adet: 1,
        agirlik: 500,
        istiflenebilir: false,
      },
    ]

    ornekPaletler.forEach((palet) => paletEkle(palet))
    console.log("Geliştirilmiş örnek paletler store'a eklendi")
  }

  const randomPaletleriEkle = (dorseBoyutlari = null) => {
    const paletIsimleri = [
      'Elektronik Ürünler',
      'Gıda Malzemeleri',
      'Tekstil Ürünleri',
      'Otomotiv Parçaları',
      'Ev Eşyaları',
      'Kitap ve Kırtasiye',
      'Spor Malzemeleri',
      'Oyuncaklar',
      'Kozmetik Ürünleri',
      'Temizlik Malzemeleri',
      'Bahçe Ürünleri',
      'Mobilya Aksesuarları',
      'İnşaat Malzemeleri',
      'Medikal Ürünler',
      'Endüstriyel Parçalar',
      'Ambalaj Malzemeleri',
    ]

    let dorseLimitleri = {
      en: 247,
      boy: 1360,
      yukseklik: 300,
    }

    if (dorseBoyutlari) {
      dorseLimitleri = {
        en: Math.floor(dorseBoyutlari.genislik * 100),
        boy: Math.floor(dorseBoyutlari.uzunluk * 100),
        yukseklik: Math.floor(dorseBoyutlari.yukseklik * 100),
      }
    }

    console.log('🎲 Random paletler üretiliyor - Dorse limitleri:', dorseLimitleri)

    const paletSayisi = Math.floor(Math.random() * 8) + 5

    const paletKategorileri = [
      {
        tip: 'Küçük',
        enAraligi: [80, 120],
        boyAraligi: [60, 100],
        yukseklikAraligi: [80, 140],
        agirlikAraligi: [50, 200],
        olasilik: 0.3,
      },
      {
        tip: 'Orta',
        enAraligi: [100, 160],
        boyAraligi: [80, 140],
        yukseklikAraligi: [120, 180],
        agirlikAraligi: [150, 400],
        olasilik: 0.4,
      },
      {
        tip: 'Büyük',
        enAraligi: [140, 200],
        boyAraligi: [120, 200],
        yukseklikAraligi: [150, 220],
        agirlikAraligi: [300, 600],
        olasilik: 0.25,
      },
      {
        tip: 'Çok Büyük',
        enAraligi: [180, Math.min(dorseLimitleri.en - 20, 240)],
        boyAraligi: [160, Math.min(dorseLimitleri.boy * 0.3, 300)],
        yukseklikAraligi: [180, Math.min(dorseLimitleri.yukseklik - 20, 280)],
        agirlikAraligi: [400, 800],
        olasilik: 0.05,
      },
    ]

    for (let i = 0; i < paletSayisi; i++) {
      const rastgeleSayi = Math.random()
      let seciliKategori = paletKategorileri[0]
      let kumulatifOlasilik = 0

      for (const kategori of paletKategorileri) {
        kumulatifOlasilik += kategori.olasilik
        if (rastgeleSayi <= kumulatifOlasilik) {
          seciliKategori = kategori
          break
        }
      }

      const en = Math.floor(
        Math.random() * (seciliKategori.enAraligi[1] - seciliKategori.enAraligi[0]) +
          seciliKategori.enAraligi[0],
      )
      const boy = Math.floor(
        Math.random() * (seciliKategori.boyAraligi[1] - seciliKategori.boyAraligi[0]) +
          seciliKategori.boyAraligi[0],
      )
      const yukseklik = Math.floor(
        Math.random() * (seciliKategori.yukseklikAraligi[1] - seciliKategori.yukseklikAraligi[0]) +
          seciliKategori.yukseklikAraligi[0],
      )

      const hacim = (en * boy * yukseklik) / 1000000
      const baseAgirlik = Math.floor(
        Math.random() * (seciliKategori.agirlikAraligi[1] - seciliKategori.agirlikAraligi[0]) +
          seciliKategori.agirlikAraligi[0],
      )
      const hacimBazliAgirlik = Math.floor(hacim * (200 + Math.random() * 300))
      const agirlik = Math.floor((baseAgirlik + hacimBazliAgirlik) / 2)

      let adet
      if (seciliKategori.tip === 'Küçük') {
        adet = Math.floor(Math.random() * 5) + 2
      } else if (seciliKategori.tip === 'Orta') {
        adet = Math.floor(Math.random() * 3) + 1
      } else {
        adet = Math.floor(Math.random() * 2) + 1
      }

      let istiflenebilir
      if (agirlik > 500 || seciliKategori.tip === 'Çok Büyük') {
        istiflenebilir = Math.random() > 0.7
      } else if (agirlik > 300 || seciliKategori.tip === 'Büyük') {
        istiflenebilir = Math.random() > 0.4
      } else {
        istiflenebilir = Math.random() > 0.2
      }

      const randomPalet = {
        ad: `${paletIsimleri[Math.floor(Math.random() * paletIsimleri.length)]} (${seciliKategori.tip}) #${i + 1}`,
        en,
        boy,
        yukseklik,
        adet,
        agirlik,
        istiflenebilir,
      }

      console.log(`🎲 Random palet ${i + 1} üretildi (${seciliKategori.tip}):`, {
        ad: randomPalet.ad,
        boyutlar: `${randomPalet.en}×${randomPalet.boy}×${randomPalet.yukseklik}cm`,
        hacim: `${hacim.toFixed(3)}m³`,
        agirlik: `${randomPalet.agirlik}kg`,
        adet: randomPalet.adet,
        istiflenebilir: randomPalet.istiflenebilir,
        dorseLimitleri: `${dorseLimitleri.en}×${dorseLimitleri.boy}×${dorseLimitleri.yukseklik}cm`,
        uygunluk: {
          enUygun: randomPalet.en <= dorseLimitleri.en,
          boyUygun: randomPalet.boy <= dorseLimitleri.boy,
          yukseklikUygun: randomPalet.yukseklik <= dorseLimitleri.yukseklik,
        },
      })

      try {
        paletEkle(randomPalet, dorseBoyutlari)
      } catch (error) {
        console.warn(`⚠️ Palet ${i + 1} ekleme hatası, küçültülüyor:`, error.message)
        const kucukPalet = {
          ...randomPalet,
          en: Math.min(randomPalet.en, dorseLimitleri.en * 0.9),
          boy: Math.min(randomPalet.boy, dorseLimitleri.boy * 0.2),
          yukseklik: Math.min(randomPalet.yukseklik, dorseLimitleri.yukseklik * 0.9),
        }
        try {
          paletEkle(kucukPalet, dorseBoyutlari)
          console.log(`✅ Küçültülmüş palet eklendi:`, kucukPalet)
        } catch (secondError) {
          console.error(`❌ Palet ${i + 1} hiç eklenemedi:`, secondError.message)
        }
      }
    }

    console.log(`🎲 ${paletSayisi} adet geliştirilmiş random palet üretimi tamamlandı`)
  }

  return {
    paletler,

    paletSayisi,
    toplamHacim,
    optimizasyonIcinPaletler,

    paletEkle,
    paletSil,
    paletGuncelle,
    tumPaletleriTemizle,
    ornekPaletleriEkle,
    randomPaletleriEkle,
  }
})
