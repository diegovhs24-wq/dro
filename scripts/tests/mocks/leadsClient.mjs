// Nagebootste Sanity-leadsclient, gestuurd via globalThis.__LEADS_MODE.
const store = (globalThis.__LEADS_STORE ||= new Map());
export function describeError(err) { return `${err?.name || "Error"}${err?.statusCode ? ` ${err.statusCode}` : ""}`; }
export function getLeadsClient() {
  const mode = globalThis.__LEADS_MODE || "ok";
  if (mode === "no-token") throw new Error("SANITY_API_WRITE_TOKEN ontbreekt");
  return {
    async create(doc) {
      if (mode === "create-fails") throw Object.assign(new Error("boom"), {statusCode: 500});
      if (mode === "create-hangs") return new Promise(() => {});
      if (store.has(doc._id)) throw Object.assign(new Error("exists"), {statusCode: 409});
      store.set(doc._id, {...doc});
      return {_id: doc._id};
    },
    async getDocument(id) { return store.get(id) || null; },
    patch(id) {
      const ops = {};
      return {
        set(v) { Object.assign(ops, v); return this; },
        async commit() { store.set(id, {...(store.get(id) || {}), ...ops}); return {_id: id}; },
      };
    },
    assets: { async upload() { return {_id: "image-1"}; } },
  };
}
