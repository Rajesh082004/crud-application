const form = document.getElementById('itemForm');
const list = document.getElementById('itemList');
let editId = null;

async function fetchItems() {
  const res = await fetch('/api/items');
  const items = await res.json();
  list.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.title}</strong>: ${item.description}
      <button class="delete-btn" onclick="deleteItem('${item._id}')">Delete</button>
      <button class="edit-btn" onclick="editItem('${item._id}', '${item.title}', '${item.description}')">Edit</button>
    `;
    list.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  if (editId) {
    await fetch('/api/items/' + editId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
    editId = null;
  } else {
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
  }

  form.reset();
  fetchItems();
});

async function deleteItem(id) {
  await fetch(`/api/items/${id}`, { method: 'DELETE' });
  fetchItems();
}

function editItem(id, title, description) {
  document.getElementById('title').value = title;
  document.getElementById('description').value = description;
  editId = id;
}

fetchItems();