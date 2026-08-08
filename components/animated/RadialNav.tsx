'use client';

import * as React from 'react';
import { MousePointer2, Home, User, Mail, Bell, Settings, type LucideIcon } from 'lucide-react';
import { motion, type Variants, type Transition } from 'motion/react';

type RadialNavProps = {
  size?: number;
  items: RadialNavItem[];
  menuButtonConfig?: MenuButtonConfig;
  defaultActiveId?: number;
  onActiveChange?: (id: number) => void;
};

type RadialNavItem = {
  id: number;
  icon: LucideIcon;
  label: string;
  angle: number;
};

type MenuButtonConfig = {
  iconSize?: number; // px
  buttonSize?: number; // px, button diameter when collapsed
  buttonPadding?: number; // px
};

const defaultMenuButtonConfig: Required<MenuButtonConfig> = {
  iconSize: 20,
  buttonSize: 40,
  buttonPadding: 8,
};

const POINTER_BASE_DEG = 45;

const POINTER_ROT_SPRING = {
  type: 'spring',
  stiffness: 180,
  damping: 20,
} as const;

// Now purely hover-driven — 'rest' when not hovered, 'hover' when hovered.
const BUTTON_MOTION_CONFIG = {
  initial: 'rest',
  whileHover: 'hover',
  whileTap: 'tap',
  variants: {
    rest: { maxWidth: '40px' },
    hover: {
      maxWidth: '140px',
      transition: { type: 'spring', stiffness: 200, damping: 35, delay: 0.05 },
    },
    tap: { scale: 0.95 },
  },
  transition: { type: 'spring', stiffness: 200, damping: 25 },
} as const;

const LABEL_VARIANTS: Variants = {
  rest: { opacity: 0, x: 4 },
  hover: {
    opacity: 1,
    x: 0,
    visibility: 'visible',
    width: 'auto',
  },
};

const LABEL_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

function getPolarCoordinates(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}

