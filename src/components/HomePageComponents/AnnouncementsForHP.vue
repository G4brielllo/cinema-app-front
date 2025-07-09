<template>
  <v-container>
    <div class="carousel-wrapper">
      <v-btn icon @click="scroll(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <div class="carousel" ref="carousel">
        <div
          class="carousel-item"
          v-for="announcement in announcements"
          :key="announcement.id"
        >
          <v-card
            @click="goToMovieDetails(announcement.id)"
            variant="flat"
            class="mx-2"
            :width="cardWidth"
          >
            <v-img :src="announcement.image" height="300" cover />
            <v-card-title style="white-space: normal; word-break: break-word">
              {{ announcement.title }}
            </v-card-title>
            <v-card-subtitle
              >Premiera:
              {{ formatDate(announcement.playing_from) }}</v-card-subtitle
            >
          </v-card>
        </div>
      </div>

      <v-btn icon @click="scroll(1)">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      announcements: [],
      announcement: {
        title: "",
        category: "",
        show_time: "",
        duration: "",
        playing_from: "",
        playing_until: "",
        description: "",
        direction: "",
        script: "",
        release_date: "",
        cast: "",
        image: null,
      },
      cardWidth: 200,
      visibleCards: 5,
    };
  },
  mounted() {
    this.fetchAnnouncements();
  },
  methods: {
    async fetchAnnouncements() {
      try {
        const response = await axios.get("http://localhost:8000/api/movies", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.announcements = response.data.filter(
          (movie) => movie.status === "announcement"
        );
      } catch (error) {
        console.error("Błąd przy pobieraniu danych filmów:", error);
      }
    },
    goToMovieDetails(movieId) {
      this.$router.push({
        path: "/movieDetails",
        query: { movieId },
      });
    },
    formatDate(date) {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },
    scroll(direction) {
      const container = this.$refs.carousel;
      const scrollAmount = this.cardWidth * direction;
      if (container) {
        container.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style scoped>
.carousel-wrapper {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.carousel {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  width: 100%;
  padding: 10px 0;
}

.carousel-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
}
.v-card-title {
  white-space: normal;
  word-break: break-word;
}
</style>
