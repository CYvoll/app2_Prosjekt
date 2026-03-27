import {
  createUser,
  deleteUser,
  loginUserByUsername
} from "../services/userService.mjs";

import { t } from "../lang/i18n.mjs";

class UserForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="panel">
        <h2>User</h2>

        <div class="form-row">
          <input id="username" placeholder="Username" />
        </div>

        <label class="checkbox-row">
          <input type="checkbox" id="tos" />
          I agree to the Terms of Service
        </label>

        <div class="button-row">
          <button id="create-user">Create user</button>
          <button id="login-user">Log in</button>
          <button id="logout-user">Log out</button>
          <button id="delete-user">Delete current user</button>
        </div>

        <p id="user-output"></p>
      </section>
    `;

    const output = this.querySelector("#user-output");

    this.querySelector("#create-user").addEventListener("click", async () => {
      try {
        const username = this.querySelector("#username").value.trim();
        const acceptTos = this.querySelector("#tos").checked;

        const user = await createUser(username, acceptTos);

        localStorage.setItem("currentUserId", user.id);
        localStorage.setItem("currentUsername", user.username);

        output.textContent = `Created user: ${user.username}`;
        window.dispatchEvent(new CustomEvent("user-changed"));
      } catch (error) {
        output.textContent = error.message;
      }
    });

    this.querySelector("#login-user").addEventListener("click", async () => {
      try {
        const username = this.querySelector("#username").value.trim();

        if (!username) {
          throw new Error("Username is required");
        }

        const user = await loginUserByUsername(username);

        localStorage.setItem("currentUserId", user.id);
        localStorage.setItem("currentUsername", user.username);

        output.textContent = `Logged in as: ${user.username}`;
        window.dispatchEvent(new CustomEvent("user-changed"));
      } catch (error) {
        output.textContent = error.message;
      }
    });

    this.querySelector("#logout-user").addEventListener("click", () => {
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("currentUsername");

      output.textContent = t("loggedOut");
      window.dispatchEvent(new CustomEvent("user-changed"));
    });

    this.querySelector("#delete-user").addEventListener("click", async () => {
      try {
        const userId = localStorage.getItem("currentUserId");

        if (!userId) {
          throw new Error(t("noCurrentUser"));
        }

        await deleteUser(userId);

        localStorage.removeItem("currentUserId");
        localStorage.removeItem("currentUsername");

        output.textContent = t("userDeleted");
        window.dispatchEvent(new CustomEvent("user-changed"));
      } catch (error) {
        output.textContent = error.message;
      }
    });
  }
}

customElements.define("user-form", UserForm);