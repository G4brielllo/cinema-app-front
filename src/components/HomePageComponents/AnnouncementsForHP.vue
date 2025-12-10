<template>
  <v-container>
    <div class="carousel-wrapper">
      <div class="carousel">
        <v-card
          v-for="announcement in announcements"
          :key="announcement.id"
          class="announcement-card"
          @click="goToMovieDetails(announcement.id)"
        >
          <div class="image-wrapper">
            <v-img :src="announcement.image" cover class="announcement-img" />
          </div>

          <div class="announcement-info">
            <h3 class="announcement-title">{{ announcement.title }}</h3>

            <p class="announcement-premiere">
              <strong>Premiera:</strong> {{ formatDate(announcement.playing_from) }}
            </p>
          </div>
        </v-card>
      </div>
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
      return `${day}.${month}.${year}`;
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
  overflow-x: auto;
  padding: 20px 0;
  -webkit-overflow-scrolling: touch;
}

.carousel {
  display: flex;
  gap: 20px;
  min-width: max-content;
}

.announcement-card {
  width: 220px;
  border-radius: 20px;
  overflow: hidden;
  background: #212121;
  color: white;
  cursor: pointer;
  transition: 0.3s ease;
}

.announcement-card:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
  z-index: 3;
}

.image-wrapper {
  position: relative;
}

.announcement-img {
  height: 320px;
  object-fit: cover;
}

.announcement-info {
  padding: 15px 10px;
  text-align: center;
}

.announcement-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 6px;
  white-space: normal;
}

.announcement-premiere {
  font-size: 14px;
  opacity: 0.85;
}
</style>
