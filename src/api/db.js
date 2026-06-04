/**
 * LOCAL DATABASE — reemplaza base44.entities
 *
 * Misma API que Base44:
 *   Entity.list(sortField?)
 *   Entity.filter(conditions, sortField?)
 *   Entity.create(data)
 *   Entity.update(id, data)
 *   Entity.delete(id)
 *
 * Datos persistidos en localStorage.
 * Para migrar a Supabase: reemplaza solo este archivo.
 */

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ---------- Generic localStorage entity store ----------

function createEntity(storageKey) {
  const getAll = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  };

  const saveAll = (items) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const applySort = (items, sortField) => {
    if (!sortField) return items;
    const desc = sortField.startsWith('-');
    const field = desc ? sortField.slice(1) : sortField;
    return [...items].sort((a, b) => {
      const av = a[field] ?? '';
      const bv = b[field] ?? '';
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
      return 0;
    });
  };

  return {
    async list(sortField) {
      const items = getAll();
      return applySort(items, sortField);
    },

    async filter(conditions = {}, sortField) {
      const items = getAll().filter((item) =>
        Object.entries(conditions).every(([k, v]) => item[k] === v)
      );
      return applySort(items, sortField);
    },

    async create(data) {
      const items = getAll();
      const newItem = {
        ...data,
        id: generateId(),
        created_date: now(),
        updated_date: now(),
      };
      items.push(newItem);
      saveAll(items);
      return newItem;
    },

    async update(id, data) {
      const items = getAll();
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error(`Item ${id} not found`);
      items[idx] = { ...items[idx], ...data, updated_date: now() };
      saveAll(items);
      return items[idx];
    },

    async delete(id) {
      const items = getAll().filter((i) => i.id !== id);
      saveAll(items);
      return { success: true };
    },
  };
}

// ---------- Exported entities ----------

export const db = {
  entities: {
    Newspaper: createEntity('presse_newspapers'),
    Article: createEntity('presse_articles'),
  },

  /**
   * File upload — convierte imagen a base64 y la guarda localmente.
   * Devuelve { file_url } igual que base44.integrations.Core.UploadFile
   *
   * NOTA: Para producción, reemplaza esto por un upload real a Supabase Storage
   * o cualquier otro servicio.
   */
  integrations: {
    Core: {
      async UploadFile({ file }) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file_url: reader.result });
          reader.onerror = () => reject(new Error('File read failed'));
          reader.readAsDataURL(file);
        });
      },
    },
  },
};
