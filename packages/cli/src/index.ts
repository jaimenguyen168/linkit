import { Command } from "commander";
import { sendTelegramMessage } from "linkit-core";

type TelegramResponse = {
  ok: boolean;
  result?: {
    message_id?: number;
  };
  description?: string;
};

const program = new Command();

program
  .name("linkit")
  .description("Linkit CLI")
  .command("telegram")
  .description("Send a Telegram message")
  .argument("<chatId>", "Telegram chat ID")
  .argument("<message>", "Message to send")
  .action(async (chatId: string, message: string) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      console.error("Missing TELEGRAM_BOT_TOKEN environment variable");
      process.exit(1);
    }

    if (!chatId) {
      console.error("Missing Telegram chat ID");
      process.exit(1);
    }

    if (!message) {
      console.error("Missing Telegram message");
      process.exit(1);
    }

    try {
      const result = await sendTelegramMessage({
        chatId,
        message,
        botToken: token,
      });

      console.log("Message sent to Telegram chat ID:", result.chatId);
      console.log("Message ID:", result.messageId);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error("Failed to send message to Telegram:", detail);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
