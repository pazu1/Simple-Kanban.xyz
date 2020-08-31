const API_URL = "api/";
const JWT = "jwt";
const CARDS = "cards";
const PROJECTS = "projects";
const COLUMNS = "columns";

class APIConnection {
  constructor() {
    const instance = this.constructor.instance;
    if (instance) {
      return instance;
    }

    this.instance = this;
  }

  async getToken() {
    const res = await fetch(API_URL + JWT);
    try {
      const jwt = await res.clone().json();
      return jwt;
    } catch (err) {
      const message = await res.text();
      console.log(message);
    }
  }

  async getProjects() {
    return fetch(API_URL + PROJECTS).then((res) => res.json());
  }

  async getCards(project_id) {
    let current_pr_id = `/?project_id=${project_id}`;
    return fetch(API_URL + CARDS + current_pr_id).then((res) => res.json());
  }

  async postCard(card, project_id) {
    let { description, column, index, priority } = card;
    const requestConf = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: description,
        index: index,
        column: column,
        priority: priority,
        project_id: project_id,
      }),
    };

    return fetch(API_URL + CARDS, requestConf).then((res) => res.json());
  }

  async deleteCard(id) {
    const requestConf = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    return fetch(`${API_URL + CARDS}/${id}`, requestConf).then((res) =>
      res.json()
    );
  }

  async updateColumns(columnA, columnB) {
    const requestConf = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnA: columnA, columnB: columnB }),
    };

    return fetch(`${API_URL + CARDS}`, requestConf).then((res) => res.json());
  }

  async updateCard(id, description = null, priority = null) {
    const requestConf = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: description,
        priority: priority,
      }),
    };

    return fetch(`${API_URL + CARDS}/${id}`, requestConf).then((res) =>
      res.json()
    );
  }

  async updateColumnArray(newColumns, project_id) {
    const requestConf = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newColumns: newColumns, project_id: project_id }),
    };
    return fetch(
      `${API_URL + PROJECTS + "/" + COLUMNS}`,
      requestConf
    ).then((res) => res.json());
  }
}

export default APIConnection;
