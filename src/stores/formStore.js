import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFormStore = defineStore('formStore', () => {
  const fields = ref([
    { label: 'Nom', type: 'text', model: 'name', placeholder: 'Entrez votre nom' },
    { label: 'Email', type: 'email', model: 'email', placeholder: 'Entrez votre email' },
    { label: 'Âge', type: 'number', model: 'age', placeholder: 'Entrez votre âge' },
  ]);

  return { fields };
});

