import express from "express";
import axios from "axios";
import cron from "node-cron";

const app = express();
const { WEBHOOK_URL, PORT = 3000 } = process.env;

const post = async (content) => {
  try {
    await axios.post(
      WEBHOOK_URL,
      {
        content: content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const runJob = () => {
  cron.schedule(
    "0 10,13,16,19 * * 1-5",
    async () => {
      const nowHour = new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        hour12: false,
      });

      let message = "";
      if (nowHour === "10" || nowHour === "13" || nowHour === "16") {
        message =
          "## ❗️ 진행 상황 공유 알림봇\n@2팀\n\n현재 진행중인 내용을 스레드로 공유해주세요!";
      }
      if (nowHour === "19") {
        message =
          "### 🌿 오늘의 프로젝트 마무리 안내\n\n매일 **Notion Tasks** 밑에 *일일 진행 상황 공유*를 작성하고,\n진행 상황도 **Notion에 꼭 업데이트**해주세요! 📝\n\n---\n\n오늘도 프로젝트 너무 수고 많으셨고, 내일 봐요! ☀️";
      }

      try {
        await post(message);
      } catch (error) {
        console.error(error);
      }
    },
    {
      timezone: "Asia/Seoul",
    }
  );
};

app.get("/health", (_, res) => res.status(200).send("OK"));
app.get("/", (_, res) => res.status(200).send("bot is running"));

console.log(`🚀 starting...`);
runJob();
app.listen(PORT, () => {
  console.log(`🚀 server is running on port ${PORT}`);
});
