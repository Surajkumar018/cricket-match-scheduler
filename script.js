document.addEventListener("DOMContentLoaded", function () {
    const scheduleSection = document.getElementById("schedule-section");
    const historySection = document.getElementById("history-section");
    const showSchedulerButton = document.getElementById("show-scheduler");
    const showHistoryButton = document.getElementById("show-history");
    const form = document.getElementById("match-form");
    const matchScheduledMessage = document.getElementById("match-scheduled-message");
    const matchDetails = document.getElementById("match-details");
    const matchHistory = document.getElementById("match-history");
    const deleteHistoryButton = document.getElementById("delete-history");
    const printMatchButton = document.getElementById("print-match");
    const printHistoryButton = document.getElementById("print-history");
    const scheduleAgainButton = document.getElementById("schedule-again");

    // Show schedule section
    showSchedulerButton.addEventListener("click", () => {
        scheduleSection.classList.add("active");
        historySection.classList.remove("active");
    });

    // Show history section
    showHistoryButton.addEventListener("click", () => {
        historySection.classList.add("active");
        scheduleSection.classList.remove("active");
        loadMatchHistory();
    });

    // Load match history from localStorage
    function loadMatchHistory() {
        matchHistory.innerHTML = ""; // Clear existing history
        const history = JSON.parse(localStorage.getItem("matchHistory")) || [];

        history.forEach((match, index) => {
            const li = document.createElement("li");
            li.textContent = match;

            // Delete button for individual match
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = () => deleteHistory(index);
            li.appendChild(deleteButton);

            matchHistory.appendChild(li);
        });
    }

    // Delete a specific match from history
    function deleteHistory(index) {
        const history = JSON.parse(localStorage.getItem("matchHistory")) || [];
        history.splice(index, 1);
        localStorage.setItem("matchHistory", JSON.stringify(history));
        loadMatchHistory();
    }

    // Delete all match history
    deleteHistoryButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all match history?")) {
            localStorage.removeItem("matchHistory");
            loadMatchHistory();
        }
    });

    // Generate a random winner
    function predictWinner(team1, team2) {
        const teams = [team1, team2];
        const winner = teams[Math.floor(Math.random() * teams.length)];
        return winner;
    }

    // Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const team1 = document.getElementById("team1").value.trim();
        const captain1 = document.getElementById("captain1").value.trim();
        const team2 = document.getElementById("team2").value.trim();
        const captain2 = document.getElementById("captain2").value.trim();
        const matchDate = document.getElementById("match-date").value;
        const matchTime = document.getElementById("match-time").value;
        const venue = document.getElementById("venue").value.trim();

        // Predict the winner
        const predictedWinner = predictWinner(team1, team2);

        const matchInfo = `
            Match: ${team1} (Captain: ${captain1}) vs ${team2} (Captain: ${captain2}) 
            Date: ${matchDate}, Time: ${matchTime}, Venue: ${venue} 
            Predicted Winner: ${predictedWinner}
        `;

        // Save match to localStorage
        const history = JSON.parse(localStorage.getItem("matchHistory")) || [];
        history.push(matchInfo);
        localStorage.setItem("matchHistory", JSON.stringify(history));

        // Display scheduled match details
        matchDetails.textContent = matchInfo.trim();
        matchScheduledMessage.classList.remove("hidden");
        form.reset(); // Clear the form fields
    });

    // Print match details
    printMatchButton.addEventListener("click", () => {
        const printContent = matchDetails.textContent;
        const newWindow = window.open("", "_blank");
        newWindow.document.write(`<pre>${printContent}</pre>`);
        newWindow.print();
        newWindow.close();
    });

    // Print all match history
    printHistoryButton.addEventListener("click", () => {
        const history = JSON.parse(localStorage.getItem("matchHistory")) || [];
        const newWindow = window.open("", "_blank");
        newWindow.document.write("<h1>Scheduled Match History</h1>");
        newWindow.document.write("<ul>");
        history.forEach(match => {
            newWindow.document.write(`<li>${match}</li>`);
        });
        newWindow.document.write("</ul>");
        newWindow.print();
        newWindow.close();
    });

    // Schedule again button functionality
    scheduleAgainButton.addEventListener("click", () => {
        matchScheduledMessage.classList.add("hidden");
        form.reset();
    });
});
