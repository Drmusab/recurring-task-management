import { fetchPost } from "siyuan";
import * as logger from "@/utils/logger";

interface BlockInfoResponse {
  data?: {
    content?: string;
    markdown?: string;
    name?: string;
  };
}

export async function fetchBlockPreview(blockId: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      fetchPost(
        "/api/block/getBlockInfo",
        { id: blockId },
        (response: BlockInfoResponse) => {
          const content =
            response?.data?.content ??
            response?.data?.markdown ??
            response?.data?.name ??
            null;
          resolve(content ? content.trim() : null);
        }
      );
    } catch (error) {
      logger.warn("Failed to fetch block preview", error);
      resolve(null);
    }
  });
}
