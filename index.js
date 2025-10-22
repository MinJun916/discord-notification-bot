import express from "express";
import "dotenv/config";
import axios from "axios";
import cron from "node-cron";

const app = express();
const { WEBHOOK_URL = "", PORT = 3000 } = process.env;

const post = async (content) => {
  if (!WEBHOOK_URL) {
    console.error("WEBHOOK_URL이 설정되지 않았습니다.");
    return;
  }

  try {
    const response = await axios.post(
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
    console.log("메시지 전송 성공:", response.status);
  } catch (error) {
    console.error("메시지 전송 실패:", error.response?.data || error.message);
  }
};

const runJob = () => {
  cron.schedule(
    "0 10,13,16,19 * * 1-5",
    async () => {
      const now = new Date();
      const koreaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
      );
      const nowHour = koreaTime.getHours().toString().padStart(2, "0");

      console.log("현재 시간:", nowHour, "타입:", typeof nowHour);

      let message = "";
      if (nowHour === "10" || nowHour === "13" || nowHour === "16") {
        message =
          "## ❗️ 진행 상황 공유 알림봇\n@2팀\n\n현재 진행중인 내용을 스레드로 공유해주세요!";
      }
      if (nowHour === "19") {
        message =
          "### 🌿 오늘의 프로젝트 마무리 안내\n\n매일 **Notion Tasks** 밑에 *일일 진행 상황 공유*를 작성하고,\n진행 상황도 **Notion에 꼭 업데이트**해주세요! 📝\n\n---\n\n오늘도 프로젝트 너무 수고 많으셨고, 내일 봐요! ☀️";
      }

      if (message) {
        await post(message);
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
