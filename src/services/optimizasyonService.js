export class OptimizasyonService {
  constructor() {
    this.dorseBoyutlari = {
      uzunluk: 13.6, // metre
      genislik: 2.47, // metre
      yukseklik: 3.0, // metre
    }
  }

  paletleriYerlestir(paletler) {
    console.log('🚀 BASİT VE ETKİLİ Palet Yerleştirme başlatılıyor...', paletler)
    console.log('📐 Dorse boyutları:', this.dorseBoyutlari)

    const sonuc = {
      yerlesenPaletler: [],
      disaridaKalanPaletler: [],
      bosAlan: 0,
      dolulukOrani: 0,
      toplamAgirlik: 0,
      agirlikMerkezi: { x: 0, y: 0, z: 0 },
    }

    if (!paletler || paletler.length === 0) {
      console.log('❌ Palet listesi boş')
      return sonuc
    }

    const siraliPaletler = this.paletleriSirala(paletler)
    console.log(
      '📋 Paletler sıralandı:',
      siraliPaletler.map((p) => ({
        id: p.id,
        boyutlar: `${(p.en * 100).toFixed(0)}×${(p.boy * 100).toFixed(0)}×${(p.yukseklik * 100).toFixed(0)}cm`,
        agirlik: p.agirlik,
        istiflenebilir: p.istiflenebilir,
      })),
    )

    const yerlestirilmisPaletler = []

    for (const palet of siraliPaletler) {
      const enIyiKonum = this.enIyiKonumBul(palet, yerlestirilmisPaletler)

      if (enIyiKonum) {
        const yerlestirilmisPalet = {
          ...palet,
          konum: enIyiKonum.konum,
          rotasyon: enIyiKonum.rotasyon,
          gercekBoyutlar: enIyiKonum.gercekBoyutlar,
        }

        yerlestirilmisPaletler.push(yerlestirilmisPalet)
        sonuc.yerlesenPaletler.push(yerlestirilmisPalet)
        sonuc.toplamAgirlik += palet.agirlik || 0

        console.log(`✅ Palet yerleştirildi: ${palet.id}`, {
          konum: `(${(enIyiKonum.konum.x * 100).toFixed(0)}, ${(enIyiKonum.konum.y * 100).toFixed(0)}, ${(enIyiKonum.konum.z * 100).toFixed(0)})cm`,
          boyutlar: `${(enIyiKonum.gercekBoyutlar.en * 100).toFixed(0)}×${(enIyiKonum.gercekBoyutlar.boy * 100).toFixed(0)}×${(enIyiKonum.gercekBoyutlar.yukseklik * 100).toFixed(0)}cm`,
          rotasyon: enIyiKonum.rotasyon,
        })
      } else {
        sonuc.disaridaKalanPaletler.push(palet)
        console.log(`❌ Palet yerleştirilemedi: ${palet.id}`)
      }
    }

    this.istatistikleriHesapla(sonuc)

    console.log('🎯 Optimizasyon tamamlandı:', {
      toplamPalet: paletler.length,
      yerlesenPalet: sonuc.yerlesenPaletler.length,
      disaridaKalanPalet: sonuc.disaridaKalanPaletler.length,
      basariOrani: ((sonuc.yerlesenPaletler.length / paletler.length) * 100).toFixed(2) + '%',
    })

    return sonuc
  }

  paletleriSirala(paletler) {
    return [...paletler].sort((a, b) => {
      if (!a.istiflenebilir && b.istiflenebilir) return -1
      if (a.istiflenebilir && !b.istiflenebilir) return 1

      const agirlikFarki = (b.agirlik || 0) - (a.agirlik || 0)
      if (Math.abs(agirlikFarki) > 10) return agirlikFarki

      const hacimA = a.en * a.boy * a.yukseklik
      const hacimB = b.en * b.boy * b.yukseklik
      return hacimB - hacimA
    })
  }

  enIyiKonumBul(palet, yerlestirilmisPaletler) {
    console.log(
      `🔍 ${palet.id} için konum aranıyor... (Boyutlar: ${(palet.en * 100).toFixed(0)}×${(palet.boy * 100).toFixed(0)}×${(palet.yukseklik * 100).toFixed(0)}cm)`,
    )

    const rotasyonlar = this.rotasyonSeçenekleri(palet)

    let enIyiKonum = null
    let enIyiSkor = -1

    for (const rotasyon of rotasyonlar) {
      for (let z = 0; z <= this.dorseBoyutlari.yukseklik - rotasyon.yukseklik; z += 0.05) {
        for (let x = 0; x <= this.dorseBoyutlari.uzunluk - rotasyon.en; x += 0.05) {
          for (let y = 0; y <= this.dorseBoyutlari.genislik - rotasyon.boy; y += 0.05) {
            const konum = { x, y, z }

            if (this.konumGecerliMi(konum, rotasyon, yerlestirilmisPaletler, palet)) {
              const skor = this.konumSkoruHesapla(konum, rotasyon, yerlestirilmisPaletler)

              if (skor > enIyiSkor) {
                enIyiSkor = skor
                enIyiKonum = {
                  konum,
                  rotasyon: rotasyon.rotasyon,
                  gercekBoyutlar: {
                    en: rotasyon.en,
                    boy: rotasyon.boy,
                    yukseklik: rotasyon.yukseklik,
                  },
                }
              }
            }
          }
        }
      }
    }

    return enIyiKonum
  }

  rotasyonSeçenekleri(palet) {
    const rotasyonlar = []

    rotasyonlar.push({
      en: palet.en,
      boy: palet.boy,
      yukseklik: palet.yukseklik,
      rotasyon: 0,
    })

    if (Math.abs(palet.en - palet.boy) > 0.05) {
      rotasyonlar.push({
        en: palet.boy,
        boy: palet.en,
        yukseklik: palet.yukseklik,
        rotasyon: 90,
      })
    }

    return rotasyonlar
  }

  konumGecerliMi(konum, boyutlar, yerlestirilmisPaletler, palet) {
    if (konum.x + boyutlar.en > this.dorseBoyutlari.uzunluk) return false
    if (konum.y + boyutlar.boy > this.dorseBoyutlari.genislik) return false
    if (konum.z + boyutlar.yukseklik > this.dorseBoyutlari.yukseklik) return false

    for (const yerlestirilmis of yerlestirilmisPaletler) {
      if (this.paletlerCakisiyorMu(konum, boyutlar, yerlestirilmis)) {
        return false
      }
    }

    if (konum.z > 0) {
      if (!palet.istiflenebilir) {
        return false
      }

      if (!this.yeterliDestekVarMi(konum, boyutlar, yerlestirilmisPaletler)) {
        return false
      }
    }

    return true
  }

  paletlerCakisiyorMu(konum1, boyutlar1, yerlestirilmisPalet) {
    const konum2 = yerlestirilmisPalet.konum
    const boyutlar2 = yerlestirilmisPalet.gercekBoyutlar

    if (konum1.x >= konum2.x + boyutlar2.en || konum2.x >= konum1.x + boyutlar1.en) {
      return false
    }

    if (konum1.y >= konum2.y + boyutlar2.boy || konum2.y >= konum1.y + boyutlar1.boy) {
      return false
    }

    if (konum1.z >= konum2.z + boyutlar2.yukseklik || konum2.z >= konum1.z + boyutlar1.yukseklik) {
      return false
    }

    return true
  }

  yeterliDestekVarMi(konum, boyutlar, yerlestirilmisPaletler) {
    let destekAlani = 0
    const toplamAlan = boyutlar.en * boyutlar.boy
    const altZ = konum.z - 0.01

    for (const yerlestirilmis of yerlestirilmisPaletler) {
      const altKonum = yerlestirilmis.konum
      const altBoyutlar = yerlestirilmis.gercekBoyutlar

      if (altKonum.z + altBoyutlar.yukseklik <= konum.z + 0.05) {
        const kesisimAlani = this.kesisimAlaniHesapla(konum, boyutlar, altKonum, altBoyutlar)
        destekAlani += kesisimAlani
      }
    }

    const destekOrani = destekAlani / toplamAlan
    return destekOrani >= 0.7
  }

  kesisimAlaniHesapla(konum1, boyutlar1, konum2, boyutlar2) {
    const x1 = Math.max(konum1.x, konum2.x)
    const y1 = Math.max(konum1.y, konum2.y)
    const x2 = Math.min(konum1.x + boyutlar1.en, konum2.x + boyutlar2.en)
    const y2 = Math.min(konum1.y + boyutlar1.boy, konum2.y + boyutlar2.boy)

    if (x2 > x1 && y2 > y1) {
      return (x2 - x1) * (y2 - y1)
    }
    return 0
  }

  konumSkoruHesapla(konum, boyutlar, yerlestirilmisPaletler) {
    let skor = 0

    if (konum.x === 0 && konum.y === 0) skor += 100
    else if (konum.x === 0 || konum.y === 0) skor += 50

    if (konum.z === 0) skor += 50

    let komsuSayisi = 0
    for (const yerlestirilmis of yerlestirilmisPaletler) {
      const mesafe = this.paletlerArasiMesafe(
        konum,
        boyutlar,
        yerlestirilmis.konum,
        yerlestirilmis.gercekBoyutlar,
      )
      if (mesafe < 0.2) {
        komsuSayisi++
      }
    }
    skor += komsuSayisi * 20

    skor -= konum.z * 10

    return skor
  }

  paletlerArasiMesafe(konum1, boyutlar1, konum2, boyutlar2) {
    const merkez1 = {
      x: konum1.x + boyutlar1.en / 2,
      y: konum1.y + boyutlar1.boy / 2,
      z: konum1.z + boyutlar1.yukseklik / 2,
    }

    const merkez2 = {
      x: konum2.x + boyutlar2.en / 2,
      y: konum2.y + boyutlar2.boy / 2,
      z: konum2.z + boyutlar2.yukseklik / 2,
    }

    return Math.sqrt(
      Math.pow(merkez1.x - merkez2.x, 2) +
        Math.pow(merkez1.y - merkez2.y, 2) +
        Math.pow(merkez1.z - merkez2.z, 2),
    )
  }

  istatistikleriHesapla(sonuc) {
    const toplamHacim =
      this.dorseBoyutlari.uzunluk * this.dorseBoyutlari.genislik * this.dorseBoyutlari.yukseklik

    if (sonuc.yerlesenPaletler.length === 0) {
      sonuc.dolulukOrani = 0
      sonuc.bosAlan = 100
      sonuc.bosHacimM3 = toplamHacim
      sonuc.kullanilanHacimM3 = 0
      sonuc.toplamHacimM3 = toplamHacim
      return
    }

    let kullanilanHacim = 0
    sonuc.yerlesenPaletler.forEach((palet) => {
      kullanilanHacim +=
        palet.gercekBoyutlar.en * palet.gercekBoyutlar.boy * palet.gercekBoyutlar.yukseklik // zaten m³
    })

    sonuc.kullanilanHacimM3 = parseFloat(kullanilanHacim.toFixed(3))
    sonuc.toplamHacimM3 = parseFloat(toplamHacim.toFixed(3))
    sonuc.bosHacimM3 = parseFloat((toplamHacim - kullanilanHacim).toFixed(3))
    sonuc.dolulukOrani = parseFloat(((kullanilanHacim / toplamHacim) * 100).toFixed(2))
    sonuc.bosAlan = parseFloat((100 - sonuc.dolulukOrani).toFixed(2))

    if (sonuc.yerlesenPaletler.length > 0) {
      let toplamAgirlikX = 0
      let toplamAgirlikY = 0
      let toplamAgirlikZ = 0
      let toplamAgirlik = 0

      sonuc.yerlesenPaletler.forEach((palet) => {
        const agirlik = palet.agirlik || 1
        const merkezX = palet.konum.x + palet.gercekBoyutlar.en / 2
        const merkezY = palet.konum.y + palet.gercekBoyutlar.boy / 2
        const merkezZ = palet.konum.z + palet.gercekBoyutlar.yukseklik / 2

        toplamAgirlikX += merkezX * agirlik
        toplamAgirlikY += merkezY * agirlik
        toplamAgirlikZ += merkezZ * agirlik
        toplamAgirlik += agirlik
      })

      if (toplamAgirlik > 0) {
        sonuc.agirlikMerkezi = {
          x: parseFloat((toplamAgirlikX / toplamAgirlik).toFixed(2)),
          y: parseFloat((toplamAgirlikY / toplamAgirlik).toFixed(2)),
          z: parseFloat((toplamAgirlikZ / toplamAgirlik).toFixed(2)),
        }
      }
    }

    sonuc.performansMetrikleri = {
      paletYerlestirmeBasariOrani: parseFloat(
        (
          (sonuc.yerlesenPaletler.length /
            (sonuc.yerlesenPaletler.length + sonuc.disaridaKalanPaletler.length)) *
          100
        ).toFixed(2),
      ),
      ortalamaPaletHacmi:
        sonuc.yerlesenPaletler.length > 0
          ? parseFloat((kullanilanHacim / sonuc.yerlesenPaletler.length).toFixed(3))
          : 0,
      hacimVerimliligi: parseFloat((sonuc.dolulukOrani / 100).toFixed(3)),
      agirlikDagilimi: {
        toplamAgirlik: sonuc.toplamAgirlik,
        ortalamaPaletAgirlik:
          sonuc.yerlesenPaletler.length > 0
            ? parseFloat((sonuc.toplamAgirlik / sonuc.yerlesenPaletler.length).toFixed(2))
            : 0,
      },
    }

    console.log('📊 Detaylı İstatistikler:', {
      kullanilanHacim: `${sonuc.kullanilanHacimM3} m³`,
      bosHacim: `${sonuc.bosHacimM3} m³`,
      dolulukOrani: `${sonuc.dolulukOrani}%`,
      agirlikMerkezi: sonuc.agirlikMerkezi,
      performans: sonuc.performansMetrikleri,
    })
  }
}
