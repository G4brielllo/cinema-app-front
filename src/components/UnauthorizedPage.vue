<template>
  <div class="unauthorized-container">
    <div class="card">
      <div class="icon">🔒</div>
      <h1>Brak dostępu</h1>
      <p>Nie masz uprawnień, aby wyświetlić tę stronę.</p>
      <router-link class="back-button" to="/">⟵ Wróć na stronę główną</router-link>
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(145deg, #f0f0f0, #ffffff);
  font-family: 'Segoe UI', sans-serif;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #c0392b;
}

h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

.back-button {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: #3498db;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #2980b9;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
