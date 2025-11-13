<template>
  <div class="form-container">
    <h2>Registrar Propina</h2>

    <form @submit.prevent="enviarPropina">
      <div>
        <label>Monto total:</label>
        <input v-model.number="total" type="number" required />
      </div>

      <div>
        <label>Periodo:</label>
        <input v-model="periodo" type="month" required />
      </div>

      <button type="submit">Enviar</button>
    </form>

    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const total = ref<number | null>(null);
const periodo = ref<string>("");
const mensaje = ref<string>("");

const enviarPropina = async () => {
  try {
    const response = await fetch("http://localhost:3000/tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total: total.value,
        periodo: periodo.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      mensaje.value = data.mensaje || "Propina registrada con éxito";
      total.value = null;
      periodo.value = "";
    } else {
      mensaje.value = data.mensaje || "Error al registrar la propina";
    }
  } catch (err) {
    mensaje.value = "Error de conexión con el servidor";
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #f9f9f9;
}
label {
  display: block;
  margin-top: 1rem;
}
button {
  margin-top: 1.5rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
}
.mensaje {
  margin-top: 1rem;
  font-weight: bold;
}
</style>
