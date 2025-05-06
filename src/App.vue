<template>
  <div class="app-container">
    <navbar>
      <h1 class="app-title">CRUD APPLICATION</h1>
    </navbar>

    <div class="app-secondtitle">
      <svg xmlns="http://www.w3.org/2000/svg" width="45" height="60" viewBox="0 0 22 22"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m-2.5-8.5q1.45 0 2.475-1.025T13 10t-1.025-2.475T9.5 6.5T7.025 7.525T6 10t1.025 2.475T9.5 13.5m7 1q1.05 0 1.775-.725T19 12t-.725-1.775T16.5 9.5t-1.775.725T14 12t.725 1.775t1.775.725M12 20q2.125 0 3.875-1t2.825-2.65q-.525-.15-1.075-.25T16.5 16q-1.325 0-3.2.775t-3 3.05q.425.1.85.138T12 20m-3.175-.65q.875-1.8 1.988-2.675T12.5 15.5q-.725-.225-1.463-.362T9.5 15q-1.125 0-2.225.275t-2.125.775q.65 1.075 1.588 1.938t2.087 1.362"/></svg>
      <h2>Systeme de Gestion des utilisateurs</h2>
    </div>

    <main class="main-content">
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
      <div class="crud-wrapper">
        <CrudTable
          :columns="columns"
          :items="crudStore.items"
          @edit="editItem"
          @delete="crudStore.deleteItem"
          @add="openForm"
        />
      </div>
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
  display: flex;
  justify-content: space-between;  
  margin: 0 auto;
  margin-top: 1%;
  flex-grow: 1;
  padding: 20px;
  max-width: 100%;
  width: 75%;
}

/* Version mobile de main-content */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column; 
    width: 90%; 
    padding: 10px; 
  }
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
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.app-secondtitle {
  display: flex;
  gap: 10px;
  margin: 0 auto;
  padding: 10px;
  font-size: 1rem;
  max-width: 100%;
  width: 80%;
  color: #017483be;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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


/* Conteneur CRUD */
.crud-wrapper {
  width: 100%;
  max-width: 900px;  
  border-radius: 8px;
}

/* .crud-wrapper:hover {
  transform: scale(1.02);
}

.blurred {
  filter: blur(5px);
} */

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
