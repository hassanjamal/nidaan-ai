import { ref } from "vue";

export const useToast = () => {
  const toastMessage = ref("");
  const showToast = ref(false);

  const triggerToast = (message) => {
    toastMessage.value = message;
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 3000);
  };

  return {
    toastMessage,
    showToast,
    triggerToast,
  };
};
