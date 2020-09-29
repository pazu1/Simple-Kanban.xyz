const API_URL = "api/";
const JWT = "jwt";
const CARDS = "cards/";
const PROJECTS = "projects/";
const COLUMNS = "columns/";

//TODO: use .map and encrypt text in objects

class APIConnection {
    constructor(Encryption) {
        const instance = this.constructor.instance;
        if (instance) {
            return instance;
        }

        this.instance = this;
        this.encryptionKey = null;
        this.Enc = Encryption;
    }

    async getToken() {
        return fetch(API_URL + JWT);
    }

    async setToken(value) {}

    async getProjects() {
        return fetch(API_URL + PROJECTS).then((res) => res.json());
    }

    async getCards(project_id) {
        let current_pr_id = `/?project_id=${project_id}`;
        return fetch(API_URL + CARDS + current_pr_id).then((res) => res.json());
    }

    async postCard(card, project_id) {
        let { description, columnId, index, priority } = card;
        const enc_description = this.Enc.encrypt(description);
        const requestConf = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: enc_description,
                index: index,
                k_column_id: columnId,
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

    async updateColsOfCards(caCards, cbCards) {
        const requestConf = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ caCards: caCards, cbCards: cbCards }),
        };

        return fetch(`${API_URL + CARDS}`, requestConf).then((res) =>
            res.json()
        );
    }

    async updateCard(id, description = null, priority = null) {
        let enc_description = null;
        if (description) enc_description = this.Enc.encrypt(description);
        const requestConf = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: enc_description,
                priority: priority,
            }),
        };

        return fetch(`${API_URL + CARDS + id}`, requestConf).then((res) =>
            res.json()
        );
    }

    async getColumns(projectId) {
        return fetch(
            `${API_URL + PROJECTS + COLUMNS + projectId}`
        ).then((res) => res.json());
    }

    async postColumn(title, index, projectId) {
        const enc_title = this.Enc.encrypt(title);
        const requestConf = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: enc_title,
                index: index,
                project_id: projectId,
            }),
        };

        return fetch(
            `${API_URL + PROJECTS + COLUMNS}`,
            requestConf
        ).then((res) => res.json());
    }

    async deleteColumn(columnId) {
        const requestConf = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                column_id: columnId,
            }),
        };

        return fetch(
            `${API_URL + PROJECTS + COLUMNS}`,
            requestConf
        ).then((res) => res.json());
    }

    // Updates names or indices, updatedColumns contain { id, title, index }
    async updateColumns(updatedColumns, project_id) {
        const sendableColumns = updatedColumns.map((co) => {
            return {
                title: this.Enc.encrypt(co.title),
                id: co.id,
                index: co.index,
            };
        });
        const requestConf = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                columns: sendableColumns,
                project_id: project_id,
            }),
        };
        return fetch(
            `${API_URL + PROJECTS + COLUMNS}`,
            requestConf
        ).then((res) => res.json());
    }

    async postProject(title) {
        const enc_title = this.Enc.encrypt(title);
        const requestConf = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: enc_title,
            }),
        };

        return fetch(`${API_URL + PROJECTS}`, requestConf).then((res) =>
            res.json()
        );
    }
    async deleteProject(id) {
        const requestConf = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        };

        return fetch(`${API_URL + PROJECTS + id}`, requestConf).then((res) =>
            res.json()
        );
    }
}

export default APIConnection;
