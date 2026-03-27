import {
  createMatch,
  getMatchByShareCode,
  getMatchById,
  joinMatch,
  playMatch
} from "../services/matchService.mjs";

class MultiplayerUI extends HTMLElement {
  connectedCallback() {
    this.pollInterval = null;
    this.hasSubmittedChoice = false;

    this.innerHTML = `
      <section class="panel">
        <h2>Multiplayer</h2>

        <div class="button-row">
          <button id="create-match">Create match link</button>
          <button id="join-match">Join loaded match</button>
        </div>

        <p id="match-info"></p>
        <p id="match-status"></p>

        <div class="button-row" id="choice-buttons">
          <button data-choice="rock">Rock</button>
          <button data-choice="paper">Paper</button>
          <button data-choice="scissors">Scissors</button>
        </div>

        <p id="match-result"></p>
      </section>
    `;

    this.querySelector("#create-match").addEventListener("click", () => {
      this.handleCreateMatch();
    });

    this.querySelector("#join-match").addEventListener("click", () => {
      this.handleJoinMatch();
    });

    this.querySelectorAll("button[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        this.handlePlay(button.dataset.choice);
      });
    });

    this.handleLoadMatchFromUrl();
  }

  disconnectedCallback() {
    this.stopPolling();
  }

  async handleCreateMatch() {
    const userId = localStorage.getItem("currentUserId");
    const rulesetId = localStorage.getItem("currentRulesetId");

    if (!userId) {
      this.setInfo("Create or log in as a user first");
      return;
    }

    if (!rulesetId) {
      this.setInfo("Select a ruleset first");
      return;
    }

    try {
      const match = await createMatch({
        hostUserId: userId,
        rulesetId
      });

      localStorage.setItem("currentMatchId", match.id);

      this.hasSubmittedChoice = false;
      this.setChoiceButtonsDisabled(true);
      this.setResult("");

      const url = new URL(window.location.href);
      url.searchParams.set("match", match.shareCode);

      this.setInfo(`Share this link: ${url.toString()}`);
      this.renderMatch(match);
      this.startPolling();
    } catch (error) {
      this.setInfo(error.message);
    }
  }

  async handleLoadMatchFromUrl() {
    const shareCode = new URL(window.location.href).searchParams.get("match");

    if (!shareCode) {
      return;
    }

    try {
      const match = await getMatchByShareCode(shareCode);
      localStorage.setItem("currentMatchId", match.id);

      this.hasSubmittedChoice = false;
      this.setResult("");

      this.setInfo(`Loaded match: ${match.id}`);
      this.renderMatch(match);
      this.startPolling();
    } catch (error) {
      this.setInfo(error.message);
    }
  }

  async handleJoinMatch() {
    const userId = localStorage.getItem("currentUserId");
    const matchId = localStorage.getItem("currentMatchId");

    if (!userId) {
      this.setInfo("Create or log in as a user first");
      return;
    }

    if (!matchId) {
      this.setInfo("No match loaded");
      return;
    }

    try {
      const currentMatch = await getMatchById(matchId);

      if (!currentMatch) {
        this.setInfo("Match not found");
        return;
      }

      if (currentMatch.guestUserId) {
        if (currentMatch.guestUserId === userId) {
          this.setInfo("You have already joined this match");
        } else {
          this.setInfo("This match already has a guest");
        }

        this.renderMatch(currentMatch);
        return;
      }

      if (currentMatch.hostUserId === userId) {
        this.setInfo("You are the host of this match");
        this.renderMatch(currentMatch);
        return;
      }

      const match = await joinMatch(matchId, userId);

      this.hasSubmittedChoice = false;
      this.setResult("");

      this.setInfo(`Joined match: ${match.id}`);
      this.renderMatch(match);
      this.startPolling();

      window.dispatchEvent(
        new CustomEvent("match-updated", { detail: match })
      );
    } catch (error) {
      this.setInfo(error.message);
    }
  }

  async handlePlay(choice) {
    const userId = localStorage.getItem("currentUserId");
    const matchId = localStorage.getItem("currentMatchId");

    if (!userId) {
      this.setResult("Create or log in as a user first");
      return;
    }

    if (!matchId) {
      this.setResult("No match loaded");
      return;
    }

    if (this.hasSubmittedChoice) {
      this.setResult("You have already submitted a choice");
      return;
    }

    try {
      const currentMatch = await getMatchById(matchId);

      if (!currentMatch.guestUserId) {
        this.setResult("Waiting for a second player to join");
        this.setChoiceButtonsDisabled(true);
        return;
      }

      const match = await playMatch(matchId, userId, choice);

      this.hasSubmittedChoice = true;
      this.setChoiceButtonsDisabled(true);

      if (!match.result) {
        this.setResult("Choice submitted. Waiting for other player...");
      } else {
        this.renderResult(match);
        this.hasSubmittedChoice = false;
        this.setChoiceButtonsDisabled(false);
      }

      this.renderMatch(match);

      window.dispatchEvent(
        new CustomEvent("match-updated", { detail: match })
      );
    } catch (error) {
      this.setResult(error.message);
    }
  }

  async pollMatch() {
    const matchId = localStorage.getItem("currentMatchId");

    if (!matchId) {
      return;
    }

    try {
      const match = await getMatchById(matchId);

      this.renderMatch(match);

      if (match.result) {
        this.renderResult(match);
        this.hasSubmittedChoice = false;
        this.setChoiceButtonsDisabled(false);
      } else {
        const currentUserId = localStorage.getItem("currentUserId");
        const isHost = currentUserId === match.hostUserId;
        const isGuest = currentUserId === match.guestUserId;

        const alreadyPlayed =
          (isHost && !!match.hostChoice) ||
          (isGuest && !!match.guestChoice);

        const canPlay =
          !!match.guestUserId &&
          (isHost || isGuest) &&
          !alreadyPlayed;

        this.hasSubmittedChoice = alreadyPlayed;
        this.setChoiceButtonsDisabled(!canPlay);
      }

      window.dispatchEvent(
        new CustomEvent("match-updated", { detail: match })
      );
    } catch (error) {
      this.setStatus("Could not refresh match");
    }
  }

  startPolling() {
    this.stopPolling();

    this.pollMatch();
    this.pollInterval = setInterval(() => {
      this.pollMatch();
    }, 2000);
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  renderMatch(match) {
    const currentUserId = localStorage.getItem("currentUserId");

    const isHost = currentUserId === match.hostUserId;
    const isGuest = currentUserId === match.guestUserId;

    const role = isHost ? "Host" : isGuest ? "Guest" : "Viewer";
    const guestText = match.guestUserId ? "Guest joined" : "Waiting for guest";

    let yourChoice = null;
    let opponentHasPlayed = false;

    if (isHost) {
      yourChoice = match.hostChoice;
      opponentHasPlayed = !!match.guestChoice;
    } else if (isGuest) {
      yourChoice = match.guestChoice;
      opponentHasPlayed = !!match.hostChoice;
    }

    if (!match.result) {
      const yourChoiceText = yourChoice
        ? "You have submitted your choice"
        : "You have not played yet";

      const opponentChoiceText = opponentHasPlayed
        ? "Opponent has submitted a choice"
        : "Opponent has not played yet";

      this.setStatus(
        `Role: ${role} | ${guestText} | ${yourChoiceText} | ${opponentChoiceText}`
      );
      return;
    }

    this.setStatus(`Role: ${role} | ${guestText} | Match complete`);
  }

  renderResult(match) {
    if (match.result === "draw") {
      this.setResult(
        `Host chose ${match.hostChoice}, Guest chose ${match.guestChoice}. Result: draw.`
      );
      return;
    }

    const winner = match.result === "host" ? "Host wins" : "Guest wins";

    this.setResult(
      `Host chose ${match.hostChoice}, Guest chose ${match.guestChoice}. ${winner}.`
    );
  }

  setChoiceButtonsDisabled(disabled) {
    this.querySelectorAll("button[data-choice]").forEach((button) => {
      button.disabled = disabled;
    });
  }

  setInfo(message) {
    this.querySelector("#match-info").textContent = message;
  }

  setStatus(message) {
    this.querySelector("#match-status").textContent = message;
  }

  setResult(message) {
    this.querySelector("#match-result").textContent = message;
  }
}

customElements.define("multiplayer-ui", MultiplayerUI);