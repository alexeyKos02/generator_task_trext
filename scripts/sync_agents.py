#!/usr/bin/env python3
"""
Скрипт синхронизации данных агентов с Яндекс.Диска.

Использование:
  python3 scripts/sync_agents.py

Что делает:
  1. Скачивает Excel-файл с Яндекс.Диска по публичной ссылке
  2. Парсит лист «БД»
  3. Группирует терминалы по агенту (gateId)
  4. Записывает результат в public/agents.json
"""

import json
import sys
import urllib.request
from pathlib import Path

# ─── Настройки ────────────────────────────────────────────────────────────────
YANDEX_DISK_PUBLIC_URL = "https://disk.yandex.ru/i/Btt9AO4fER4ilg"
OUTPUT_PATH = Path(__file__).parent.parent / "public" / "agents.json"

# ─── Получаем прямую ссылку на скачивание через API Яндекс.Диска ─────────────
def get_download_url(public_url: str) -> str:
    api_url = (
        "https://cloud-api.yandex.net/v1/disk/public/resources/download"
        f"?public_key={urllib.parse.quote(public_url)}"
    )
    req = urllib.request.Request(api_url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
        return data["href"]

# ─── Скачиваем файл во временную папку ───────────────────────────────────────
def download_file(url: str, dest: Path) -> None:
    urllib.request.urlretrieve(url, dest)

# ─── Парсим Excel ─────────────────────────────────────────────────────────────
def parse_excel(path: Path) -> list[dict]:
    try:
        import openpyxl
    except ImportError:
        print("Установите openpyxl: pip install openpyxl", file=sys.stderr)
        sys.exit(1)

    wb = openpyxl.load_workbook(path)
    ws = wb["БД"]

    agents: dict[int, dict] = {}

    for row in ws.iter_rows(min_row=2, values_only=True):
        # Колонки: №, ЮЛ, МТС ID, Регион, Город, Улица, Дом,
        #          Terminal ID, Агент ID, GUID, Ответственный, Комментарии, Статус
        if len(row) < 10:
            continue
        _, name, _, _, _, _, _, terminal_id, agent_id, guid = row[:10]

        if not name or not agent_id:
            continue

        gate_id = int(agent_id)

        if gate_id not in agents:
            agents[gate_id] = {
                "name": str(name).strip(),
                "gateId": gate_id,
                "guid1c": str(guid).strip() if guid else "",
                "salesChannel1cbu": "",
                "salesChannelReports": "",
                "terminalIds": [],
            }

        if terminal_id:
            tid = int(terminal_id)
            if tid not in agents[gate_id]["terminalIds"]:
                agents[gate_id]["terminalIds"].append(tid)

    result = sorted(agents.values(), key=lambda x: x["gateId"])
    for a in result:
        a["terminalIds"].sort()

    return result

# ─── Точка входа ─────────────────────────────────────────────────────────────
def main():
    import urllib.parse
    import tempfile

    print("📥 Получаем ссылку на скачивание с Яндекс.Диска…")
    download_url = get_download_url(YANDEX_DISK_PUBLIC_URL)

    with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as tmp:
        tmp_path = Path(tmp.name)

    print(f"📦 Скачиваем файл…")
    download_file(download_url, tmp_path)

    print("📊 Парсим Excel…")
    data = parse_excel(tmp_path)
    tmp_path.unlink()

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"✅ Готово: {len(data)} агентов → {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
