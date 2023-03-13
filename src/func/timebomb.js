const { dialog } = require("electron");
const { APP_NAME, IN_BETA, TIMEBOMB_ACTIVATED, EXPIRY_DATE } = require("../data/constants");

const _timebomb = () => {
  if (IN_BETA && TIMEBOMB_ACTIVATED && EXPIRY_DATE.getTime() < new Date().getTime()) {
    const buttonIndex = dialog.showMessageBoxSync(null, {
      type: "error",
      title: `${APP_NAME} Expiry`,
      message: `${APP_NAME} has expired!`,
      detail: `${APP_NAME} has now expired and is no longer usable. Please upgrade to a new version as soon as possible.`,
      buttons: [`Close ${APP_NAME}`, `Ignore and continue (not recommended)`],
    });

    if (buttonIndex === 0) process.exit(1);
  }
};

module.exports = _timebomb;
