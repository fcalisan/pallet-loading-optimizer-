import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

export class RaporService {
  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.pageWidth = 210
    this.pageHeight = 297
    this.margin = 20
    this.contentWidth = this.pageWidth - this.margin * 2

    this.setupFonts()
  }

  setupFonts() {
    this.doc.setFont('helvetica')

    this.doc.setCharSpace(0)
    this.doc.setR2L(false)
  }

  addText(text, x, y, options = {}) {
    const {
      fontSize = 12,
      fontStyle = 'normal',
      color = [0, 0, 0],
      align = 'left',
      maxWidth = null,
    } = options

    this.doc.setFontSize(fontSize)
    this.doc.setFont('helvetica', fontStyle)
    this.doc.setTextColor(...color)

    const turkishText = this.encodeTurkishText(text)

    if (maxWidth && align === 'left') {
      const lines = this.doc.splitTextToSize(turkishText, maxWidth)
      this.doc.text(lines, x, y)
      return lines.length * (fontSize * 0.35)
    } else {
      this.doc.text(turkishText, x, y, { align })
      return fontSize * 0.35
    }
  }

  encodeTurkishText(text) {
    if (!text) return ''

    return text
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C')
  }

  addPageHeader(title, subtitle = '') {
    this.addText(title, this.pageWidth / 2, 30, {
      fontSize: 20,
      fontStyle: 'bold',
      color: [41, 128, 185],
      align: 'center',
    })

    if (subtitle) {
      this.addText(subtitle, this.pageWidth / 2, 40, {
        fontSize: 12,
        color: [108, 117, 125],
        align: 'center',
      })
    }

    this.doc.setDrawColor(41, 128, 185)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, 45, this.pageWidth - this.margin, 45)

    return 55
  }

  addPageFooter(pageNumber, totalPages) {
    const footerY = this.pageHeight - 15

    this.addText(`Sayfa ${pageNumber}/${totalPages}`, this.pageWidth / 2, footerY, {
      fontSize: 10,
      color: [108, 117, 125],
      align: 'center',
    })

    const now = new Date()
    const dateStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR')
    this.addText(dateStr, this.pageWidth - this.margin, footerY, {
      fontSize: 8,
      color: [108, 117, 125],
      align: 'right',
    })

    this.addText('Palet Yukleme Optimizasyon Sistemi', this.margin, footerY, {
      fontSize: 8,
      color: [108, 117, 125],
    })
  }

  async projeRaporuOlustur(projeVerileri, gorselElement = null) {
    const { proje, optimizasyonSonucu, dorseBoyutlari } = projeVerileri

    this.doc = new jsPDF('p', 'mm', 'a4')
    this.setupFonts()

    let currentPage = 1
    const totalPages = gorselElement ? 4 : 3

    await this.projeOzetiSayfasi(proje, optimizasyonSonucu, dorseBoyutlari)
    this.addPageFooter(currentPage++, totalPages)

    if (gorselElement) {
      this.doc.addPage()
      await this.gorselSayfasi(gorselElement, proje)
      this.addPageFooter(currentPage++, totalPages)
    }

    this.doc.addPage()
    this.paletDetayiSayfasi(optimizasyonSonucu, proje)
    this.addPageFooter(currentPage++, totalPages)

    this.doc.addPage()
    this.istatistikSayfasi(optimizasyonSonucu, proje)
    this.addPageFooter(currentPage, totalPages)

    return this.doc
  }

  async projeOzetiSayfasi(proje, optimizasyonSonucu, dorseBoyutlari) {
    let yPos = this.addPageHeader('PALET YUKLEME RAPORU', proje.ad)

    this.addSectionBox('PROJE BILGILERI', yPos)
    yPos += 20

    const projeInfo = [
      ['Proje Adi:', proje.ad],
      ['Aciklama:', proje.aciklama || 'Belirtilmemis'],
      ['Olusturma Tarihi:', new Date(proje.olusturmaTarihi).toLocaleDateString('tr-TR')],
      [
        'Rapor Tarihi:',
        new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR'),
      ],
    ]

    projeInfo.forEach(([label, value]) => {
      this.addText(label, this.margin + 5, yPos, { fontSize: 11, fontStyle: 'bold' })
      this.addText(value, this.margin + 50, yPos, { fontSize: 11 })
      yPos += 8
    })

    yPos += 10

    this.addSectionBox('DORSE BILGILERI', yPos)
    yPos += 20

    const dorseTipIsimleri = {
      standart: 'Standart Dorse',
      mega: 'Mega Dorse',
      jumbo: 'Jumbo Dorse',
      kucuk: 'Kucuk Dorse',
      ozel: 'Ozel Olcu Dorse',
    }

    const dorseInfo = [
      ['Dorse Tipi:', dorseTipIsimleri[proje.dorseBilgileri.tip] || proje.dorseBilgileri.tip],
      [
        'Boyutlar:',
        `${dorseBoyutlari.uzunluk}m x ${dorseBoyutlari.genislik}m x ${dorseBoyutlari.yukseklik}m`,
      ],
      ['Hacim:', `${proje.dorseBilgileri.hacim} m³`],
    ]

    dorseInfo.forEach(([label, value]) => {
      this.addText(label, this.margin + 5, yPos, { fontSize: 11, fontStyle: 'bold' })
      this.addText(value, this.margin + 50, yPos, { fontSize: 11 })
      yPos += 8
    })

    yPos += 15

    if (optimizasyonSonucu) {
      const toplamPalet =
        optimizasyonSonucu.yerlesenPaletler.length + optimizasyonSonucu.disaridaKalanPaletler.length
      const yerlesimOrani =
        toplamPalet > 0
          ? ((optimizasyonSonucu.yerlesenPaletler.length / toplamPalet) * 100).toFixed(1)
          : 0

      const istatistikData = [
        ['Toplam Palet Sayisi', toplamPalet.toString()],
        ['Yerlestirilen Palet', optimizasyonSonucu.yerlesenPaletler.length.toString()],
        ['Disarida Kalan Palet', optimizasyonSonucu.disaridaKalanPaletler.length.toString()],
        ['Yerlesim Orani', `%${yerlesimOrani}`],
        ['Doluluk Orani', `%${optimizasyonSonucu.dolulukOrani?.toFixed(1) || '0'}`],
        ['Toplam Agirlik', `${optimizasyonSonucu.toplamAgirlik || 0} kg`],
        ['Bos Alan', `%${optimizasyonSonucu.bosAlan?.toFixed(1) || '0'}`],
      ]

      this.doc.autoTable({
        startY: yPos,
        head: [['Ozellik', 'Deger']],
        body: istatistikData,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 11,
          cellPadding: 5,
        },
        columnStyles: {
          0: { cellWidth: 80, fontStyle: 'bold' },
          1: { cellWidth: 60, halign: 'center' },
        },
        margin: { left: this.margin, right: this.margin },
        tableWidth: 'wrap',
      })
    }
  }

  addSectionBox(title, yPos) {
    this.doc.setDrawColor(41, 128, 185)
    this.doc.setFillColor(240, 248, 255)
    this.doc.roundedRect(this.margin, yPos - 5, this.contentWidth, 15, 2, 2, 'FD')

    this.addText(title, this.margin + 5, yPos + 5, {
      fontSize: 14,
      fontStyle: 'bold',
      color: [41, 128, 185],
    })
  }

  async gorselSayfasi(gorselElement, proje) {
    let yPos = this.addPageHeader('3D GORSELLESTIRME', 'Palet Yerlesim Gorseli')

    if (!gorselElement) {
      this.addSectionBox('GORSEL BULUNAMADI', yPos)
      yPos += 20

      this.addText('3D gorsel elementi bulunamadi.', this.margin + 5, yPos, {
        fontSize: 12,
        color: [220, 53, 69],
      })
      yPos += 8
      this.addText('Sebep: Canvas elementi henuz olusturulmamis olabilir.', this.margin + 5, yPos, {
        fontSize: 10,
      })
      return
    }

    try {
      console.log('3D görsel yakalanıyor...', gorselElement)

      if (gorselElement.offsetWidth === 0 || gorselElement.offsetHeight === 0) {
        throw new Error('Element görünür değil')
      }

      let targetElement = gorselElement
      if (gorselElement.tagName !== 'CANVAS') {
        const canvas = gorselElement.querySelector('canvas')
        if (canvas) {
          targetElement = canvas
          console.log('Canvas bulundu:', canvas)
        } else {
          console.log('Canvas bulunamadı, container kullanılıyor')
        }
      }

      console.log('Canvas render bekleniyor...')
      await this.waitForCanvasRender(targetElement)

      let canvas = null

      if (targetElement && targetElement.tagName === 'CANVAS') {
        console.log('Three.js canvas doğrudan yakalanmaya çalışılıyor...')
        try {
          canvas = await Promise.race([
            this.captureThreeJSCanvas(targetElement),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Three.js yakalama timeout')), 5000),
            ),
          ])
        } catch (error) {
          console.warn('Three.js yakalama hatası:', error.message)
          canvas = null
        }
      }

      if (!canvas || this.isCanvasEmpty(canvas)) {
        console.log('html2canvas ile yakalanıyor...')
        try {
          canvas = await Promise.race([
            html2canvas(targetElement, {
              backgroundColor: '#f5f5f5',
              scale: 0.8,
              useCORS: true,
              allowTaint: true,
              logging: false,
              width: targetElement.offsetWidth || 800,
              height: targetElement.offsetHeight || 600,
              scrollX: 0,
              scrollY: 0,
              foreignObjectRendering: false,
              removeContainer: false,
              imageTimeout: 10000,
            }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('html2canvas timeout')), 10000),
            ),
          ])
        } catch (html2canvasError) {
          console.error('html2canvas hatası:', html2canvasError)
          canvas = this.createPlaceholderCanvas()
        }
      }

      if (!canvas) {
        console.warn('Canvas oluşturulamadı, placeholder kullanılıyor')
        canvas = this.createPlaceholderCanvas()
      }

      console.log('Canvas hazır:', canvas.width, 'x', canvas.height)

      if (this.isCanvasEmpty(canvas) && canvas.width !== 800) {
        console.warn('Canvas boş, placeholder kullanılıyor')
        canvas = this.createPlaceholderCanvas()
      }

      const imgData = canvas.toDataURL('image/png', 0.9)

      const maxWidth = this.contentWidth
      const maxHeight = 180

      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)

      const finalWidth = imgWidth * ratio
      const finalHeight = imgHeight * ratio

      const xPos = this.margin + (this.contentWidth - finalWidth) / 2

      this.doc.setDrawColor(200, 200, 200)
      this.doc.setLineWidth(0.5)
      this.doc.rect(xPos - 2, yPos - 2, finalWidth + 4, finalHeight + 4)

      this.doc.addImage(imgData, 'PNG', xPos, yPos, finalWidth, finalHeight)
      yPos += finalHeight + 15

      console.log("3D görsel PDF'e eklendi")

      this.addSectionBox('GORSEL ACIKLAMASI', yPos)
      yPos += 20

      const aciklamalar = [
        '• Yukaridaki gorsel, paletlerin dorse icindeki 3D yerlesimini gostermektedir.',
        '• Her palet farkli renklerle temsil edilmektedir.',
        '• Mavi cizgiler dorse sinirlarini temsil eder.',
        '• Paletlerin boyutlari ve konumlari gercek olculere gore hesaplanmistir.',
        '• Optimizasyon algoritmasi en verimli yerlesimi saglamistir.',
      ]

      aciklamalar.forEach((aciklama) => {
        this.addText(aciklama, this.margin + 5, yPos, { fontSize: 10 })
        yPos += 6
      })
    } catch (error) {
      console.error('Görsel eklenirken hata:', error)

      this.addSectionBox('GORSEL HATASI', yPos)
      yPos += 20

      this.addText('3D gorsel eklenemedi.', this.margin + 5, yPos, {
        fontSize: 12,
        color: [220, 53, 69],
      })
      yPos += 8
      this.addText(`Sebep: ${error.message}`, this.margin + 5, yPos, {
        fontSize: 10,
      })
      yPos += 8
      this.addText(
        'Cozum: Optimizasyon sonrasi biraz bekleyip tekrar deneyin.',
        this.margin + 5,
        yPos,
        {
          fontSize: 10,
        },
      )
    }
  }

  async waitForCanvasRender(element) {
    return new Promise((resolve) => {
      let attempts = 0
      const maxAttempts = 10
      const timeout = 3000

      const timeoutId = setTimeout(() => {
        console.log('Canvas render timeout - devam ediliyor')
        resolve()
      }, timeout)

      const checkRender = () => {
        attempts++

        if (element && element.tagName === 'CANVAS') {
          try {
            if (element.width && element.height) {
              const ctx = element.getContext('2d')
              if (ctx) {
                const imageData = ctx.getImageData(0, 0, element.width, element.height)
                if (imageData && imageData.data) {
                  const hasContent = !imageData.data.every((pixel) => pixel === 0)

                  if (hasContent || attempts >= maxAttempts) {
                    console.log(
                      `Canvas render kontrolü: ${hasContent ? 'başarılı' : 'başarısız'} (${attempts} deneme)`,
                    )
                    clearTimeout(timeoutId)
                    resolve()
                    return
                  }
                }
              }
            }
          } catch (error) {
            console.warn('Canvas render kontrolü hatası:', error)
            if (attempts >= maxAttempts) {
              clearTimeout(timeoutId)
              resolve()
              return
            }
          }
        } else if (element) {
          const canvas = element.querySelector('canvas')
          if (canvas) {
            try {
              if (canvas.width && canvas.height) {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                  if (imageData && imageData.data) {
                    const hasContent = !imageData.data.every((pixel) => pixel === 0)

                    if (hasContent || attempts >= maxAttempts) {
                      console.log(
                        `Canvas render kontrolü: ${hasContent ? 'başarılı' : 'başarısız'} (${attempts} deneme)`,
                      )
                      clearTimeout(timeoutId)
                      resolve()
                      return
                    }
                  }
                }
              }
            } catch (error) {
              console.warn('Canvas render kontrolü hatası:', error)
              if (attempts >= maxAttempts) {
                clearTimeout(timeoutId)
                resolve()
                return
              }
            }
          }
        }

        if (attempts >= maxAttempts) {
          console.log('Canvas render kontrolü maksimum deneme sayısına ulaştı')
          clearTimeout(timeoutId)
          resolve()
          return
        }

        setTimeout(checkRender, 200)
      }

      checkRender()
    })
  }

  isCanvasEmpty(canvas) {
    if (!canvas) {
      console.warn('Canvas null veya undefined')
      return true
    }

    try {
      if (!canvas.width || !canvas.height) {
        console.warn('Canvas boyutları geçersiz:', canvas.width, 'x', canvas.height)
        return true
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.warn('Canvas context alınamadı')
        return true
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      if (!imageData || !imageData.data) {
        console.warn('ImageData alınamadı')
        return true
      }

      for (let i = 0; i < imageData.data.length; i += 4) {
        if (
          imageData.data[i] !== 0 ||
          imageData.data[i + 1] !== 0 ||
          imageData.data[i + 2] !== 0 ||
          imageData.data[i + 3] !== 0
        ) {
          return false
        }
      }
      return true
    } catch (error) {
      console.warn('Canvas boşluk kontrolü hatası:', error)
      return true
    }
  }

  createPlaceholderCanvas() {
    console.log('Placeholder canvas oluşturuluyor...')

    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#cccccc'
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

    ctx.fillStyle = '#666666'
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('3D Görsel Yüklenemedi', canvas.width / 2, canvas.height / 2 - 40)

    ctx.font = '16px Arial'
    ctx.fillText('Optimizasyon tamamlandıktan sonra', canvas.width / 2, canvas.height / 2)
    ctx.fillText('tekrar rapor oluşturmayı deneyin', canvas.width / 2, canvas.height / 2 + 25)

    ctx.strokeStyle = '#999999'
    ctx.lineWidth = 3
    ctx.strokeRect(canvas.width / 2 - 60, canvas.height / 2 + 60, 120, 80)
    ctx.strokeRect(canvas.width / 2 - 50, canvas.height / 2 + 70, 100, 60)

    console.log('Placeholder canvas oluşturuldu')
    return canvas
  }

  async captureThreeJSCanvas(canvasElement) {
    try {
      console.log('Three.js canvas doğrudan yakalanıyor...')

      if (!canvasElement || !canvasElement.width || !canvasElement.height) {
        console.warn('Canvas element geçersiz:', canvasElement)
        return null
      }

      const captureCanvas = document.createElement('canvas')
      captureCanvas.width = canvasElement.width
      captureCanvas.height = canvasElement.height

      const ctx = captureCanvas.getContext('2d')
      if (!ctx) {
        console.warn('Capture canvas context alınamadı')
        return null
      }

      ctx.drawImage(canvasElement, 0, 0)

      if (this.isCanvasEmpty(captureCanvas)) {
        console.warn('Yakalanan canvas boş')
        return null
      }

      console.log('Three.js canvas başarıyla yakalandı')
      return captureCanvas
    } catch (error) {
      console.warn('Three.js canvas yakalama hatası:', error)
      return null
    }
  }

  paletDetayiSayfasi(optimizasyonSonucu, proje) {
    let yPos = this.addPageHeader('DETAYLI PALET LISTESI', 'Yerlesim Sonuclari')

    if (optimizasyonSonucu && optimizasyonSonucu.yerlesenPaletler.length > 0) {
      this.addSectionBox('YERLESTIRILEN PALETLER', yPos)
      yPos += 15

      const yerlesenData = optimizasyonSonucu.yerlesenPaletler.map((palet, index) => [
        (index + 1).toString(),
        this.encodeTurkishText(palet.id || palet.orijinalAd || 'Bilinmeyen'),
        `${(palet.en * 100).toFixed(0)}x${(palet.boy * 100).toFixed(0)}x${(palet.yukseklik * 100).toFixed(0)}`,
        `${palet.agirlik || 0}`,
        palet.istiflenebilir ? 'Evet' : 'Hayir',
        `(${(palet.konum.x / 100).toFixed(1)}, ${(palet.konum.y / 100).toFixed(1)}, ${(palet.konum.z / 100).toFixed(1)})`,
        `${palet.rotasyon || 0}°`,
      ])

      this.doc.autoTable({
        startY: yPos,
        head: [
          [
            '#',
            'Palet Adi',
            'Boyutlar (cm)',
            'Agirlik (kg)',
            'Istiflenebilir',
            'Konum (m)',
            'Rotasyon',
          ],
        ],
        body: yerlesenData,
        theme: 'striped',
        headStyles: {
          fillColor: [46, 204, 113],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 35 },
          2: { cellWidth: 28, halign: 'center' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 22, halign: 'center' },
          5: { cellWidth: 35, halign: 'center' },
          6: { cellWidth: 18, halign: 'center' },
        },
        margin: { left: this.margin, right: this.margin },
        tableWidth: 'wrap',
      })

      yPos = this.doc.lastAutoTable.finalY + 15
    }

    if (optimizasyonSonucu && optimizasyonSonucu.disaridaKalanPaletler.length > 0) {
      if (yPos > 220) {
        this.doc.addPage()
        yPos = 30
      }

      this.addSectionBox('DISARIDA KALAN PALETLER', yPos)
      yPos += 15

      const disaridaData = optimizasyonSonucu.disaridaKalanPaletler.map((palet, index) => [
        (index + 1).toString(),
        this.encodeTurkishText(palet.id || palet.orijinalAd || 'Bilinmeyen'),
        `${(palet.en * 100).toFixed(0)}x${(palet.boy * 100).toFixed(0)}x${(palet.yukseklik * 100).toFixed(0)}`,
        `${palet.agirlik || 0}`,
        palet.istiflenebilir ? 'Evet' : 'Hayir',
        'Yerlestirilemedi',
      ])

      this.doc.autoTable({
        startY: yPos,
        head: [['#', 'Palet Adi', 'Boyutlar (cm)', 'Agirlik (kg)', 'Istiflenebilir', 'Durum']],
        body: disaridaData,
        theme: 'striped',
        headStyles: {
          fillColor: [231, 76, 60],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 45 },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 22, halign: 'center' },
          4: { cellWidth: 25, halign: 'center' },
          5: { cellWidth: 36, halign: 'center' },
        },
        margin: { left: this.margin, right: this.margin },
        tableWidth: 'wrap',
      })
    }

    if (
      !optimizasyonSonucu ||
      (optimizasyonSonucu.yerlesenPaletler.length === 0 &&
        optimizasyonSonucu.disaridaKalanPaletler.length === 0)
    ) {
      this.addSectionBox('UYARI', yPos)
      yPos += 20

      this.addText(
        'Hic palet bulunamadi veya optimizasyon sonucu mevcut degil.',
        this.margin + 5,
        yPos,
        {
          fontSize: 12,
          color: [220, 53, 69],
        },
      )
    }
  }

  istatistikSayfasi(optimizasyonSonucu, proje) {
    let yPos = this.addPageHeader('ISTATISTIKLER VE ANALIZ', 'Performans Degerlendirmesi')

    if (optimizasyonSonucu) {
      this.addSectionBox('GENEL ISTATISTIKLER', yPos)
      yPos += 15

      const toplamPalet =
        optimizasyonSonucu.yerlesenPaletler.length + optimizasyonSonucu.disaridaKalanPaletler.length
      const yerlesimOrani =
        toplamPalet > 0 ? (optimizasyonSonucu.yerlesenPaletler.length / toplamPalet) * 100 : 0

      let performansDegerlendirme = ''
      let performansRenk = [0, 0, 0]
      if (yerlesimOrani >= 90) {
        performansDegerlendirme = 'Mukemmel'
        performansRenk = [46, 204, 113]
      } else if (yerlesimOrani >= 75) {
        performansDegerlendirme = 'Iyi'
        performansRenk = [52, 152, 219]
      } else if (yerlesimOrani >= 50) {
        performansDegerlendirme = 'Orta'
        performansRenk = [255, 193, 7]
      } else {
        performansDegerlendirme = 'Dusuk'
        performansRenk = [220, 53, 69]
      }

      const analizData = [
        ['Toplam Palet Sayisi', toplamPalet.toString()],
        ['Basariyla Yerlestirilen', optimizasyonSonucu.yerlesenPaletler.length.toString()],
        ['Yerlestirilemeyenler', optimizasyonSonucu.disaridaKalanPaletler.length.toString()],
        ['Yerlesim Basari Orani', `%${yerlesimOrani.toFixed(1)}`],
        ['Performans Degerlendirmesi', performansDegerlendirme],
        ['Alan Kullanim Orani', `%${optimizasyonSonucu.dolulukOrani?.toFixed(1) || '0'}`],
        ['Bos Alan Orani', `%${optimizasyonSonucu.bosAlan?.toFixed(1) || '0'}`],
        ['Toplam Yuk Agirligi', `${optimizasyonSonucu.toplamAgirlik || 0} kg`],
      ]

      this.doc.autoTable({
        startY: yPos,
        head: [['Metrik', 'Deger']],
        body: analizData,
        theme: 'grid',
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 11,
          cellPadding: 5,
        },
        columnStyles: {
          0: { cellWidth: 80, fontStyle: 'bold' },
          1: { cellWidth: 60, halign: 'center' },
        },
        margin: { left: this.margin, right: this.margin },
        tableWidth: 'wrap',
      })

      yPos = this.doc.lastAutoTable.finalY + 20

      this.addSectionBox('PERFORMANS GOSTERGESI', yPos)
      yPos += 20

      const barWidth = this.contentWidth - 20
      const barHeight = 20
      const barX = this.margin + 10

      this.doc.setFillColor(240, 240, 240)
      this.doc.rect(barX, yPos, barWidth, barHeight, 'F')

      const performansWidth = (yerlesimOrani / 100) * barWidth
      this.doc.setFillColor(...performansRenk)
      this.doc.rect(barX, yPos, performansWidth, barHeight, 'F')

      this.doc.setDrawColor(200, 200, 200)
      this.doc.rect(barX, yPos, barWidth, barHeight)

      this.addText(`%${yerlesimOrani.toFixed(1)}`, barX + barWidth / 2, yPos + 13, {
        fontSize: 12,
        fontStyle: 'bold',
        align: 'center',
        color: yerlesimOrani > 50 ? [255, 255, 255] : [0, 0, 0],
      })

      yPos += 35

      this.addSectionBox('ONERILER VE DEGERLENDIRME', yPos)
      yPos += 20

      let oneriler = []

      if (yerlesimOrani < 75) {
        oneriler.push('• Palet boyutlarini dorse olculerine gore optimize etmeyi dusunun.')
        oneriler.push('• Daha buyuk dorse tipi kullanmayi degerlendirin.')
      }

      if (optimizasyonSonucu.disaridaKalanPaletler.length > 0) {
        oneriler.push('• Yerlestirilemeyenler icin alternatif cozumler arastirin.')
        oneriler.push('• Palet boyutlarini kucultmeyi veya bolmeyi dusunun.')
      }

      if (optimizasyonSonucu.dolulukOrani < 60) {
        oneriler.push('• Alan kullanimini artirmak icin yerlesimi gozden gecirin.')
        oneriler.push('• Daha kompakt paketleme yontemleri kullanin.')
      }

      if (oneriler.length === 0) {
        oneriler.push('• Mukemmel bir yerlesim elde edilmistir!')
        oneriler.push('• Mevcut konfigurasyon optimal gorunmektedir.')
        oneriler.push('• Bu sonuclari referans olarak kullanabilirsiniz.')
      }

      oneriler.forEach((oneri) => {
        this.addText(oneri, this.margin + 5, yPos, { fontSize: 11 })
        yPos += 7
      })
    } else {
      this.addSectionBox('UYARI', yPos)
      yPos += 20

      this.addText('Optimizasyon sonucu bulunamadi.', this.margin + 5, yPos, {
        fontSize: 12,
        color: [220, 53, 69],
      })
    }
  }

  raporOlustur(yerlesimSonucu, dorseBoyutlari) {
    this.doc = new jsPDF()

    this.doc.setFontSize(20)
    this.doc.text('Palet Yükleme Raporu', 105, 20, { align: 'center' })

    this.doc.setFontSize(12)
    this.doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, 30)

    this.doc.setFontSize(14)
    this.doc.text('Dorse Bilgileri', 20, 40)
    this.doc.setFontSize(12)
    this.doc.text(`Uzunluk: ${dorseBoyutlari.uzunluk}m`, 20, 50)
    this.doc.text(`Genişlik: ${dorseBoyutlari.genislik}m`, 20, 55)
    this.doc.text(`Yükseklik: ${dorseBoyutlari.yukseklik}m`, 20, 60)

    this.doc.setFontSize(14)
    this.doc.text('Yükleme İstatistikleri', 20, 75)
    this.doc.setFontSize(12)
    this.doc.text(
      `Toplam Palet: ${yerlesimSonucu.yerlesenPaletler.length + yerlesimSonucu.disaridaKalanPaletler.length}`,
      20,
      85,
    )
    this.doc.text(`Yerleştirilen Palet: ${yerlesimSonucu.yerlesenPaletler.length}`, 20, 90)
    this.doc.text(`Dışarıda Kalan Palet: ${yerlesimSonucu.disaridaKalanPaletler.length}`, 20, 95)
    this.doc.text(`Boş Alan: %${yerlesimSonucu.bosAlan?.toFixed(2) || '0'}`, 20, 100)

    return this.doc
  }
}
