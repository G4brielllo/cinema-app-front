<template>
  <v-carousel v-if="slides.length!=0"  height="600" show-arrows="hover" hide-delimiters cycle interval="5000">
    <v-carousel-item v-for="slide in slides" :key="slide.id">
      <div class="slider-item">
        <v-img :src="slide.image_url" height="600" cover />
        <h1 class="slider-label">
          <strong>{{ slide.title }}</strong>
        </h1>
        <v-btn
          v-if="slide.trailer_url"
          icon="mdi-play-circle"
          color="white"
          class="slider-play-btn"
          @click.stop="openTrailer(slide.trailer_url)"
        ></v-btn>
      </div>
    </v-carousel-item>
  </v-carousel>

  <v-dialog v-model="trailerDialog" max-width="800px">
    <v-card>
      <v-card-title>Zwiastun</v-card-title>
      <v-card-text>
        <iframe
          v-if="currentTrailerUrl"
          :src="currentTrailerUrl"
          width="100%"
          height="400"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="trailerDialog = false">Zamknij</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      slides: [],
      slide: {
        title: "",
        image_url: "",
        trailer_url: "",
        position: null,
      },
      trailerDialog: false,
      currentTrailerUrl: "",
    };
  },
  created() {
    this.fetchSlides();
  },
  methods: {
    async fetchSlides() {
      try {
        const response = await axios.get("http://localhost:8000/api/slides", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.slides = response.data;
        console.log("Pobrano slajd", response.data);
      } catch (error) {
        console.error("Błąd przy pobieranu slajdów", error);
      }
    },
    openTrailer(url) {
      if (!url) return;
      const embedUrl = url.replace("watch?v=", "embed/");

      this.currentTrailerUrl = embedUrl;
      this.trailerDialog = true;
    },
  },
};
</script>

<style>
.slider-label {
  position: absolute;
  left: 16px;
  bottom: 16px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 1.2rem;
  z-index: 2;
}
.slider-item {
  position: relative;
  height: 100%;
}

.slider-label {
  position: absolute;
  left: 16px;
  bottom: 16px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 1.2rem;
  z-index: 2;
}

.slider-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  pointer-events: auto;
}

.slider-item:hover .slider-play-btn {
  opacity: 1;
}
</style>
