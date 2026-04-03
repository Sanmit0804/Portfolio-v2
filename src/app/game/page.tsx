'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreadsBackground from '@/components/ThreadsBackground';
import Button from '@/components/ui/Button';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Vec2 { x: number; y: number; }

interface Ship {
  pos: Vec2; vel: Vec2; angle: number;
  thrusting: boolean; invincible: number;
}

interface Bullet {
  pos: Vec2; vel: Vec2; life: number;
}

interface Asteroid {
  pos: Vec2; vel: Vec2; radius: number;
  angle: number; spin: number; vertices: Vec2[];
}

interface Particle {
  pos: Vec2; vel: Vec2; life: number; maxLife: number;
  color: string; size: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SHIP_SIZE = 18;
const BULLET_SPEED = 520;
const BULLET_LIFE = 0.85;
const SHIP_THRUST = 260;
const SHIP_FRICTION = 0.015;
const SHIP_TURN_SPEED = 3.8;
const INVINCIBLE_TIME = 2.2;
const FIRE_COOLDOWN = 0.18;

const ASTEROID_SIZES = [52, 32, 18];
const ASTEROID_SCORE = [20, 50, 100];
const ASTEROID_SPEED_BASE = 60;

function randomBetween(a: number, b: number) { return a + Math.random() * (b - a); }
function angleTo(a: number): Vec2 { return { x: Math.cos(a), y: Math.sin(a) }; }
function dist(a: Vec2, b: Vec2) { return Math.hypot(a.x - b.x, a.y - b.y); }

function makeAsteroidVertices(r: number) {
  const n = Math.floor(randomBetween(8, 14));
  return Array.from({ length: n }, (_, i) => {
    const ang = (i / n) * Math.PI * 2;
    const rad = r * randomBetween(0.75, 1.25);
    return { x: Math.cos(ang) * rad, y: Math.sin(ang) * rad };
  });
}

function spawnAsteroid(w: number, h: number, ship: Vec2, radius: number): Asteroid {
  let pos: Vec2;
  do {
    pos = { x: Math.random() * w, y: Math.random() * h };
  } while (dist(pos, ship) < radius * 4 + 100);

  const ang = Math.random() * Math.PI * 2;
  const speed = randomBetween(ASTEROID_SPEED_BASE * 0.6, ASTEROID_SPEED_BASE * 1.4);
  return {
    pos, angle: ang, spin: randomBetween(-1.2, 1.2),
    vel: { x: Math.cos(ang) * speed, y: Math.sin(ang) * speed },
    radius, vertices: makeAsteroidVertices(radius),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<'idle' | 'playing' | 'dead' | 'gameover'>('idle');
  const [uiState, setUiState] = useState<'idle' | 'playing' | 'dead' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);

  // live game values exposed to UI via ref—avoids re-renders
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);

  const keys = useRef<Record<string, boolean>>({});

  // ─── Game loop ─────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl; // non-null alias for closure

    let animId = 0;
    let prevTime = performance.now();

    // game state
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    setScore(0); setLives(3); setLevel(1);
    stateRef.current = 'playing';
    setUiState('playing');

    const W = () => canvas.width;
    const H = () => canvas.height;

    function makeShip(): Ship {
      return { pos: { x: W() / 2, y: H() / 2 }, vel: { x: 0, y: 0 }, angle: -Math.PI / 2, thrusting: false, invincible: INVINCIBLE_TIME };
    }

    function spawnWave(lv: number): Asteroid[] {
      const count = 3 + lv;
      return Array.from({ length: count }, () => spawnAsteroid(W(), H(), ship.pos, ASTEROID_SIZES[0]));
    }

    let ship: Ship = makeShip();
    let bullets: Bullet[] = [];
    let asteroids: Asteroid[] = spawnWave(1);
    let particles: Particle[] = [];
    let fireCooldown = 0;
    let stars: Vec2[] = Array.from({ length: 120 }, () => ({ x: Math.random() * 1920, y: Math.random() * 1080 }));

    function wrap(p: Vec2) {
      if (p.x < 0) p.x += W(); if (p.x > W()) p.x -= W();
      if (p.y < 0) p.y += H(); if (p.y > H()) p.y -= H();
    }

