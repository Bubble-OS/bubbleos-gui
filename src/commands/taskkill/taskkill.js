const { dialog } = require("electron").remote;

const pidEntered = document.getElementById("pid-kill");

// Listen for the keydown event on the input element
pidEntered.addEventListener("keydown", (e) => {
  // Check if the key pressed was Enter
  if (e.key === "Enter") {
    // Get the PID from the input element
    const pid = pidEntered.value.trim();

    // Kill the process with the specified PID
    process.kill(pid);

    // Clear the input element
    pidEntered.value = "";

    // Define the message box options
    const options = {
      type: "info",
      buttons: ["OK"],
      title: "Operation Success",
      message: "The operation completed successfully!",
      detail: `Successfully killed the process with PID ${pid}!`,
    };

    // Show the message box
    dialog.showMessageBoxSync(null, options);
  }
});