function calculateIconOffset({
  buttonSize,
  iconSize,
  buttonPadding,
  bias = 0,
}: {
  buttonSize: number;
  iconSize: number;
  buttonPadding: number;
  bias?: number;
}) {
  const centerOffset = (buttonSize - iconSize) / 2;
  return centerOffset - buttonPadding + bias;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withDefaults<T extends Record<string, any>>(
  defaults: T,
  overrides?: Partial<T>,
): T {
  return { ...defaults, ...overrides };
}

function normalizeDeg(a: number) {
  return ((a % 360) + 360) % 360;
}

function toNearestTurn(prev: number | undefined, target: number) {
  const b = normalizeDeg(target);
  if (prev === undefined) return b;
  const k = Math.round((prev - b) / 360);
  return b + 360 * k;
}

function useShortestRotation(target: number) {
  const prevRef = React.useRef<number | undefined>(undefined);
  return React.useMemo(() => {
    const next = toNearestTurn(prevRef.current, target);
    prevRef.current = next;
    return next;
  }, [target]);
}

function MenuButton({
  item,
  isActive,
  onActivate,
  menuButtonConfig,
}: {
  item: RadialNavItem;
  isActive?: boolean;
  onActivate?: () => void;
  menuButtonConfig: Required<MenuButtonConfig>;
}) {
  const { icon: Icon, label } = item;
  const { iconSize, buttonSize, buttonPadding } = menuButtonConfig;

  const translateX = calculateIconOffset({
    ...menuButtonConfig,
    bias: -1,
  });

  return (
    
    <motion.button
      {...BUTTON_MOTION_CONFIG}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={`relative flex space-x-1 items-center overflow-hidden whitespace-nowrap rounded-full border bg-background text-foreground font-medium transition-colors duration-300 ${
        isActive
          ? 'border-primary ring-2 ring-primary/40'
          : 'border-neutral-800 dark:border-neutral-200'
      }`}
      style={{
        height: buttonSize,
        minWidth: buttonSize,
        padding: buttonPadding,
      }}
      onClick={onActivate}
      type="button"
      role="menuitem"
      aria-pressed={!!isActive}
      aria-label={label}
    >
      <Icon
        className="shrink-0"
        style={{
          height: iconSize,
          width: iconSize,
          transform: `translateX(${translateX}px)`,
        }}
      />
      <motion.span
        variants={LABEL_VARIANTS}
        transition={LABEL_TRANSITION}
        className="invisible text-sm w-0"
      >
        {label}
      </motion.span>
    </motion.button>
  );
}

function RadialNav({
  size = 180,
  items,
  menuButtonConfig,
  defaultActiveId,
  onActiveChange,
}: RadialNavProps) {
  const orbitRadius = size / 2 - 0.5;
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const [activeId, setActiveId] = React.useState<number | null>(
    defaultActiveId ?? null,
  );
  
  // Track mouse coordinates to orient the central pointer
  const [mouseAngle, setMouseAngle] = React.useState<number | null>(null);

  const handleActivate = React.useCallback(
    (id: number) => {
      setActiveId(id);
      onActiveChange?.(id);
    },
    [onActiveChange],
  );

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      // Calculate angle in radians, then convert to degrees
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = angleRad * (180 / Math.PI);
      
      // Map screen angle (where Y is down) to navigation angle (where 0 deg is UP):
      // - Mouse straight UP: dy < 0, dx = 0 -> angleDeg = -90 -> angleInNav = 0
      // - Mouse straight RIGHT: dy = 0, dx > 0 -> angleDeg = 0 -> angleInNav = 90
      // - Mouse straight DOWN: dy > 0, dx = 0 -> angleDeg = 90 -> angleInNav = 180
      // - Mouse straight LEFT: dy = 0, dx < 0 -> angleDeg = 180 -> angleInNav = 270
      const angleInNav = angleDeg + 90;
      
      // Add the pointer icon's baseline orientation offset (45 deg)
      setMouseAngle(angleInNav + POINTER_BASE_DEG);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const baseAngle =
    mouseAngle !== null
      ? mouseAngle
      : (items.find((it) => it.id === activeId)?.angle ?? 0) + POINTER_BASE_DEG;
      
  const rotateAngle = useShortestRotation(baseAngle);

  const resolvedMenuButtonConfig = withDefaults(
    defaultMenuButtonConfig,
    menuButtonConfig,
  );

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center rounded-full border border-neutral-800 dark:border-neutral-200"
      style={{ width: size, height: size }}
      role="menu"
      aria-label="Radial navigation"
    >
      <motion.div
        initial={false}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: rotateAngle }}
        transition={POINTER_ROT_SPRING}
        style={{ originX: 0.5, originY: 0.5 }}
        aria-hidden="true"
      >
        <MousePointer2 className="size-5 text-foreground" />
      </motion.div>
      {items.map((item) => {
        const { id, angle } = item;
        const { x, y } = getPolarCoordinates(angle, orbitRadius);
        return (
          <div
            key={id}
            className="group absolute"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <MenuButton
              item={item}
              isActive={activeId === id}
              onActivate={() => handleActivate(id)}
              menuButtonConfig={resolvedMenuButtonConfig}
            />
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// DEMO CONTAINER: Centered with Headline
// ==========================================

const sampleItems: RadialNavItem[] = [
  { id: 1, icon: Home, label: 'Home', angle: 0 },
  { id: 2, icon: User, label: 'Profile', angle: 72 },
  { id: 3, icon: Mail, label: 'Messages', angle: 144 },
  { id: 4, icon: Bell, label: 'Notifications', angle: 216 },
  { id: 5, icon: Settings, label: 'Settings', angle: 288 },
];

export function RadialNavDemo() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-100 p-8 overflow-hidden select-none">
      {/* Visual background enhancements for premium styling */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />
      
      {/* Dynamic light glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center gap-12 max-w-lg w-full">
        {/* Premium Headline Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 font-sans">
            Radial Navigator
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-sm mx-auto font-medium">
            Hover and move your mouse across the screen to watch the central pointer dynamically track your cursor.
          </p>
        </div>

        {/* Centered navigation menu with glassmorphism container */}
        <div className="flex items-center justify-center p-8 bg-neutral-900/40 backdrop-blur-md rounded-[2.5rem] border border-neutral-800/80 shadow-2xl">
          <RadialNav items={sampleItems} defaultActiveId={1} size={220} />
        </div>
      </div>
    </div>
  );
}

export {
  RadialNav,
  type RadialNavItem,
  type MenuButtonConfig,
  type RadialNavProps,
};