    function explodeAsteroid(a: Asteroid) {
      // particles
      for (let i = 0; i < 18; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = randomBetween(30, 150);
        particles.push({
          pos: { ...a.pos }, vel: { x: Math.cos(ang) * spd, y: Math.sin(ang) * spd },
          life: randomBetween(0.5, 1.4), maxLife: 1.4,
          color: ['#60a5fa', '#a78bfa', '#f472b6', '#34d399'][Math.floor(Math.random() * 4)],
          size: randomBetween(1.5, 4),
        });
      }

      // split
      const sizeIdx = ASTEROID_SIZES.indexOf(a.radius);
      if (sizeIdx < ASTEROID_SIZES.length - 1) {
        const nextR = ASTEROID_SIZES[sizeIdx + 1];
        for (let k = 0; k < 2; k++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = randomBetween(ASTEROID_SPEED_BASE * 0.9, ASTEROID_SPEED_BASE * 1.8);
          asteroids.push({
            pos: { ...a.pos }, angle: ang, spin: randomBetween(-2, 2),
            vel: { x: Math.cos(ang) * spd, y: Math.sin(ang) * spd },
            radius: nextR, vertices: makeAsteroidVertices(nextR),
          });
        }
      }

      const scoreAdd = ASTEROID_SCORE[sizeIdx];
      scoreRef.current += scoreAdd;
      setScore(scoreRef.current);
    }

    function destroyShip() {
      for (let i = 0; i < 30; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = randomBetween(50, 200);
        particles.push({
          pos: { ...ship.pos }, vel: { x: Math.cos(ang) * spd, y: Math.sin(ang) * spd },
          life: randomBetween(0.8, 2.0), maxLife: 2.0,
          color: ['#fbbf24', '#f87171', '#fb923c', '#fff'][Math.floor(Math.random() * 4)],
          size: randomBetween(2, 6),
        });
      }
      livesRef.current -= 1;
      setLives(livesRef.current);

      if (livesRef.current <= 0) {
        stateRef.current = 'gameover';
        setUiState('gameover');
        if (scoreRef.current > highScore) setHighScore(scoreRef.current);
        cancelAnimationFrame(animId);
        return;
      }
      stateRef.current = 'dead';
      setUiState('dead');
      setTimeout(() => {
        ship = makeShip();
        bullets = [];
        stateRef.current = 'playing';
        setUiState('playing');
      }, 1200);
    }

    // ── Draw helpers ──────────────────────────────────────────────────────────
    function drawShip(ctx: CanvasRenderingContext2D) {
      if (stateRef.current === 'dead') return;
      const { pos, angle, invincible, thrusting } = ship;
      if (invincible > 0 && Math.floor(invincible * 10) % 2 === 0) return; // blink

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(angle + Math.PI / 2);

      // thruster glow
      if (thrusting) {
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(0, SHIP_SIZE * 0.5);
        ctx.lineTo(-SHIP_SIZE * 0.35, SHIP_SIZE * 1.1 + Math.random() * 8);
        ctx.lineTo(SHIP_SIZE * 0.35, SHIP_SIZE * 1.1 + Math.random() * 8);
        ctx.closePath();
        ctx.fillStyle = '#93c5fd88';
        ctx.fill();
      }

      // ship body
      ctx.shadowColor = '#a78bfa';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(0, -SHIP_SIZE);
      ctx.lineTo(SHIP_SIZE * 0.65, SHIP_SIZE * 0.75);
      ctx.lineTo(0, SHIP_SIZE * 0.35);
      ctx.lineTo(-SHIP_SIZE * 0.65, SHIP_SIZE * 0.75);
      ctx.closePath();
      ctx.strokeStyle = '#c4b5fd';
      ctx.lineWidth = 2;
      ctx.stroke();

      // cockpit
      ctx.beginPath();
      ctx.arc(0, -SHIP_SIZE * 0.3, SHIP_SIZE * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#60a5fa44';
      ctx.fill();
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
    }

    function drawAsteroid(ctx: CanvasRenderingContext2D, a: Asteroid) {
      ctx.save();
      ctx.translate(a.pos.x, a.pos.y);
      ctx.rotate(a.angle);

      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(a.vertices[0].x, a.vertices[0].y);
      for (let i = 1; i < a.vertices.length; i++) ctx.lineTo(a.vertices[i].x, a.vertices[i].y);
      ctx.closePath();
      ctx.strokeStyle = '#818cf8cc';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.fillStyle = '#1e1b4b44';
      ctx.fill();
      ctx.restore();
    }

    function drawBullet(ctx: CanvasRenderingContext2D, b: Bullet) {
      ctx.save();
      ctx.shadowColor = '#f472b6';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(b.pos.x, b.pos.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f9a8d4';
      ctx.fill();
      ctx.restore();
    }

    function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.pos.x, p.pos.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    }

    // ── Main loop ─────────────────────────────────────────────────────────────
    function loop(now: number) {
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      const ctx = canvas.getContext('2d')!;
      const w = canvas.width, h = canvas.height;

      // ── Background ────────────────────────────────────────────────────────
      ctx.fillStyle = '#03010f';
      ctx.fillRect(0, 0, w, h);

      // stars
      stars.forEach(s => {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillRect(((s.x % w) + w) % w, ((s.y % h) + h) % h, 1.5, 1.5);
      });

      if (stateRef.current !== 'playing') {
        animId = requestAnimationFrame(loop);
        // still animate particles
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
          p.pos.x += p.vel.x * dt; p.pos.y += p.vel.y * dt;
          p.vel.x *= 0.97; p.vel.y *= 0.97;
          p.life -= dt;
          drawParticle(ctx, p);
        });
        asteroids.forEach(a => {
          a.pos.x += a.vel.x * dt; a.pos.y += a.vel.y * dt;
          a.angle += a.spin * dt;
          wrap(a.pos);
          drawAsteroid(ctx, a);
        });
        if (stateRef.current !== 'gameover') drawShip(ctx);
        return;
      }

