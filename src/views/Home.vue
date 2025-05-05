<template>
  <div class="container">
    <h1 class="title">Gestion des Utilisateurs</h1>

    <!-- Formulaire Dynamique en Popup -->
    <div v-if="showForm" class="form-popup">
      <DynamicForm :fields="formStore.fields" @submit="handleSubmit" @cancel="closeForm" />
    </div>

    <!-- Tableau CRUD avec effet de flou conditionnel -->
    <div :class="['crud-container', { 'blurred': showForm }]">
      <CrudTable
        :columns="columns"
        :items="crudStore.items"
        @edit="editItem"
        @delete="crudStore.deleteItem"
        @add="openForm"
      />
    </div>

    <!-- Notifications -->
    <div v-if="notification" class="notification">
      {{ notification }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFormStore } from "@/stores/formStore";
import { useCrudStore } from "@/stores/crudStore";
import DynamicForm from "@/components/DynamicForm.vue";
import CrudTable from "@/components/CrudTable.vue";

// État pour contrôler l'affichage du formulaire
const showForm = ref(false);
const editingItem = ref(null);
const notification = ref("");

// Initialisation des stores
const formStore = useFormStore();
const crudStore = useCrudStore();

// Initialisation du formulaire
const columns = [
  { label: "Nom", model: "name" },
  { label: "Email", model: "email" },
  { label: "Âge", model: "age" },
];

// Ouvrir le formulaire
const openForm = () => {
  editingItem.value = null;
  showForm.value = true;
};

// Soumission du formulaire
const handleSubmit = (formData) => {
  if (editingItem.value) {
    crudStore.editItem(editingItem.value, formData);
  } else {
    crudStore.addItem(formData);
  }
  showForm.value = false;
  setTimeout(() => {
    notification.value = "";
  }, 3000);
};

// Édition d'un élément dans le tableau
const editItem = (item) => {
  editingItem.value = item;
  formStore.fields.forEach(field => {
    formStore.fields[field.model] = item[field.model];
  });
  showForm.value = true;
};

// Fermer le formulaire
const closeForm = () => {
  showForm.value = false;
};


</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: linear-gradient(135deg, #f09, #3ad59f);
  color: #fff;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.form-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: transform 0.3s ease;
}

.form-popup:hover {
  transform: translate(-50%, -50%) scale(1.05);
}

.crud-container {
  width: 100%;
  max-width: 800px;
  transition: filter 0.3s ease, transform 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.blurred {
  filter: blur(5px);
  transform: scale(0.98);
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(40, 167, 69, 0.9);
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
}
</style>
