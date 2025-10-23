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
    "0 9,10,14,17,18,19 * * 1-5",
    async () => {
      const now = new Date();
      const koreaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
      );
      const nowHour = koreaTime.getHours().toString().padStart(2, "0");
      const dayOfWeek = koreaTime.getDay();

      console.log(
        "현재 시간:",
        nowHour,
        "요일:",
        dayOfWeek,
        "타입:",
        typeof nowHour
      );

      let message = "";

      // 9시 아침 알림 (모든 요일)
      if (nowHour === "9") {
        message =
          "## 🌞 데일리 알림\n<@&1427591650166702161>\n\n질문이나 궁금한 부분, 이야기 나누고 싶은 주제가 있으시면 언제든 **디스코드 음성채널**로 와주세요! 🎧\n\n오늘도 화이팅🍀";
      }

      // 진행 상황 공유 (모든 요일)
      if (nowHour === "10" || nowHour === "14" || nowHour === "17") {
        message =
          "## ❗️ 진행 상황 공유 알림봇\n<@&1427591650166702161>\n\n현재 진행중인 내용을 스레드로 공유해주세요!";
      }

      // 마무리 안내 (요일별 분기)
      if (dayOfWeek === 5 && nowHour === "18") {
        message =
          "## 🎉 금요일 마무리 안내\n<@&1427591650166702161>\n\n이번 주도 수고 많으셨습니다! 🎊\n\n**Notion Tasks**에 이번 주 진행 상황을 정리하고,\n주말 동안 푹 쉬시고 다음 주에 만나요! 🌟\n\n---\n\n주말 잘 보내세요! ☀️";
      } else if (dayOfWeek !== 5 && nowHour === "19") {
        message =
          "## 🌿 오늘의 프로젝트 마무리 안내\n<@&1427591650166702161>\n\n매일 **Notion Tasks** 밑에 *일일 진행 상황 공유*를 작성하고,\n진행 상황도 **Notion에 꼭 업데이트**해주세요! 📝\n\n---\n\n오늘도 프로젝트 너무 수고 많으셨고, 내일 봐요! ☀️";
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
