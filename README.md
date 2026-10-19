# montaj

Video üretim sistemi: [OpenMontage](https://github.com/calesthio/OpenMontage) + PrepTest Reels (Remotion).

| Klasör | Ne |
|---|---|
| `OpenMontage/` | AI destekli video üretim sistemi (git submodule, orijinal repo: calesthio/OpenMontage, AGPL-3.0) |
| `preptest-reels/` | CEnT-S Reels videosunun Remotion projesi (kod, klipler, görseller, müzik, efektler) |
| `storyboard/` | Reels storyboard'u (`storyboard.html`) ve keyframe görselleri |

## Kurulum

Gerekenler: Git, Node.js 18+, Python 3.10+, FFmpeg.

```bash
git clone --recursive https://github.com/burakfatihd/montaj.git
cd montaj
```

`--recursive` olmadan klonladıysan: `git submodule update --init`

### OpenMontage

```bash
cd OpenMontage
make setup
```

`make` yoksa (macOS/Linux):

```bash
python3 -m venv .venv && source .venv/bin/activate && python -m pip install -r requirements.txt && cd remotion-composer && npm install && cd .. && python -m pip install piper-tts && cp .env.example .env
```

API anahtarları `OpenMontage/.env` dosyasına girilir. Ayrıntılar: `OpenMontage/README.md`.

### PrepTest Reels

```bash
cd preptest-reels
npm install
npm run studio   # tarayıcıda önizleme / düzenleme
npm run render   # out/cents-video-dersler-reels.mp4 üretir
```

`scripts/make_music.py` (yer tutucu müzik üretici) numpy ve scipy ister; OpenMontage'ın `.venv` ortamında ikisi de var:

```bash
../OpenMontage/.venv/bin/python scripts/make_music.py public/music.wav
```
