import { createUser, deleteUser } from "../logic/userService.js";

class UserForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section>
        <h2>User</h2>
        <input id="username" placeholder="Username" />
        <label>
          <input type="checkbox" id="tos" />
          I agree to the Terms of Service
        </label>
        <div>
          <button id="create-user">Create user</button>
          <button id="delete-user">Delete current user</button>
        </div>
        <p id="user-output"></p>
      </section>
    `;

    const output = this.querySelector("#user-output");

    this.querySelector("#create-user").addEventListener("click", async () => {
      try {
        const username = this.querySelector("#username").value;
        const acceptTos = this.querySelector("#tos").checked;

        const user = await createUser(username, acceptTos);
        localStorage.setItem("currentUserId", user.id);

        output.textContent = `Created user: ${user.username}`;
      } catch (error) {
        output.textContent = error.message;
      }
    });

    this.querySelector("#delete-user").addEventListener("click", async () => {
      try {
        const userId = localStorage.getItem("currentUserId");
        if (!userId) throw new Error("No current user");

        await deleteUser(userId);
        localStorage.removeItem("currentUserId");

        output.textContent = "User deleted";
      } catch (error) {
        output.textContent = error.message;
      }
    });
  }
}

customElements.define("user-form", UserForm);