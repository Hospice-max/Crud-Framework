import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useCrudStore = defineStore('crudStore', () => {
  const items = ref(JSON.parse(localStorage.getItem('users')) || []);

  // Sauvegarder les données dans le localStorage
  watch(items, (newItems) => {
    localStorage.setItem('users', JSON.stringify(newItems));
  }, { deep: true });

  // Ajouter un utilisateur
  const addItem = (formData) => {
    items.value.push({ name: formData.name, email: formData.email, age: formData.age });
  };

  // Supprimer un utilisateur
  const deleteItem = (index) => {
    items.value.splice(index, 1);
  };

  // Éditer un utilisateur
  const editItem = (item, formData) => {
    const index = items.value.indexOf(item);
    if (index !== -1) {
      items.value[index] = { ...item, ...formData };
    }
  };

  return { items, addItem, deleteItem, editItem };
});
