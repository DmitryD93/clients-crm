import { createClientsForm } from "./createModalForm.js";
import { createClientItem } from "./createClientItem.js";
import { deleteClientModal } from "./createDeleteModal.js";
import { createContactItem } from "./createContact.js";
import { sendClientData } from "./clientsApi.js";
import { validateClientForm } from "./validateForm.js";
import { validateClientContact } from "./validateContact.js";

export const editClientModal = (data) => {
  const $editModal = document.createElement("div");
  const $editModalContent = document.createElement("div");
  const $createForm = createClientsForm();
  const $titleId = document.createElement("span");

  $titleId.classList.add("modal__id");
  $editModal.classList.add("modal-edit", "site-modal", "modal-active");
  $editModalContent.classList.add("edit-modal__content", "site-modal__content", "modal-active");

  $titleId.textContent = "ID:" + data.id.substring(0, 6);
  $createForm.$modalTitle.textContent = "Изменить данные";
  $createForm.$cancelBtn.textContent = "Удалить клиента";

  $createForm.$cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const $deleteModal = deleteClientModal();
    document.body.append($deleteModal.$deleteModal);

    import("./clientsApi.js").then(({ deleteClientItem }) => {
      $deleteModal.$deleteModalDelete.addEventListener("click", () => {
        try {
          $deleteModal.$deleteSpinner.style.display = "block";
          setTimeout(() => {
            deleteClientItem(data.id);
            document.getElementById(data.id).remove();
            $deleteModal.$deleteModal.remove();
            document.querySelector(".modal-edit").remove();
          }, 2000);
        } catch (error) {
          console.log(error);
        } finally {
          setTimeout(() => {
            $deleteModal.$deleteSpinner.style.display = "none";
          }, 2000);
        }
      });
    });
  });

  $createForm.$modalClose.addEventListener("click", () => {
    $editModal.remove();
  });

  $createForm.$inputName.value = data.name;
  $createForm.$inputSurname.value = data.surname;
  $createForm.$inputLastname.value = data.lastName;

  for (const contact of data.contacts) {
    const createContact = createContactItem();

    createContact.$contactName.textContent = contact.type;
    createContact.$contactInput.value = contact.value;

    $createForm.$contactsBlock.prepend(createContact.$contact);
    $createForm.$contactsBlock.style.backgroundColor = "var(--color-athens-gray)";
  }

  if (data.contacts.length === 10) {
    $createForm.$addContactBtn.classList.remove("modal__btn-contact--active");
  }

  $createForm.$form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateClientForm()) {
      return;
    }

    const contactTypes = document.querySelectorAll(".contact__name");
    const contactValues = document.querySelectorAll(".contact__input");

    let contacts = [];
    let client = {};

    for (let i = 0; i < contactTypes.length; i++) {
      if (!validateClientContact(contactTypes[i], contactValues[i])) {
        return;
      }
      contacts.push({
        type: contactTypes[i].innerHTML,
        value: contactValues[i].value,
      });
    }

    client.name = $createForm.$inputName.value;
    client.surname = $createForm.$inputSurname.value;
    client.lastName = $createForm.$inputLastname.value;
    client.contacts = contacts;

    const spinner = document.querySelector(".modal__spinner");

    try {
      spinner.style.display = "block";
      const editedData = await sendClientData(client, "PATCH", data.id);
      setTimeout(() => {
        document.getElementById(editedData.id).remove();
        document.querySelector(".clients__tbody").append(createClientItem(editedData));
        document.querySelector(".modal-edit").remove();
      }, 2000);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        spinner.style.display = "none";
      }, 2000);
    }
  });

  $createForm.$modalTitle.append($titleId);
  $editModalContent.append($createForm.$modalClose, $createForm.$modalTitle, $createForm.$form);
  $editModal.append($editModalContent);

  document.addEventListener("click", (e) => {
    if (e.target === $editModal) {
      $editModal.remove();
    }
  });

  return {
    $editModal,
    $editModalContent,
  };
};
