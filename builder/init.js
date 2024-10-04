const axios = require("axios").default; 
const path = require("path");
const fs = require("fs");
const setPic = require("./getPic");
const genIndex = require("./genIndex");
const {
  generateMarkupLocal,
  generateMarkupRemote,
} = require("./generateMarkup");

require("dotenv").config();

// You can hardcode this URL directly instead of using environment variables.
const picPath = "https://i.ibb.co/CBwsK8n/pic-85dfd57f.jpg"; // <-- Hardcoded
const msgPath = process.env.SCROLL_MSG;

if (!picPath) throw new Error("Please specify PIC.");

const setRemoteData = async () => {
  try {
    // Fetch the image from the hardcoded URL
    let res = await axios.get(picPath, {
      responseType: "arraybuffer",
    });
    const pic = res.data;
    let markup = "";

    if (msgPath) {
      const article = msgPath.split("/").pop();
      res = await axios.get(
        `https://api.telegra.ph/getPage/${article}?return_content=true`
      );
      const { content } = res.data.result;
      markup = content.reduce(
        (string, node) => string + generateMarkupRemote(node),
        ""
      );
    }

    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

// You can still allow local initialization based on how you're using the file.
if (process.argv[2] === "--local") {
  setLocalData();
} else if (process.argv[2] === "--remote") {
  setRemoteData();
} else {
  console.log("Fetch mode not specified.");
}