      // ── Input ────────────────────────────────────────────────────────────
      const k = keys.current;
      if (k['ArrowLeft'] || k['a'] || k['A']) ship.angle -= SHIP_TURN_SPEED * dt;
      if (k['ArrowRight'] || k['d'] || k['D']) ship.angle += SHIP_TURN_SPEED * dt;

      ship.thrusting = !!(k['ArrowUp'] || k['w'] || k['W']);
      if (ship.thrusting) {
        const dir = angleTo(ship.angle);
        ship.vel.x += dir.x * SHIP_THRUST * dt;
        ship.vel.y += dir.y * SHIP_THRUST * dt;
      }

      // friction
      const speed = Math.hypot(ship.vel.x, ship.vel.y);
      if (speed > 0) {
        const decel = Math.min(SHIP_FRICTION * 60 * dt * speed, speed);
        ship.vel.x -= (ship.vel.x / speed) * decel;
        ship.vel.y -= (ship.vel.y / speed) * decel;
      }

      ship.pos.x += ship.vel.x * dt;
      ship.pos.y += ship.vel.y * dt;
      wrap(ship.pos);

      // fire
      fireCooldown -= dt;
      if ((k[' '] || k['Space'] || k['x'] || k['X']) && fireCooldown <= 0) {
        fireCooldown = FIRE_COOLDOWN;
        const dir = angleTo(ship.angle);
        bullets.push({
          pos: { x: ship.pos.x + dir.x * SHIP_SIZE, y: ship.pos.y + dir.y * SHIP_SIZE },
          vel: { x: dir.x * BULLET_SPEED + ship.vel.x, y: dir.y * BULLET_SPEED + ship.vel.y },
          life: BULLET_LIFE,
        });
      }

      // invincible timer
      if (ship.invincible > 0) ship.invincible -= dt;

      // ── Update bullets ────────────────────────────────────────────────────
      bullets = bullets.filter(b => b.life > 0);
      bullets.forEach(b => {
        b.pos.x += b.vel.x * dt; b.pos.y += b.vel.y * dt;
        b.life -= dt;
        wrap(b.pos);
      });

      // ── Update asteroids ──────────────────────────────────────────────────
      asteroids.forEach(a => {
        a.pos.x += a.vel.x * dt; a.pos.y += a.vel.y * dt;
        a.angle += a.spin * dt;
        wrap(a.pos);
      });

