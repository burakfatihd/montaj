"""Synthesize a 30 s, 120 BPM placeholder track for the Reels cut.

Structure (seconds): 0-8 build (kick + hats + pad), 7-8 riser, 8-26.5 full groove,
26.5 final hit, tail fades to 30.
"""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import lfilter

SR = 44100
DUR = 30.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(7)
out = np.zeros((N, 2))


def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    out[i : i + len(sig), 0] += sig * gain * (1 - max(pan, 0))
    out[i : i + len(sig), 1] += sig * gain * (1 + min(pan, 0))


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    e = np.minimum(t / a, 1) * np.exp(-t / d)
    return e


def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(n, 0.001, 0.16)


def clap():
    n = int(0.25 * SR)
    noise = rng.standard_normal(n)
    noise = np.diff(np.concatenate([[0], noise]))  # crude highpass
    return noise * env(n, 0.001, 0.06) * 0.6


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    noise = rng.standard_normal(n)
    noise = np.diff(np.concatenate([[0], np.diff(np.concatenate([[0], noise]))]))
    return noise * env(n, 0.0005, 0.06 if open_ else 0.015) * 0.25


def saw(freq, n):
    t = np.arange(n) / SR
    s = np.zeros(n)
    for k in range(1, 12):
        s += np.sin(2 * np.pi * freq * k * t) / k
    return s


def lowpass(x, alpha):
    return lfilter([alpha], [1, alpha - 1], x)


def note(f, dur, d=0.25, lp=0.08):
    n = int(dur * SR)
    return lowpass(saw(f, n), lp) * env(n, 0.005, d)


# Am - F - C - G
roots = [110.0, 87.31, 130.81, 98.0]
chords = [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [261.63, 329.63, 392.0], [196.0, 246.94, 293.66]]

bar = 4 * BEAT
n_bars = int(DUR / bar)
for b in range(n_bars):
    t0 = b * bar
    ci = b % 4
    full = 8.0 <= t0 < 26.5
    # pad
    pad_n = int(bar * SR)
    pad = sum(lowpass(saw(f, pad_n), 0.03) for f in chords[ci])
    pad *= np.minimum(np.arange(pad_n) / (0.3 * SR), 1) * np.minimum((pad_n - np.arange(pad_n)) / (0.3 * SR), 1)
    if t0 < 26.5:
        add(pad, t0, 0.05 if full else 0.07)
    for s in range(8):  # eighth notes
        t = t0 + s * BEAT / 2
        if t >= 26.5:
            break
        if s % 2 == 0 and (t0 >= 2.0 or s == 0):
            add(kick(), t, 0.9)
        if full and s in (2, 6):
            add(clap(), t, 0.7)
        if t0 >= 2.0:
            add(hat(open_=(full and s % 2 == 1)), t, 1.0, pan=0.3 if s % 2 else -0.3)
        if full:
            f = roots[ci] / 2 * (2 if s % 4 == 3 else 1)
            add(note(f, BEAT / 2, 0.12, 0.12), t, 0.35)
            # arp pluck
            arp = chords[ci][s % 3] * 2
            add(note(arp, BEAT / 2, 0.08, 0.2), t, 0.06, pan=-0.4 if s % 2 else 0.4)

# riser into the drop at 8 s
rn = int(1.0 * SR)
rt = np.arange(rn) / SR
riser = rng.standard_normal(rn) * (rt / 1.0) ** 2 * 0.25
riser += np.sin(2 * np.pi * np.cumsum(200 + 1400 * rt) / SR) * (rt / 1.0) ** 2 * 0.1
add(riser, 7.0)

# final impact at 26.5 s
hit_n = int(3.5 * SR)
ht = np.arange(hit_n) / SR
hit = np.sin(2 * np.pi * np.cumsum(40 + 80 * np.exp(-ht * 10)) / SR) * np.exp(-ht * 1.2)
hit += sum(lowpass(saw(f, hit_n), 0.04) for f in chords[0]) * np.exp(-ht * 0.9) * 0.15
add(hit, 26.5, 0.9)

# master
out /= np.max(np.abs(out)) + 1e-9
out = np.tanh(out * 1.6) / np.tanh(1.6)
fade = int(0.6 * SR)
out[-fade:] *= np.linspace(1, 0, fade)[:, None]
wavfile.write(sys.argv[1], SR, (out * 0.89 * 32767).astype(np.int16))
print("wrote", sys.argv[1])
