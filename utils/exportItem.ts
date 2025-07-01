import type { Board } from "~/models/board";
import type { Category } from "~/models/category";

export default function exportItem(item: Category | Board) {
  const dataStr = JSON.stringify(item, null, 2); // Pretty-print JSON
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  const isBoard = "categories" in item;
  const fileName = item.name?.trim()
    ? `${item.name}.json`
    : isBoard
      ? "board.json"
      : "category.json";

  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
