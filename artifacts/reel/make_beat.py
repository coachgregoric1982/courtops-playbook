#!/usr/bin/env python3
"""Original boom-bap / hip-hop instrumental bed. Not sampled from any track."""
import math
import struct
import wave
from pathlib import Path

SR = 44100
BPM = 92
BEAT = 60.0 / BPM
DUR = 27.0
N = int(SR * DUR)


def env(i, a, h, rel, tot):
    t = i / SR
    if t < a:
        return t / a
    if t < a + h:
        return 1.0
    if t < tot:
        return max(0.0, 1.0 - (t - a - h) / rel)
    return 0.0


buf = [0.0] * N


def add(i, val):
    if 0 <= i < N:
        buf[i] += val


def kick(start):
    length = int(0.28 * SR)
    for i in range(length):
        t = i / SR
        freq = 148 * math.exp(-t * 18) + 42
        s = math.sin(2 * math.pi * freq * t)
        s *= env(i, 0.002, 0.03, 0.22, 0.28)
        add(start + i, s * 0.95)


def snare(start):
    length = int(0.18 * SR)
    x = 0.37
    for i in range(length):
        t = i / SR
        x = (x * 1103515245 + 12345) % 2**31
        n = (x / 2**30) - 1
        tone = math.sin(2 * math.pi * 188 * t)
        s = n * 0.72 + tone * 0.28
        s *= env(i, 0.001, 0.02, 0.14, 0.18)
        add(start + i, s * 0.42)


def hat(start, open_=False):
    length = int((0.09 if open_ else 0.045) * SR)
    x = 81
    for i in range(length):
        x = (x * 1664525 + 1013904223) % 2**32
        n = (x / 2**31) - 1.0
        n = n - 0.55 * (((x >> 3) / 2**31) - 1.0)
        rel = 0.08 if open_ else 0.035
        s = n * env(i, 0.0008, 0.004, rel, rel + 0.01)
        add(start + i, s * (0.18 if open_ else 0.11))


def bass(start, freq, length_s=0.42):
    length = int(length_s * SR)
    for i in range(length):
        t = i / SR
        # 808-ish
        f = freq * math.exp(-t * 1.6)
        s = math.sin(2 * math.pi * f * t)
        s += 0.15 * math.sin(2 * math.pi * f * 2 * t)
        s *= env(i, 0.006, 0.08, length_s - 0.1, length_s)
        add(start + i, s * 0.38)


# A minor pentatonic around 55 Hz (A1)
NOTES = [55.00, 65.41, 73.42, 82.41, 98.00]
pattern = [0, 0, 3, 2, 0, 4, 3, 0]

bars = int(DUR / (BEAT * 4)) + 1
for bar in range(bars):
    bar_t = bar * 4 * BEAT
    # kick 1 and 3, extra on the and of 4
    for k in (0, 2):
        kick(int((bar_t + k * BEAT) * SR))
    kick(int((bar_t + 3.5 * BEAT) * SR))
    # snare 2 and 4
    for s in (1, 3):
        snare(int((bar_t + s * BEAT) * SR))
    # hats 8ths, open on last
    for h in range(8):
        hat(int((bar_t + h * BEAT * 0.5) * SR), open_=(h == 7))
    # bass
    note = NOTES[pattern[bar % len(pattern)]]
    bass(int(bar_t * SR), note, 0.55)
    bass(int((bar_t + 2.5 * BEAT) * SR), note * 1.5 if bar % 2 else note * 0.75, 0.28)

# soft clip + fade
out = bytearray()
fade_n = int(0.9 * SR)
for i, s in enumerate(buf):
    g = 1.0
    if i < int(0.25 * SR):
        g = i / (0.25 * SR)
    if i > N - fade_n:
        g *= max(0.0, (N - i) / fade_n)
    s = max(-1.0, min(1.0, math.tanh(s * 1.15) * g * 0.85))
    v = int(s * 32767)
    out += struct.pack("<hh", v, v)

path = Path("/workspace/artifacts/reel/beat.wav")
with wave.open(str(path), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out)
print("wrote", path, "sec", DUR)