      // ── Update particles ──────────────────────────────────────────────────
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.pos.x += p.vel.x * dt; p.pos.y += p.vel.y * dt;
        p.vel.x *= 0.97; p.vel.y *= 0.97;
        p.life -= dt;
      });

      // ── Collisions ────────────────────────────────────────────────────────
      const hitAsteroids = new Set<number>();
      const hitBullets = new Set<number>();

      asteroids.forEach((a, ai) => {
        // bullet vs asteroid
        bullets.forEach((b, bi) => {
          if (dist(b.pos, a.pos) < a.radius) {
            hitAsteroids.add(ai);
            hitBullets.add(bi);
          }
        });

        // ship vs asteroid (if not invincible)
        if (ship.invincible <= 0 && dist(ship.pos, a.pos) < a.radius + SHIP_SIZE * 0.7) {
          destroyShip();
        }
      });

      // remove hit bullets
      bullets = bullets.filter((_, i) => !hitBullets.has(i));

      // explode hit asteroids (reverse to keep indices correct)
      [...hitAsteroids].sort((a, b) => b - a).forEach(ai => {
        explodeAsteroid(asteroids[ai]);
        asteroids.splice(ai, 1);
      });

      // ── Level up ─────────────────────────────────────────────────────────
      if (asteroids.length === 0) {
        levelRef.current += 1;
        setLevel(levelRef.current);
        asteroids = spawnWave(levelRef.current);
        ship.invincible = INVINCIBLE_TIME;
        // Boost asteroid speed each level
        asteroids.forEach(a => {
          const boost = 1 + (levelRef.current - 1) * 0.15;
          a.vel.x *= boost; a.vel.y *= boost;
        });
      }

      // ── Draw ─────────────────────────────────────────────────────────────
      particles.forEach(p => drawParticle(ctx, p));
      asteroids.forEach(a => drawAsteroid(ctx, a));
      bullets.forEach(b => drawBullet(ctx, b));
      drawShip(ctx);

      // HUD
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.textAlign = 'left';
      ctx.fillText(`LVL ${levelRef.current}`, 16, h - 16);
      ctx.textAlign = 'right';
      ctx.fillText(`${scoreRef.current} PTS`, w - 16, h - 16);

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [highScore]);

  // ─── Key listeners ─────────────────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
      if ([' ', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => { keys.current[e.key] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // ─── Canvas resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ─── Mobile touch ─────────────────────────────────────────────────────────
  const touchLeft = useRef(false);
  const touchRight = useRef(false);
  const touchUp = useRef(false);
  const touchFire = useRef(false);

  useEffect(() => {
    // mirror touch buttons into keys ref
    const sync = () => {
      keys.current['ArrowLeft'] = touchLeft.current;
      keys.current['ArrowRight'] = touchRight.current;
      keys.current['ArrowUp'] = touchUp.current;
      keys.current[' '] = touchFire.current;
    };
    const id = setInterval(sync, 16);
    return () => clearInterval(id);
  }, []);

  const heartIcons = Array.from({ length: 3 }, (_, i) => i < lives);

  return (
    <main className="relative min-h-screen w-full bg-[#03010f] text-white overflow-hidden flex flex-col pb-24 md:pb-28">
      <ThreadsBackground />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-10 pb-4 flex items-center justify-between"
      >
        <div>
          <span className="text-xs uppercase tracking-[0.35em] text-blue-400/80 font-inter">Arcade</span>
          <h1 className="mt-1 font-outfit font-black text-white leading-none" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
            Neon Asteroids
          </h1>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-1.5">
            {heartIcons.map((alive, i) => (
              <motion.span key={i} animate={{ scale: alive ? 1 : 0.5, opacity: alive ? 1 : 0.3 }}
                className={`text-lg ${alive ? 'text-red-400' : 'text-white/20'}`}>♥</motion.span>
            ))}
          </div>
          <span className="text-xs font-inter text-white/30">High: <span className="text-blue-300">{highScore}</span></span>
        </div>
      </motion.div>

      {/* ── Score bar ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
        <div className="liquid-glass flex items-center justify-between px-5 py-3 mb-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-inter uppercase tracking-widest text-white/30">Score</p>
              <p className="font-outfit font-bold text-white text-lg tabular-nums">{score.toLocaleString()}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-[10px] font-inter uppercase tracking-widest text-white/30">Level</p>
              <p className="font-outfit font-bold text-blue-300 text-lg">{level}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-inter text-white/25 tracking-widest uppercase">
            <span>↑/W Thrust</span>
            <span>←→/AD Turn</span>
            <span>Space Fire</span>
          </div>
        </div>
      </div>

      {/* ── Canvas area ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex-1">
        <div className="relative w-full" style={{ paddingBottom: 'min(60vh, 520px)' }}>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full rounded-2xl border border-white/10"
            style={{ background: '#03010f' }}
          />

          {/* ── Overlay states ── */}
          <AnimatePresence>
            {uiState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
                style={{ background: 'rgba(3,1,15,0.85)', backdropFilter: 'blur(6px)' }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="text-6xl mb-6"
                >🚀</motion.div>
                <h2 className="font-outfit font-black text-3xl md:text-5xl text-white mb-3">Neon Asteroids</h2>
                <p className="text-white/40 font-inter text-sm mb-8 text-center px-4">
                  Survive the void. Blast every rock. Reach the highest score.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8 text-xs font-inter text-white/30 text-center">
                  <div className="liquid-glass px-4 py-3">⬆ / W — Thrust</div>
                  <div className="liquid-glass px-4 py-3">⬅ ➡ / A D — Rotate</div>
                  <div className="liquid-glass px-4 py-3">SPACE / X — Fire</div>
                </div>
                <Button onClick={startGame} variant="primary" size="md" className='cursor-pointer'>Launch Game</Button>
              </motion.div>
            )}

            {uiState === 'gameover' && (
              <motion.div
                key="gameover"
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
                style={{ background: 'rgba(3,1,15,0.92)', backdropFilter: 'blur(8px)' }}
              >
                <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 0.6, delay: 0.2 }} className="text-5xl mb-5">💥</motion.div>
                <h2 className="font-outfit font-black text-4xl text-white mb-2">Game Over</h2>
                <p className="text-white/40 font-inter text-sm mb-6">You scored</p>
                <motion.p
                  initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="font-outfit font-black tabular-nums mb-1"
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', background: 'linear-gradient(135deg, #c4b5fd, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {score.toLocaleString()}
                </motion.p>
                {score >= highScore && score > 0 && (
                  <p className="text-yellow-400 font-outfit font-bold text-sm mb-6 tracking-widest uppercase">🏆 New High Score!</p>
                )}
                <p className="text-white/30 font-inter text-xs mb-8">Level reached: <span className="text-blue-300 font-bold">{level}</span></p>
                <motion.button
                  id="game-restart-btn"
                  onClick={startGame}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="px-10 py-4 rounded-full font-outfit font-bold text-lg text-white cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 40px #7c3aed55' }}
                >
                  Play Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile controls ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 mt-3 pb-2 md:hidden">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Turn */}
          <div className="flex gap-3">
            <button
              id="mobile-left-btn"
              onTouchStart={() => { touchLeft.current = true; }} onTouchEnd={() => { touchLeft.current = false; }}
              onMouseDown={() => { touchLeft.current = true; }} onMouseUp={() => { touchLeft.current = false; }}
              className="liquid-glass w-14 h-14 flex items-center justify-center text-2xl rounded-full select-none active:bg-white/20"
            >◀</button>
            <button
              id="mobile-right-btn"
              onTouchStart={() => { touchRight.current = true; }} onTouchEnd={() => { touchRight.current = false; }}
              onMouseDown={() => { touchRight.current = true; }} onMouseUp={() => { touchRight.current = false; }}
              className="liquid-glass w-14 h-14 flex items-center justify-center text-2xl rounded-full select-none active:bg-white/20"
            >▶</button>
          </div>

          {/* Center: Thrust */}
          <button
            id="mobile-thrust-btn"
            onTouchStart={() => { touchUp.current = true; }} onTouchEnd={() => { touchUp.current = false; }}
            onMouseDown={() => { touchUp.current = true; }} onMouseUp={() => { touchUp.current = false; }}
            className="liquid-glass w-16 h-16 flex items-center justify-center text-2xl rounded-full select-none active:bg-blue-500/30"
          >🚀</button>

          {/* Right: Fire */}
          <button
            id="mobile-fire-btn"
            onTouchStart={() => { touchFire.current = true; }} onTouchEnd={() => { touchFire.current = false; }}
            onMouseDown={() => { touchFire.current = true; }} onMouseUp={() => { touchFire.current = false; }}
            className="w-20 h-14 flex items-center justify-center text-sm font-outfit font-bold rounded-full select-none"
            style={{ background: 'linear-gradient(135deg, #7c3aed88, #4f46e588)', border: '1px solid #7c3aed66' }}
          >FIRE</button>
        </div>
      </div>
    </main>
  );
}
