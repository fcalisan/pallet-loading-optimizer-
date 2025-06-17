<template>
  <div class="proje-yonetimi">
    <h2>Proje Yönetimi</h2>

    <el-row :gutter="20" class="istatistik-kartlari">
      <el-col :span="6">
        <el-card class="istatistik-karti">
          <div class="istatistik-icerik">
            <div class="istatistik-sayi">{{ projeStore.projeSayisi }}</div>
            <div class="istatistik-baslik">Toplam Proje</div>
          </div>
          <el-icon class="istatistik-ikon"><Folder /></el-icon>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="istatistik-karti">
          <div class="istatistik-icerik">
            <div class="istatistik-sayi">{{ aktifProjeSayisi }}</div>
            <div class="istatistik-baslik">Aktif Proje</div>
          </div>
          <el-icon class="istatistik-ikon"><DocumentAdd /></el-icon>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="istatistik-karti">
          <div class="istatistik-icerik">
            <div class="istatistik-sayi">{{ tamamlananProjeSayisi }}</div>
            <div class="istatistik-baslik">Tamamlanan</div>
          </div>
          <el-icon class="istatistik-ikon"><CircleCheck /></el-icon>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="istatistik-karti">
          <div class="istatistik-icerik">
            <div class="istatistik-sayi">{{ projeStore.aktifProje ? 1 : 0 }}</div>
            <div class="istatistik-baslik">Seçili Proje</div>
          </div>
          <el-icon class="istatistik-ikon"><Star /></el-icon>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="proje-listesi">
      <template #header>
        <div class="card-header">
          <h3>Kayıtlı Projeler</h3>
          <div class="button-group">
            <el-input
              v-model="aramaMetni"
              placeholder="Proje ara..."
              style="width: 200px; margin-right: 10px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select
              v-model="durumFiltresi"
              placeholder="Durum"
              style="width: 120px; margin-right: 10px"
            >
              <el-option label="Tümü" value=""></el-option>
              <el-option label="Aktif" value="aktif"></el-option>
              <el-option label="Tamamlandı" value="tamamlandi"></el-option>
              <el-option label="Arşivlendi" value="arsivlendi"></el-option>
            </el-select>
            <el-button type="danger" @click="tumProjeleriTemizle" v-if="projeStore.projeSayisi > 0">
              Tümünü Temizle
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="filtrelenmisProjeListesi" style="width: 100%" v-loading="yukleniyor">
        <el-table-column prop="ad" label="Proje Adı" width="200">
          <template #default="scope">
            <div class="proje-adi">
              <el-icon
                v-if="projeStore.aktifProje && projeStore.aktifProje.id === scope.row.id"
                class="aktif-ikon"
              >
                <Star />
              </el-icon>
              <span>{{ scope.row.ad }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="aciklama" label="Açıklama" width="250">
          <template #default="scope">
            <span class="aciklama-text">{{ scope.row.aciklama || 'Açıklama yok' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Dorse Tipi" width="150">
          <template #default="scope">
            <el-tag :type="dorseTipRengi(scope.row.dorseBilgileri.tip)">
              {{ dorseTipAdi(scope.row.dorseBilgileri.tip) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Boyutlar (m)" width="140">
          <template #default="scope">
            {{ scope.row.dorseBilgileri.boyutlar.uzunluk }}×{{
              scope.row.dorseBilgileri.boyutlar.genislik
            }}×{{ scope.row.dorseBilgileri.boyutlar.yukseklik }}
          </template>
        </el-table-column>

        <el-table-column label="Palet Sayısı" width="100" align="center">
          <template #default="scope">
            <el-badge :value="scope.row.paletler.length" class="palet-badge">
              <el-icon><Box /></el-icon>
            </el-badge>
          </template>
        </el-table-column>

        <el-table-column label="Başarı Oranı" width="120" align="center">
          <template #default="scope">
            <el-progress
              :percentage="hesaplaBasariOrani(scope.row)"
              :color="basariRengi(hesaplaBasariOrani(scope.row))"
              :stroke-width="8"
              text-inside
            />
          </template>
        </el-table-column>

        <el-table-column label="Oluşturma Tarihi" width="140">
          <template #default="scope">
            {{ new Date(scope.row.olusturmaTarihi).toLocaleDateString('tr-TR') }}
          </template>
        </el-table-column>

        <el-table-column prop="durum" label="Durum" width="100">
          <template #default="scope">
            <el-tag :type="durumRengi(scope.row.durum)">
              {{ durumAdi(scope.row.durum) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="İşlemler" width="200" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button
                type="primary"
                size="small"
                @click="projeYukle(scope.row)"
                :disabled="projeStore.aktifProje && projeStore.aktifProje.id === scope.row.id"
              >
                {{
                  projeStore.aktifProje && projeStore.aktifProje.id === scope.row.id
                    ? 'Aktif'
                    : 'Yükle'
                }}
              </el-button>
              <el-button type="success" size="small" @click="projeRaporuOlustur(scope.row)">
                PDF
              </el-button>
              <el-button type="warning" size="small" @click="projeDurumDegistir(scope.row)">
                Durum
              </el-button>
              <el-button type="danger" size="small" @click="projeSil(scope.row)"> Sil </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="sayfalama" v-if="filtrelenmisProjeListesi.length > 10">
        <el-pagination
          v-model:current-page="mevcutSayfa"
          :page-size="sayfaBasinaKayit"
          :total="filtrelenmisProjeListesi.length"
          layout="total, prev, pager, next"
          @current-change="sayfaDegisti"
        />
      </div>
    </el-card>

    <el-dialog v-model="projeDetayModalVisible" :title="secilenProje?.ad" width="800px">
      <div v-if="secilenProje" class="proje-detay">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Proje Adı">{{ secilenProje.ad }}</el-descriptions-item>
          <el-descriptions-item label="Durum">
            <el-tag :type="durumRengi(secilenProje.durum)">
              {{ durumAdi(secilenProje.durum) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Oluşturma Tarihi">
            {{ new Date(secilenProje.olusturmaTarihi).toLocaleString('tr-TR') }}
          </el-descriptions-item>
          <el-descriptions-item label="Güncelleme Tarihi">
            {{ new Date(secilenProje.guncellemeTarihi).toLocaleString('tr-TR') }}
          </el-descriptions-item>
          <el-descriptions-item label="Dorse Tipi">
            {{ dorseTipAdi(secilenProje.dorseBilgileri.tip) }}
          </el-descriptions-item>
          <el-descriptions-item label="Dorse Boyutları">
            {{ secilenProje.dorseBilgileri.boyutlar.uzunluk }}m ×
            {{ secilenProje.dorseBilgileri.boyutlar.genislik }}m ×
            {{ secilenProje.dorseBilgileri.boyutlar.yukseklik }}m
          </el-descriptions-item>
          <el-descriptions-item label="Dorse Hacmi">
            {{ secilenProje.dorseBilgileri.hacim }} m³
          </el-descriptions-item>
          <el-descriptions-item label="Palet Türü Sayısı">
            {{ secilenProje.paletler.length }}
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="secilenProje.aciklama" style="margin-top: 20px">
          <h4>Açıklama:</h4>
          <p>{{ secilenProje.aciklama }}</p>
        </div>

        <div v-if="secilenProje.optimizasyonSonucu" style="margin-top: 20px">
          <h4>Optimizasyon Sonuçları:</h4>
          <el-descriptions :column="3" border size="small">
            <el-descriptions-item label="Yerleştirilen">
              {{ secilenProje.optimizasyonSonucu.yerlesenPaletler.length }}
            </el-descriptions-item>
            <el-descriptions-item label="Dışarıda Kalan">
              {{ secilenProje.optimizasyonSonucu.disaridaKalanPaletler.length }}
            </el-descriptions-item>
            <el-descriptions-item label="Başarı Oranı">
              %{{ hesaplaBasariOrani(secilenProje) }}
            </el-descriptions-item>
            <el-descriptions-item label="Doluluk Oranı">
              %{{ secilenProje.optimizasyonSonucu.dolulukOrani?.toFixed(1) || '0' }}
            </el-descriptions-item>
            <el-descriptions-item label="Boş Alan">
              %{{ secilenProje.optimizasyonSonucu.bosAlan?.toFixed(1) || '0' }}
            </el-descriptions-item>
            <el-descriptions-item label="Toplam Ağırlık">
              {{ secilenProje.optimizasyonSonucu.toplamAgirlik || 0 }} kg
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="projeDetayModalVisible = false">Kapat</el-button>
          <el-button type="primary" @click="projeYukle(secilenProje)">Projeyi Yükle</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjeStore } from '@/stores/projeStore'
import { RaporService } from '@/services/raporService'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const projeStore = useProjeStore()
const router = useRouter()

const yukleniyor = ref(false)
const aramaMetni = ref('')
const durumFiltresi = ref('')
const mevcutSayfa = ref(1)
const sayfaBasinaKayit = ref(10)

const projeDetayModalVisible = ref(false)
const secilenProje = ref(null)

const aktifProjeSayisi = computed(() => {
  return projeStore.projeler.filter((p) => p.durum === 'aktif').length
})

const tamamlananProjeSayisi = computed(() => {
  return projeStore.projeler.filter((p) => p.durum === 'tamamlandi').length
})

const filtrelenmisProjeListesi = computed(() => {
  let projeler = [...projeStore.projeler]

  if (aramaMetni.value) {
    projeler = projeStore.projeAra(aramaMetni.value)
  }

  if (durumFiltresi.value) {
    projeler = projeler.filter((p) => p.durum === durumFiltresi.value)
  }

  return projeler.sort((a, b) => new Date(b.olusturmaTarihi) - new Date(a.olusturmaTarihi))
})

const dorseTipAdi = (tip) => {
  const tipIsimleri = {
    standart: 'Standart',
    mega: 'Mega',
    jumbo: 'Jumbo',
    kucuk: 'Küçük',
    ozel: 'Özel',
  }
  return tipIsimleri[tip] || tip
}

const dorseTipRengi = (tip) => {
  const renkler = {
    standart: '',
    mega: 'success',
    jumbo: 'warning',
    kucuk: 'info',
    ozel: 'danger',
  }
  return renkler[tip] || ''
}

const durumAdi = (durum) => {
  const durumIsimleri = {
    aktif: 'Aktif',
    tamamlandi: 'Tamamlandı',
    arsivlendi: 'Arşivlendi',
  }
  return durumIsimleri[durum] || durum
}

const durumRengi = (durum) => {
  const renkler = {
    aktif: 'primary',
    tamamlandi: 'success',
    arsivlendi: 'info',
  }
  return renkler[durum] || ''
}

const hesaplaBasariOrani = (proje) => {
  if (!proje.optimizasyonSonucu) return 0

  const toplam =
    proje.optimizasyonSonucu.yerlesenPaletler.length +
    proje.optimizasyonSonucu.disaridaKalanPaletler.length

  if (toplam === 0) return 0

  return Math.round((proje.optimizasyonSonucu.yerlesenPaletler.length / toplam) * 100)
}

const basariRengi = (oran) => {
  if (oran >= 90) return '#67c23a'
  if (oran >= 75) return '#e6a23c'
  if (oran >= 50) return '#f56c6c'
  return '#909399'
}

const projeYukle = (proje) => {
  projeStore.projeYukle(proje.id)
  ElMessage.success(`✅ "${proje.ad}" projesi yüklendi!`)

  router.push('/yukleme-planlama')
}

const projeSil = async (proje) => {
  try {
    await ElMessageBox.confirm(
      `"${proje.ad}" projesini silmek istediğinizden emin misiniz?`,
      'Proje Sil',
      {
        confirmButtonText: 'Sil',
        cancelButtonText: 'İptal',
        type: 'warning',
      },
    )

    projeStore.projeSil(proje.id)
    ElMessage.success(`✅ "${proje.ad}" projesi silindi!`)
  } catch {
    ElMessage.info('Silme işlemi iptal edildi')
  }
}

const projeDurumDegistir = async (proje) => {
  const durumSecenekleri = [
    { label: 'Aktif', value: 'aktif' },
    { label: 'Tamamlandı', value: 'tamamlandi' },
    { label: 'Arşivlendi', value: 'arsivlendi' },
  ]

  try {
    const { value: yeniDurum } = await ElMessageBox.prompt(
      'Yeni durumu seçin:',
      'Proje Durumu Değiştir',
      {
        confirmButtonText: 'Değiştir',
        cancelButtonText: 'İptal',
        inputType: 'select',
        inputOptions: durumSecenekleri.reduce((acc, item) => {
          acc[item.value] = item.label
          return acc
        }, {}),
        inputValue: proje.durum,
      },
    )

    projeStore.projeGuncelle(proje.id, { durum: yeniDurum })
    ElMessage.success(`✅ Proje durumu "${durumAdi(yeniDurum)}" olarak güncellendi!`)
  } catch {
    ElMessage.info('Durum değiştirme işlemi iptal edildi')
  }
}

const projeRaporuOlustur = async (proje) => {
  try {
    ElMessage.info('📄 PDF raporu oluşturuluyor...')

    const raporService = new RaporService()

    const projeVerileri = {
      proje: proje,
      optimizasyonSonucu: proje.optimizasyonSonucu,
      dorseBoyutlari: proje.dorseBilgileri.boyutlar,
    }

    const pdf = await raporService.projeRaporuOlustur(projeVerileri)

    const tarih = new Date().toISOString().split('T')[0]
    const dosyaAdi = `${proje.ad}_rapor_${tarih}.pdf`

    pdf.save(dosyaAdi)

    ElMessage.success('✅ PDF raporu başarıyla oluşturuldu!')
  } catch (error) {
    console.error('PDF rapor hatası:', error)
    ElMessage.error('PDF raporu oluşturulurken hata oluştu: ' + error.message)
  }
}

const tumProjeleriTemizle = async () => {
  try {
    await ElMessageBox.confirm(
      'Tüm projeleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!',
      'Tüm Projeleri Sil',
      {
        confirmButtonText: 'Tümünü Sil',
        cancelButtonText: 'İptal',
        type: 'error',
      },
    )

    projeStore.tumProjeleriTemizle()
    ElMessage.success('✅ Tüm projeler silindi!')
  } catch {
    ElMessage.info('Silme işlemi iptal edildi')
  }
}

const sayfaDegisti = (sayfa) => {
  mevcutSayfa.value = sayfa
}

onMounted(() => {
  console.log('Proje yönetimi sayfası yüklendi')
})
</script>

<style scoped>
.proje-yonetimi {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.istatistik-kartlari {
  margin-bottom: 20px;
}

.istatistik-karti {
  position: relative;
  overflow: hidden;
}

.istatistik-icerik {
  position: relative;
  z-index: 2;
}

.istatistik-sayi {
  font-size: 2.5rem;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.istatistik-baslik {
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.istatistik-ikon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 3rem;
  color: #e6f7ff;
  z-index: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.button-group {
  display: flex;
  align-items: center;
}

.proje-adi {
  display: flex;
  align-items: center;
  gap: 8px;
}

.aktif-ikon {
  color: #f7ba2a;
}

.aciklama-text {
  color: #666;
  font-style: italic;
}

.palet-badge {
  cursor: pointer;
}

.sayfalama {
  margin-top: 20px;
  text-align: center;
}

.proje-detay {
  max-height: 500px;
  overflow-y: auto;
}

.el-card {
  margin-bottom: 20px;
}

.el-table {
  font-size: 14px;
}

.el-button-group .el-button {
  padding: 5px 8px;
}
</style>
