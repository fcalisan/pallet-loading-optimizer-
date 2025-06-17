<template>
  <div class="home">
    <el-container>
      <el-header>
        <h1>Palet Yükleme Optimizasyon Paneli</h1>
      </el-header>

      <el-main>
        <el-row :gutter="20" class="hizli-erisim">
          <el-col :span="6">
            <el-card class="hizli-erisim-karti" @click="$router.push('/palet-girisi')">
              <div class="kart-icerik">
                <el-icon class="kart-ikon"><Box /></el-icon>
                <h3>Palet Girişi</h3>
                <p>Yeni paletler ekleyin ve özelliklerini tanımlayın</p>
              </div>
            </el-card>
          </el-col>

          <el-col :span="6">
            <el-card class="hizli-erisim-karti" @click="$router.push('/yukleme-planlama')">
              <div class="kart-icerik">
                <el-icon class="kart-ikon"><TruckFilled /></el-icon>
                <h3>Yükleme Planlama</h3>
                <p>Optimizasyon çalıştırın ve 3D görselleştirme yapın</p>
              </div>
            </el-card>
          </el-col>

          <el-col :span="6">
            <el-card class="hizli-erisim-karti" @click="$router.push('/proje-yonetimi')">
              <div class="kart-icerik">
                <el-icon class="kart-ikon"><FolderOpened /></el-icon>
                <h3>Proje Yönetimi</h3>
                <p>Kayıtlı projelerinizi yönetin ve raporlar oluşturun</p>
              </div>
            </el-card>
          </el-col>

          <el-col :span="6">
            <el-card class="hizli-erisim-karti" @click="$router.push('/raporlar')">
              <div class="kart-icerik">
                <el-icon class="kart-ikon"><Document /></el-icon>
                <h3>Raporlar</h3>
                <p>Detaylı analiz raporları ve PDF çıktıları</p>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="istatistikler">
          <el-col :span="24">
            <el-card>
              <template #header>
                <div class="card-header">
                  <h2>Sistem Özeti</h2>
                </div>
              </template>

              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="istatistik-kutu">
                    <div class="istatistik-sayi">{{ projeStore.projeSayisi }}</div>
                    <div class="istatistik-baslik">Toplam Proje</div>
                    <div class="istatistik-aciklama">Sistemde kayıtlı proje sayısı</div>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="istatistik-kutu">
                    <div class="istatistik-sayi">{{ paletStore.paletSayisi }}</div>
                    <div class="istatistik-baslik">Aktif Palet Türü</div>
                    <div class="istatistik-aciklama">Şu anda tanımlı palet türü sayısı</div>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="istatistik-kutu">
                    <div class="istatistik-sayi">{{ projeStore.aktifProje ? 1 : 0 }}</div>
                    <div class="istatistik-baslik">Seçili Proje</div>
                    <div class="istatistik-aciklama">Şu anda aktif olan proje</div>
                  </div>
                </el-col>
              </el-row>

              <div v-if="projeStore.aktifProje" class="aktif-proje-bilgi">
                <el-divider>Aktif Proje</el-divider>
                <el-descriptions :column="3" border>
                  <el-descriptions-item label="Proje Adı">
                    {{ projeStore.aktifProje.ad }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Dorse Tipi">
                    {{ dorseTipAdi(projeStore.aktifProje.dorseBilgileri.tip) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Oluşturma Tarihi">
                    {{
                      new Date(projeStore.aktifProje.olusturmaTarihi).toLocaleDateString('tr-TR')
                    }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjeStore } from '@/stores/projeStore'
import { usePaletStore } from '@/stores/paletStore'

const projeStore = useProjeStore()
const paletStore = usePaletStore()

const dorseTipAdi = (tip) => {
  const tipIsimleri = {
    standart: 'Standart Dorse',
    mega: 'Mega Dorse',
    jumbo: 'Jumbo Dorse',
    kucuk: 'Küçük Dorse',
    ozel: 'Özel Ölçü Dorse',
  }
  return tipIsimleri[tip] || tip
}

onMounted(() => {
  console.log('Ana sayfa yüklendi')
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.el-header {
  text-align: center;
  padding: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hizli-erisim {
  margin-bottom: 30px;
}

.hizli-erisim-karti {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 180px;
}

.hizli-erisim-karti:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.kart-icerik {
  text-align: center;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.kart-ikon {
  font-size: 3rem;
  color: #409eff;
  margin-bottom: 15px;
}

.kart-icerik h3 {
  margin: 10px 0;
  color: #303133;
  font-size: 1.2rem;
}

.kart-icerik p {
  color: #606266;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.istatistikler {
  margin-top: 20px;
}

.istatistik-kutu {
  text-align: center;
  padding: 20px;
  border-right: 1px solid #ebeef5;
}

.istatistik-kutu:last-child {
  border-right: none;
}

.istatistik-sayi {
  font-size: 2.5rem;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.istatistik-baslik {
  font-size: 1.1rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.istatistik-aciklama {
  font-size: 0.9rem;
  color: #909399;
  line-height: 1.4;
}

.aktif-proje-bilgi {
  margin-top: 20px;
}

.el-divider {
  margin: 20px 0;
}
</style>
