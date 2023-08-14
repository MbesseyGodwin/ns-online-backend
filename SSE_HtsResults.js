const express = require("express");
const cors = require("cors");
const EventEmitter = require("events");

const app = express();
const port = 4000;

const eventEmitter = new EventEmitter();

// Send SSEs when new data is available
setInterval(() => {
    const htsResults = {
        TOTAL_TESTED: Math.floor(Math.random() * 1000),
        TOTAL_HTS_POS: Math.floor(Math.random() * 100),
        TOTAL_HTS_NEG: Math.floor(Math.random() * 900),
    };
    eventEmitter.emit("hts-results", JSON.stringify(htsResults));
}, 5000);

// SSE endpoint
app.get("/sse/htsresults", cors(), (req, res) => {
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    res.flushHeaders();
    const listener = (data) => {
        res.write(`data: ${data}\n\n`);
    };
    eventEmitter.on("hts-results", listener);
    req.on("close", () => {
        eventEmitter.off("hts-results", listener);
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
