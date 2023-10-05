import { deleteClientModal } from "./createDeleteModal.js";
import { editClientModal } from "./editClient.js";
import { formatDate, formatTime, createContactItemByType } from "./utils.js";
import { svgSpinner } from "./svg.js";

export const createClientItem = (data) => {
  const $clientTr = document.createElement("tr");
  const $clientIdTd = document.createElement("td");
  const $clientId = document.createElement("span");
  const $clientFullName = document.createElement("td");
  const $clientName = document.createElement("span");
  const $clientSurname = document.createElement("span");
  const $clientLastname = document.createElement("span");
  const $clientCreated = document.createElement("td");
  const $createDate = document.createElement("span");
  const $createTime = document.createElement("span");

  const $clientChanged = document.createElement("td");
  const $changeDate = document.createElement("span");
  const $changeTime = document.createElement("span");

  const $clientContacts = document.createElement("td");
  const $clientActions = document.createElement("td");
  const $clientEdit = document.createElement("button");
  const $clientDelete = document.createElement("button");
  const $deleteClient = deleteClientModal();
  const $editClient = editClientModal(data);
  const $editSpinner = document.createElement("span");
  const $deleteSpinner = document.createElement("span");

  $editSpinner.classList.add('actions__spinner');
  $deleteSpinner.classList.add('actions__spinner');
  $clientTr.classList.add('clients__item');
  $clientTr.id = data.id;
  $clientIdTd.classList.add('client__id');
  $clientFullName.classList.add('clients__full-name');
  $clientName.classList.add('clients__name');
  $clientSurname.classList.add('clients__surname');
  $clientLastname.classList.add('clients__lastname');
  $clientCreated.classList.add('clients__created');
  $createDate.classList.add('created__date');
  $createTime.classList.add('created__time');
  $clientChanged.classList.add('clients__changed');
  $changeDate.classList.add('changed__date');
  $changeTime.classList.add('changed__time');
  $clientContacts.classList.add('clients__contacts');
  $clientActions.classList.add('clients__actions');
  $clientContacts.classList.add('clients__contacts');
  $clientDelete.classList.add('clients__delete', 'btn-reset');
  $clientEdit.classList.add('clients__edit', 'btn-reset');

  for (const contact of data.contacts) {
    createContactItemByType(contact.type, contact.value, $clientContacts);
  }

  const deleteById = () => {
    import('./clientsApi.js').then(({ deleteClientItem }) => {
      $deleteClient.$deleteModalDelete.addEventListener("click", () => {
        try {
          $deleteClient.$deleteSpinner.style.display = 'block';
          setTimeout(() => {
            deleteClientItem(data.id);
            document.getElementById(data.id).remove();
            $deleteClient.$deleteModal.remove();
          }, 2000);
        } catch (error) {
          console.log(error);

        } finally {
          setTimeout(() => {
            $deleteClient.$deleteSpinner.style.display = 'none';
          }, 2000);
        }
      })
    })
  }

  $clientDelete.addEventListener("click", () => {
    $deleteSpinner.style.display = 'block';
    $clientDelete.classList.add('action-wait');

    setTimeout(() => {
      deleteById();
      document.body.append($deleteClient.$deleteModal);
      $deleteSpinner.style.display = 'none';
      $clientDelete.classList.remove('action-wait');

    }, 2000);
  })

  $clientEdit.addEventListener("click", () => {
    $editSpinner.style.display = 'block';
    $clientEdit.classList.add('action-wait');

    setTimeout(() => {
      document.body.append($editClient.$editModal);
      $editSpinner.style.display = 'none';
      $clientEdit.classList.remove('action-wait');

    }, 2000);

  })

  $deleteSpinner.innerHTML = svgSpinner;
  $editSpinner.innerHTML = svgSpinner;
  // $clientId.textContent = Math.floor(Math.random() * 15);
  $clientId.textContent = data.id.substring(0, 6);
  $clientName.textContent = data.name;
  $clientSurname.textContent = data.surname;
  $clientLastname.textContent = data.lastName;
  $clientEdit.textContent = "Изменить";
  $clientDelete.textContent = "Удалить";
  $createDate.textContent = formatDate(data.createdAt);
  $createTime.textContent = formatTime(data.createdAt);
  $changeDate.textContent = formatDate(data.updatedAt);
  $changeTime.textContent = formatTime(data.updatedAt);

  $clientIdTd.append($clientId);
  $clientFullName.append($clientName, $clientSurname, $clientLastname);
  $clientCreated.append($createDate, $createTime);
  $clientChanged.append($changeDate, $changeTime);
  $clientDelete.prepend($deleteSpinner);
  $clientEdit.prepend($editSpinner);
  $clientActions.append($clientEdit, $clientDelete);
  $clientTr.append($clientIdTd, $clientFullName, $clientCreated, $clientChanged, $clientContacts, $clientActions);

  return $clientTr;
};
