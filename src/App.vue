<template>
  <div class="app-container">
    <navbar>
      <h1 class="app-title">CRUD APPLICATION</h1>
    </navbar>

    <div class="app-secondtitle">
      <h2>Systeme de Gestion des utilisateurs</h2>
    </div>

    <main class="main-content">
      <!-- Message d'accueil avec émoji et bouton circulaire -->
      <div v-if="showLoading" class="loading-overlay">
        <div class="welcome-message">
          <p>Bienvenue sur l'interface de gestion des Utilisateurs! 😊</p>
          <button class="start-button" @click="startApp">Cliquez !</button>
        </div>
      </div>
      <!-- Formulaire Dynamique en Popup -->
      <div class="form-overlay">
        <DynamicForm
          :fields="formStore.fields"
          :editingItem="editingItem"
          @submit="handleSubmit"
          @cancel="closeForm"
        />
      </div>
      <!-- Tableau CRUD avec effet de flou conditionnel -->
      <!-- <div :class="['crud-wrapper', { blurred: showForm }]">
        <CrudTable
          :columns="columns"
          :items="crudStore.items"
          @edit="editItem"
          @delete="crudStore.deleteItem"
          @add="openForm"
        />
      </div> -->
      <!-- Notifications -->
      <Notifications ref="notificationComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import { useFormStore } from "@/stores/formStore";
import { useCrudStore } from "@/stores/crudStore";
import { useWebSocket } from "@/services/webSocket";
import DynamicForm from "@/components/DynamicForm.vue";
import CrudTable from "@/components/CrudTable.vue";
import Notifications from "@/components/Notifications.vue";

const showForm = ref(false);
const showLoading = ref(true); // Affichage de la couverture avant ouverture
const editingItem = ref(null);
const notifications = ref([]);

const formStore = useFormStore();
const crudStore = useCrudStore();

const columns = [
  { label: "Nom", model: "name" },
  { label: "Email", model: "email" },
  { label: "Âge", model: "age" },
];

const openForm = () => {
  editingItem.value = null;
  showForm.value = true;
};

const handleSubmit = (formData) => {
  if (editingItem.value) {
    crudStore.editItem(editingItem.value, formData);
  } else {
    crudStore.addItem(formData);
  }
  showForm.value = false;
};

const editItem = (item) => {
  editingItem.value = item;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
};

const startApp = () => {
  showLoading.value = false;
};

/******************************************************Gestion de notification ******************************************************/
const notificationComponent = ref(null);

const handleWebSocketMessage = (message) => {
  addNotification(message);
};

const addNotification = (message, type = "info") => {
  notificationComponent.value.addNotification(message, type);
};

useWebSocket(handleWebSocketMessage);

provide("addNotification", addNotification);
/******************************************************Gestion de notification ******************************************************/
</script>

<style scoped>
/* Styles généraux */
.app-container {
  box-sizing: border-box;
}

/* Contenu principal */
.main-content {
  margin: 0 auto;
  margin-top: 1%;
  flex-grow: 1;
  padding: 20px;
  max-width: 100%;
  width: 75%;
}

/* Titre */
.app-title {
  font-size: 1.5rem;
  background-color: #017483be;
  font-weight: bold;
  color: #fff;
  text-align: center;
  padding: 20px;
  border-radius: 5px;
}

.app-secondtitle {
  margin: 0 auto;
  padding: 10px;
  font-size: 1rem;
  max-width: 100%;
  width: 80%;
  background: white;
  border-radius: 5px;
  border-bottom: 1px solid #e2e2e2eb;
}

/* Animation de fondu */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Overlay de chargement */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7));
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  flex-direction: column;
  animation: fadeIn 1.5s ease-in-out;
}

/* Message de bienvenue */
.welcome-message {
  text-align: center;
  color: #fff;
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.3);
  background: linear-gradient(45deg, #ff4081, #8e2de2);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(255, 64, 129, 0.7);
  animation: pulseEffect 1.8s infinite alternate;
}

@keyframes pulseEffect {
  from {
    transform: scale(1);
    box-shadow: 0 0 15px rgba(255, 64, 129, 0.7);
  }
  to {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 64, 129, 0.7);
  }
}

.welcome-message p {
  margin-bottom: 20px;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 1.5px;
}

/* Bouton de démarrage */
.start-button {
  background: linear-gradient(90deg, #ff4081, #ff79a9);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 64, 129, 0.8);
  transition: transform 0.3s ease;
  animation: neonBlink 1.5s infinite alternate;
}

@keyframes neonBlink {
  0% {
    box-shadow: 0 0 10px rgba(255, 64, 129, 0.8),
      0 0 20px rgba(255, 64, 129, 0.6);
  }
  100% {
    box-shadow: 0 0 20px rgba(255, 64, 129, 1), 0 0 30px rgba(255, 64, 129, 0.9);
  }
}

.start-button:hover {
  transform: scale(1.2);
}

/* Conteneur CRUD */
.crud-wrapper {
  width: 100%;
  max-width: 900px;
  transition: filter 0.3s ease, transform 0.5s ease;
  border-radius: 8px;
}

.crud-wrapper:hover {
  transform: scale(1.02);
}

.blurred {
  filter: blur(5px);
}

/* Overlay du formulaire */
.form-overlay {
}

/* Notifications */
.notifications {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-size: 14px;
  color: #ff4081;
}
</style>
