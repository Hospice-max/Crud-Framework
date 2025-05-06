<template>
  <div class="form-wrapper">
    <form @submit.prevent="handleSubmit" class="dynamic-form"  id="form">
      <div v-for="(field, index) in fields" :key="index" class="form-field">
        <label :for="field.model">{{ field.label }}</label>
        <input
          required
          :type="field.type"
          :id="field.model"
          v-model="formData[field.model]"
          :placeholder="field.placeholder || ''"
        />
      </div>
      <div class="form-actions">
        <button type="submit" @click="reload" class="submit-button">Soumettre</button>
        <button type="button" @click="handleCancel" class="cancel-button">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watchEffect, inject, onMounted } from "vue";

const props = defineProps({
  fields: { type: Array, required: true },
  editingItem: { type: Object, default: null },
});

const emit = defineEmits(["submit", "cancel"]);
const formData = ref({});
const addNotification = inject("addNotification");

watchEffect(() =>
  props.fields.forEach((field) => (formData.value[field.model] ||= ""))
);

onMounted(() => {
  if (props.editingItem) {
    props.fields.forEach((field) => {
      formData.value[field.model] = props.editingItem[field.model];
    });
  }
});

const handleSubmit = () => {
  if (props.editingItem) {
    emit("submit", formData.value);
    addNotification('Utilisateur modifié avec succès!', 'success');
  } else {
    emit("submit", formData.value);
    addNotification('Utilisateur ajouté avec succès!', 'success');
  }
};

const handleCancel = () => {
  emit("cancel");
  addNotification('Opération annulée', 'info');
};

const reload = () => {
  setTimeout(() => {
    document.getElementById('form').reset();
  }, 2);  
}
</script>

<style scoped>
.form-wrapper {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;  
}

.dynamic-form {
  display: flex;
  flex-direction: column;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.form-field input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fafafa;
  color: #333;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-field input:focus {
  border-color: #017483be;
  box-shadow: 0 0 10px rgba(98, 0, 234, 0.5);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

 .form-wrapper:hover {
  transform: scale(1.02);
} 
.submit-button,
.cancel-button {
  background: #017483be;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: transform 0.2s ease, background 0.3s ease;
}

.submit-button:hover,
.cancel-button:hover {
  background: #017483be;
  transform: scale(1.05);
}

.cancel-button {
  background: #dc3545;
}

.cancel-button:hover {
  background: #c82333;
}
</style>
